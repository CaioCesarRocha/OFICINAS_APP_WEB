import React, {useState, useEffect} from 'react';
import { FiLogIn, FiEdit, FiLogOut} from 'react-icons/fi';
import { Link, useLocation} from 'react-router-dom';
import ShowLogin from '../../components/ShowLogin';
import logo from '../../assets/logo.png';
import './style.css';

interface Location{  
    name: string;
    email: string;
    avatar: string;    
}

const Home = () =>{
    const [ logged, setLogged] = useState<boolean>(false);
    const [name, setName] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [avatar, setAvatar] = useState<string>();

    const location = useLocation<Location>();

    useEffect(() => {
        try{                   
            setName(location.state.name)
            setEmail(location.state.email) 
            setAvatar(location.state.avatar)
            setLogged(true)                      
        }
        catch{
            setLogged(false)
        }       
    }, [location]);


    return(
        <div id="page-home">
            <div className="content">
                <header>
                    {
                        logged                      
                        ?                                      
                        <ShowLogin name={name} email={email} avatar={avatar}/>
                        :
                        <Link to="/login"> 
                            <span><FiLogIn/></span>
                            FAZER LOGIN                                                                             
                        </Link>                                            
                    } 
                </header>
                <img id="logoHome" src={logo} alt="Oficina Mecânica" />                                   
                
                <main>
                    <h1>Seu marketplace de Oficinas Mecânicas</h1>
                    <p>Ajudamos pessoas a encontrar Oficinas mais próximas da sua localidade atual!</p>
                    <Link
                        to={{
                            pathname: "/create-mechanical", 
                            state: { logged: logged, name: name, email: email, avatar: avatar}
                        }}
                    >
                        <span><FiEdit/></span>
                        <strong>Cadastre a sua Empresa aqui!</strong>
                    </Link>
                </main>
                
            </div>
        </div>
    );
}

export default Home;