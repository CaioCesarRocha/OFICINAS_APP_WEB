import React , {useEffect, useState, ChangeEvent} from 'react';
import { Link, useHistory, useLocation} from 'react-router-dom';
import { FiArrowLeft} from 'react-icons/fi';
import { TileLayer, Marker, MapContainer, useMapEvents} from 'react-leaflet';
import axios from 'axios';
import Dropzone from '../../components/Dropzone';
import {useFormik} from 'formik';
import * as Yup from "yup";

import api from '../../services/api';
import logo from '../../assets/logo.png';
import './style.css';



interface Location{  
    logged: boolean;
    name: string;
    email: string;
    avatar: string;
}

interface Item{  //Necessário declarar o tipo de dado que esta sendo carregado
    id: number,
    title: string,
    image_url: string,
}

interface IBGEUFResponse{
    sigla: string;
}

interface IBGECityResponse{
    nome: string;
}

interface FormValues { //necessário para o formik
    name: string;
    email: string;
    whatsapp: string;
    city: string;
    uf: string;
}


const schema = Yup.object().shape({ //validation com Yup
    name: Yup.string().required('O campo Nome é obrigatório'),
    email: Yup.string().email('Email inválido').required('O campo Email é obrigatório'),
    whatsapp: Yup.string().required('O campo Whatsapp é obrigatório'),
})


const CreateMechanical : React.FC<{}> = () =>{
    const [ items, setItems] = useState<Item[]>([]);
    const [ ufs, setUfs] = useState<string[]>([]);
    const [ cities, setCities] = useState<string[]>([]);

    const [ selectedUf, setSelectedUf] = useState('0');//Armazenando o estado atual da UF/cidade/ latitudes-longitude
    const [ selectedCity, setSelectedCity] = useState('0');
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0]);
    const [ selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedFile, setSelectedFile] = useState<File>();

    const history = useHistory();
    const location = useLocation<Location>();

    const initialValues: FormValues = { name: '', email: '', whatsapp: '', city:'', uf: ''};

    useEffect(() => {
        try{
            if(location.state.logged === false){
                alert('É necessário estar logado para concluir o cadastro!');
                history.push('/login');
            }
            else{
                getItems();
                getUfs();
                getCitys();
            }
        }
        catch{}
            
    }, [selectedUf]);

    function getItems(){
        api.get('items').then(response =>{
            setItems(response.data);
        })
    }

    function getUfs(){
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);
            console.log(ufInitials)
            setUfs(ufInitials);
        });
    }

    function getCitys(){

        if(selectedUf === '0'){
             return;
        }
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
        .then(response => {
            const cityNames = response.data.map(city=> city.nome);
            setCities(cityNames);
        });
    }
    

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value;
        setSelectedUf(uf);
    }
    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value;
        setSelectedCity(city);
    }
    function LocationMarker(){
        const map = useMapEvents({
            click: (event) => {
                setSelectedPosition([
                    event.latlng.lat,
                    event.latlng.lng
                ]);
            },
          })      
        return null   
    }
    function handleSelectItem(id: number){
        const alreadySelected = selectedItems.findIndex(item => item === id);//pra atualizar a lista selecionada sem somar o msm id
        if(alreadySelected >= 0){
            const filteredItems = selectedItems.filter(item => item !== id);
            setSelectedItems(filteredItems);
        }else{
            setSelectedItems([...selectedItems , id])
        }      
    };

    async function handleSubmit(data : FormValues){
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;

        const dataMechanical = new FormData(); // transforma os dados que eram json em multipart(poder enviar arquivo)

        dataMechanical.append('name', data.name);
        dataMechanical.append('email', data.email);
        dataMechanical.append('whatsapp', data.whatsapp);
        dataMechanical.append('uf', uf);
        dataMechanical.append('city', city);
        dataMechanical.append('latitude', String(latitude));
        dataMechanical.append('longitude', String(longitude));       
        dataMechanical.append('items', items.join(','));
        if(selectedFile){
            dataMechanical.append('image', selectedFile)
        }
        const res = await api.post('mechanicals', dataMechanical);

        return res
    };

 
    const formik = useFormik({
        
        initialValues: initialValues,
    
        validationSchema: schema,
    
        enableReinitialize: true,
    
        onSubmit: async (data) => {              
            const resposta = await handleSubmit(data);
            
            formik.resetForm();
            alert(`'Empresa ${resposta.data.name} cadastrada com sucesso!'`);
            history.push({
                pathname: '/',
                state: {name: location.state.name, avatar: location.state.avatar, email: location.state.email}
            })   
        }                                     
    })

    

    return(
        <div id="page-create-mechanical">
            <header>
                <img className="logo_register" src={logo} alt="Oficina Mecânica" />
                <Link
                    to={{
                        pathname: "/", 
                        state: { name: location.state.name, email: location.state.email, avatar: location.state.avatar}
                    }}
                >
                    <span><FiArrowLeft/></span>
                    Voltar para Home
                </Link>
            </header>
                    <form onSubmit={formik.handleSubmit}>
                        <h1>Cadastro da Empresa</h1>

                        <Dropzone onFileUploaded={setSelectedFile}/>

                        <fieldset>
                            <legend>
                                <h2>Dados</h2>
                            </legend>
                            <div className="field">
                                <label htmlFor="name">Nome da Entidade</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}                                                           
                                />
                                {formik.errors.name &&(<div className="errorsForm">{formik.errors.name}</div>)}
                            </div>

                            <div className="field-group">
                                <div className="field">
                                    <label htmlFor="email">Email da Entidade</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}                                                                
                                    />
                                    {formik.errors.email &&(<div className="errorsForm">{formik.errors.email}</div>)} 
                                </div>                 
                                <div className="field">
                                    <label htmlFor="whatsapp">Whatsapp</label>
                                    <input
                                        type="text"
                                        name="whatsapp"
                                        id="whatsapp"
                                        value={formik.values.whatsapp}
                                        onChange={formik.handleChange}  
                                    />
                                    {formik.errors.whatsapp &&(<div className="errorsForm">{formik.errors.whatsapp}</div>)}                         
                                </div>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>
                                <h2>Endereço</h2>
                                <span>Selecione o Endereço do Mapa</span>
                            </legend>
                            <MapContainer center={[-18.5913406,-46.5258909]} zoom={15}>
                                <TileLayer
                                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <LocationMarker/> 
                                <Marker position={selectedPosition}/>
                            </MapContainer>

                            <div className="field-group">
                                <div className="field">
                                    <label htmlFor="uf">Estado - UF</label>
                                    <select 
                                        name="uf" 
                                        id="uf" 
                                        value={selectedUf}  
                                        onChange={handleSelectUf}
                                    >
                                        <option value="0">Selecione uma UF</option>
                                        {ufs.map(uf =>(
                                            <option key={uf} value={uf}>{uf}</option>
                                        ))};
                                    </select>
                                </div>

                                <div className="field">
                                    <label htmlFor="city">Cidade</label>
                                    <select 
                                        name="city" 
                                        id="city" 
                                        value={selectedCity} 
                                        onChange={handleSelectCity}
                                    >
                                        <option value="0">Selecione um Ciddade</option>
                                        {cities.map(city =>(
                                            <option key={city} value={city}>{city}</option>
                                        ))};
                                    </select>
                                </div>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>
                                <h2>Itens Trabalhados</h2>
                                <span>Selecione um ou mais itens abaixo</span>
                            </legend>
                            <ul className="items-grid">
                                {items.map(item => (
                                    <li 
                                        key={item.id}
                                        onClick={ () => handleSelectItem(item.id)}
                                        className={selectedItems.includes(item.id) ? 'selected' : ''}
                                    >
                                        <img src={item.image_url} alt={item.title} id="componentes"/>
                                        <span>{item.title}</span>
                                    </li>
                                ))}                  
                            </ul>
                        </fieldset>

                        <button type="submit">
                            Cadastrar Empresa
                        </button>
                    </form>    
        </div>
    );
}

export default CreateMechanical;