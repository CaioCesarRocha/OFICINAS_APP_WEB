import React , {useEffect, useState, ChangeEvent, FormEvent} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft} from 'react-icons/fi';
import { TileLayer, Marker, MapContainer, useMapEvents} from 'react-leaflet';
import {LeafletMouseEvent} from 'leaflet';
import axios from 'axios';
import api from '../../services/api';

import logo from '../../assets/logo.png';
import './style.css';


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


const CreateMechanical = () =>{
    const [ items, setItems] = useState<Item[]>([]);
    const [ ufs, setUfs] = useState<string[]>([]);
    const [ cities, setCities] = useState<string[]>([]);

    const [ formData, setFormData] = useState({
        name: "",
        email: "",
        whatsapp: "",
    })

    const [ selectedUf, setSelectedUf] = useState('0');//Armazenando o estado atual da UF/cidade/ latitudes-longitude
    const [ selectedCity, setSelectedCity] = useState('0');
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0]);
    const [ selectedItems, setSelectedItems] = useState<number[]>([]);

    const history = useHistory();

    useEffect(() => {
        api.get('items').then(response =>{
            setItems(response.data);
        })
    }, []);

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);
            setUfs(ufInitials);
        });
    }, []);

    useEffect(() => {// necessário carregar as citys sempre que a UF mudar
        if(selectedUf === '0'){
            return;
        }
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
        .then(response => {
            const cityNames = response.data.map(city=> city.nome);
            setCities(cityNames);
        });
    }, [selectedUf]);


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
    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target
        setFormData({...formData, [name]:value }) //copia tudo que ja tem la dentro pra evitar de um apagar o outro
    };
    function handleSelectItem(id: number){
        const alreadySelected = selectedItems.findIndex(item => item === id);//pra atualizar a lista selecionada sem somar o msm id
        if(alreadySelected >= 0){
            const filteredItems = selectedItems.filter(item => item !== id);
            setSelectedItems(filteredItems);
        }else{
            setSelectedItems([...selectedItems , id])
        }      
    };
    async function handleSubmit(event: FormEvent){
        event.preventDefault();// evita de procurar pela proxima pagina(recarregar)
        const {name, email, whatsapp} = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;
        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items,
        }
        await api.post('mechanicals', data);

        alert('Empresa cadastrada com sucesso!');
        history.push('/');
    };
    

    return(
        <div id="page-create-mechanical">
            <header>
                <img id="logo" src={logo} alt="Oficina Mecânica" />
                <Link to="/">
                <span><FiArrowLeft/></span>
                    Voltar para Home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro da Empresa</h1>

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
                            onChange = {handleInputChange}                       
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Email da Entidade</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange = {handleInputChange}                         
                            />
                        </div>                 
                        <div className="field">
                        <label htmlFor="whatsapp">Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange = {handleInputChange}                         
                            />
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