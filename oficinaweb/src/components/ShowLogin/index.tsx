import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { FiLogOut} from 'react-icons/fi';
import './styles.css';


interface Props{
    sub: string;
    name: string;
    email: string;
    image: string;
}

const ShowLogin: React.FC<Props>= ({sub, name, email, image}) => {

const [subs, setSubs] = useState('');
const [names, setNames] = useState('');
const [emails, setEmails] = useState('');
const [images, setImages] = useState('');

const url = 'https://lh3.googleusercontent.com/a/AATXAJxrg30A1SrRNR93A_RaPHtktt_G73vUJ8YZsgZU=s96-c';

useEffect(() => {
    setSubs(sub);
    setNames(name);
    setEmails(email);
    setImages(image);
}, []);

    return(       
        <div id="login">           
            <Link to="/login">
                <img src={url}/>
                <text>{subs}</text>
            </Link>          
        </div>
    );
    
}


export default ShowLogin;