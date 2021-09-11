import React from 'react';
import { FiLogIn} from 'react-icons/fi';
import { Link } from 'react-router-dom';

import logo from '../../assets/logo.png';
import './style.css';

const Home = () =>{
    return(
        <div id="page-home">
            <div className="content">
                <header>
                    <img id="logo" src={logo} alt="Oficina Mecânica" />
                </header>
                <main>
                    <h1>Seu marketplace de Oficinas Mecânicas</h1>
                    <p>Ajudamos pessoas a encontrar Oficinas mais próximas da sua localidade atual!</p>
                    <Link to="/create-mechanical">
                        <span><FiLogIn/></span>
                        <strong>Cadastre a sua Empresa aqui!</strong>
                    </Link>
                </main>
                
            </div>
        </div>
    );
}

export default Home;