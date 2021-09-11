import React , {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft} from 'react-icons/fi';
import { TileLayer, Marker, MapContainer } from 'react-leaflet';
import api from '../../services/api';

import logo from '../../assets/logo.png';
import './style.css';


interface Item{  //Necessário declarar o tipo de dado que esta sendo carregado
    id: number,
    title: string,
    image_url: string,
}

const CreateMechanical = () =>{
    const [ items, setItems] = useState<Item[]>([]);
    useEffect(() => {
        api.get('items').then(response =>{
            setItems(response.data);
        })
    }, []);
    

    return(
        <div id="page-create-mechanical">
            <header>
                <img id="logo" src={logo} alt="Oficina Mecânica" />
                <Link to="/">
                <span><FiArrowLeft/></span>
                    Voltar para Home
                </Link>
            </header>

            <form>
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
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Email da Entidade</label>
                            <input
                                type="email"
                                name="email"
                                id="email"                       
                            />
                        </div>                 
                        <div className="field">
                        <label htmlFor="whatsapp">Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"                       
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o Endereço do Mapa</span>
                    </legend>
                    <MapContainer center={[-18.5913406,-46.5258909]} zoom={15} >
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[-18.5913406,-46.5258909]}/>
                    </MapContainer>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado - UF</label>
                            <select name="uf" id="uf">
                                <option value="0">Seleciona ai</option>
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city">
                                <option value="0">Seleciona ai</option>
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
                            <li key={item.id}>
                            <img src={item.image_url} alt="Troca de Óleo e Filtros"  id="componentes"/>
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