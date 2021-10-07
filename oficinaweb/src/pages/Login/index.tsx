import React, {useEffect, useState, ChangeEvent} from 'react';
import {Form, Formik} from 'formik';
import * as Yup from "yup";
import {GoogleLogin, GoogleLogout, GoogleLoginResponse, GoogleLoginResponseOffline} from 'react-google-login';

import logo from '../../assets/logo.png';
import './style.css';


interface FormValues { //necessário para o formik
    email: string;
    senha: string;
}


const schema = Yup.object().shape({ //validation com Yup
    email: Yup.string().email('Email inválido').required('O campo Email é obrigatório'),
    senha: Yup.string().required('O campo senha é obrigatório').min(6)
})


interface teste{
    profileObj:{
        email: string,
        familyName: string,
        givenName: string,
        googleId: number,
        imageUrl: string,
        name: string
    }
}


const Login : React.FC<[]> = () =>{
    const [ formData, setFormData] = useState({
        email: "",
        senha: "",
    })

    const initialValues: FormValues = { email: '', senha: ''};

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target
        setFormData({...formData, [name]:value }) //copia tudo que ja tem la dentro pra evitar de um apagar o outro
    };

    
    function loginSuccess(response: GoogleLoginResponse | GoogleLoginResponseOffline ) {
        if  ( "profileObj"  in  response )  { 
            console.log(response.profileObj )  // funciona bem 
        }
    }
    const loginFailure = () =>{
        console.log('Fail');
    }
    const logoutSuccess = () => {      
        console.log('Success');
    }
    const logoutFailure = () =>{
        console.log('Fail');
    }

    async function handleSubmit(){      
    };

    return(
        <div id="page-login">
            <header>
                <img  src={logo} alt="Oficina Mecânica" />
            </header>
            <Formik
                validationSchema={schema}
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                {({errors}) =>(
                    <Form>
                        <h1>Login</h1>
                        <fieldset>
                            <div className="field">
                                <label htmlFor="email">Informe seu e-mail</label>
                                <input
                                    type="text"
                                    name="email"
                                    id="email"
                                    onChange = {handleInputChange}                       
                                />
                                {errors.email &&(<div className="errorsForm">{errors.email}</div>)}
                            </div>
                            <div className="field">
                                <label htmlFor="senha">Insira a senha</label>
                                <input
                                    type="password"
                                    name="senha"
                                    id="senha"
                                    onChange = {handleInputChange}                       
                                />
                                {errors.senha &&(<div className="errorsForm">{errors.senha}</div>)}
                            </div>
                        </fieldset>
                        <button type="submit" onClick={handleSubmit} >
                            Entrar
                        </button>
                        <div className="google_login">
                            <GoogleLogin
                                clientId={clienteID}
                                onSuccess={loginSuccess}
                                onFailure={loginFailure}
                                cookiePolicy={'single_host_origin'}
                                isSignedIn={true}
                                accessType={'code'}
                                responseType={'code'}                             
                            />
                        </div>  
                        <div className="google_login">
                            <GoogleLogout
                                clientId={clienteID}
                                onLogoutSuccess={logoutSuccess}
                                onFailure={logoutFailure}                           
                            />
                        </div>  
                    </Form> 
                )}
            </Formik>                 
        </div>
    );

}

export default Login;