import React, {useState, useEffect} from 'react';
import { FiLogIn, FiEdit, FiLogOut} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import ShowLogin from '../../components/ShowLogin';
import logo from '../../assets/logo.png';
import './style.css';



const Home = () =>{
    const [ logged, setLogged] = useState<boolean>(true);


    return(
        <div id="page-home">
            <div className="content">
                <header>
                    <img id="logo" src={logo} alt="Oficina Mecânica" />
                    {
                        logged                      
                        ?                                      
                        <ShowLogin sub="Caio Cesarz" name="teste" email="teste" image="www"/>
                        :
                        <Link to="/login">
                            <span><FiLogIn/></span>
                            FAZER LOGIN
                        </Link>                                            
                    }                 
                </header>
                <main>
                    <h1>Seu marketplace de Oficinas Mecânicas</h1>
                    <p>Ajudamos pessoas a encontrar Oficinas mais próximas da sua localidade atual!</p>
                    <Link to="/create-mechanical">
                        <span><FiEdit/></span>
                        <strong>Cadastre a sua Empresa aqui!</strong>
                    </Link>
                </main>
                
            </div>
        </div>
    );
}

export default Home;