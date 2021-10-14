import React, { useState, ChangeEvent} from 'react';
import {Form, Formik} from 'formik';
import * as Yup from "yup";
import { useHistory} from 'react-router-dom';
import {GoogleLogin, GoogleLogout, GoogleLoginResponse, GoogleLoginResponseOffline} from 'react-google-login';

import api from '../../services/api';
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



const Login : React.FC<[]> = () =>{
    const [ formData, setFormData] = useState({
        email: "",
        senha: "",
    })
 
    const initialValues: FormValues = { email: '', senha: ''};

    const history = useHistory();

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target
        setFormData({...formData, [name]:value }) //copia tudo que ja tem la dentro pra evitar de um apagar o outro
    };


    async function loginSuccess(response: GoogleLoginResponse | GoogleLoginResponseOffline ) {
        if ("profileObj" in  response)  {             
            const Name = response.profileObj.name
            const Avatar = response.profileObj.imageUrl
            const Email = response.profileObj.email
            const token_id = response.tokenId          
            const tokens = []
            tokens.push({id: token_id})                              
            const token = JSON.stringify(tokens);
                 
            await api.post('login', token, {
                headers: {
                  'Content-Type': 'application/json'
                }
            });     
            refreshTokenSetup(response);

            alert(`'Usuário ${Name} logado!'`);

            history.push({
                pathname: '/',
                state: {name: Name, avatar: Avatar, email: Email}
            })
        }       
    }
    const loginFailure = () =>{
        console.log('Fail');
    }
    const logoutSuccess = () => {      
        console.log('Deslogado com sucesso!');
    }
    const logoutFailure = () =>{
        console.log('Fail');
    }
    function refreshTokenSetup(response: GoogleLoginResponse | GoogleLoginResponseOffline) {
        if ("tokenObj" in  response)  {
            let refreshTiming = (response.tokenObj.expires_in || 3600 - 5 * 60) * 1000;

            const refreshToken = async () => {
                const newAuthRes = await response.reloadAuthResponse();

                refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000;
                
                // saveUserToken(newAuthRes.access_token);  <-- save new token
                localStorage.setItem('authToken', newAuthRes.id_token);

                // Setup the other timer after the first one
                setTimeout(refreshToken, refreshTiming);
            };
            // Setup first refresh timer
            setTimeout(refreshToken, refreshTiming);
        }
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
                                isSignedIn={false}                          
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
