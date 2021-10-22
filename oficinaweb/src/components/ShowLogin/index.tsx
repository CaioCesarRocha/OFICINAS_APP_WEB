import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { FiLogOut} from 'react-icons/fi';
import './styles.css';


interface Props{
    name: string | undefined;
    email: string | undefined;
    avatar: string | undefined;
}


const ShowLogin: React.FC<Props>= ({name, email, avatar}) => {
const [names, setNames] = useState<string|undefined>();
const [emails, setEmails] = useState<string|undefined>();
const [images, setImages] = useState<string|undefined>();

useEffect(() => {
    setNames(name);
    setEmails(email);
    setImages(avatar);
    console.log(images)
    if(images === ''){
        const notAvatar = "https://cursos.ifsp.edu.br/static/img/avatar.png"
        setImages(notAvatar)
    }
}, []);

    return(       
        <div id="login">           
            <Link to="/login">
                <img src={images}/>
                <span className="text">{names}</span>
            </Link>          
        </div>
    );
    
}


export default ShowLogin;