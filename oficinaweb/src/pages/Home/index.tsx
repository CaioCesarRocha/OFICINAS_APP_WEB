import React from 'react';
import './style.css';
import { FiLogIn} from 'react-icons/fi';
import logo from '../../assets/logo.png';

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
                    <a href="/cadastro">
                        <span><FiLogIn/></span>
                        <strong>Cadastre a sua Empresa aqui!</strong>
                    </a>
                </main>
                
            </div>
        </div>
    );
}

export default Home;