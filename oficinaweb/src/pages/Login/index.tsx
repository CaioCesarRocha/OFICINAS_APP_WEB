import React, { useEffect,useState, ChangeEvent} from 'react';
import {useFormik} from 'formik';
import * as Yup from "yup";
import {Link, useHistory} from 'react-router-dom';
import {GoogleLogin, GoogleLogout, GoogleLoginResponse, GoogleLoginResponseOffline} from 'react-google-login';

import api from '../../services/api';
import logo from '../../assets/logo.png';
import './style.css';



interface FormValues { //necessário para o formik
    email: string;
    senha: string;
}

const id = process.env.REACT_APP_API_KEY
const clienteID = '656590032305-6mv2pfd3v262aoqf2ji6gu9unrbt594e.apps.googleusercontent.com';

  
const schema = Yup.object().shape({ //validation com Yup
    email: Yup.string().email('Email inválido').required('O campo Email é obrigatório'),
    senha: Yup.string().required('O campo senha é obrigatório')
})


const Login : React.FC<{}> = () =>{
    const [ wrongPass, setWrongPass] = useState(false)
 
    const initialValues: FormValues = { email: '', senha: ''};

    const history = useHistory();


    //LOGIN GOOGLE
    async function loginSuccess(response: GoogleLoginResponse | GoogleLoginResponseOffline ) {
        if ("profileObj" in  response)  {   
            console.log(response)          
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
    

    //LOGIN NORMAL
    async function handleSubmit(data: FormValues){ 
  
        console.log("entrei submit") 
        const dataUsers = []
        dataUsers.push({email: data.email, senha: data.senha})                              
        const dataUser  = JSON.stringify(dataUsers);

        const res = await api.post('loginEnter', dataUser, {
            headers: {
            'Content-Type': 'application/json'
            }
        });
        console.log(res)
        return res    
    };

    const formik = useFormik({
        
        initialValues: initialValues,
    
        validationSchema: schema,
    
        enableReinitialize: true,
    
        onSubmit: async (data) => {              
            const resposta = await handleSubmit(data);

            if(resposta.data.wrongPass === false){                  
                formik.resetForm();
                alert(`'Usuário ${resposta.data.name} logado com sucesso!'`);
                history.push({
                    pathname: '/',
                    state: {name: resposta.data.name, avatar: '', email: data.email}
                })   
            }
            else{
                setWrongPass(true)
            }                            
        }       
    })


    return(
        <div id="page-login">
            <header>
                <img  src={logo} alt="Oficina Mecânica" />
            </header>
   
                <form onSubmit={formik.handleSubmit}>
                    <h1>Login</h1>
                    <fieldset>
                        <div className="field">
                            <label htmlFor="email">Informe seu e-mail</label>
                            <input
                                type="text"
                                name="email"
                                id="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}                      
                            />
                            {formik.errors.email && formik.touched.email &&(<div className="errorsForm">{formik.errors.email}</div>)}
                        </div>

                        <div className="field">
                            <label htmlFor="senha">Insira a senha</label>
                            <input
                                type="password"
                                name="senha"
                                id="senha"
                                value={formik.values.senha}
                                onChange={formik.handleChange}                      
                            />
                            {formik.errors.senha && formik.touched.senha &&(<div className="errorsForm">{formik.errors.senha}</div>)}
                            {
                                wrongPass
                                ?
                                <div className="errorsForm">Email ou Senha Incorretos!</div>
                                :
                                <div></div>
                            }
                        </div>
                    </fieldset>

                    <button type="submit">
                        Entrar
                    </button>

                    <div id="register">Ainda não se cadastrou? 
                        <Link to={"/create-user"}>
                            <strong>Cadastre aqui</strong>
                        </Link>                           
                    </div>

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
                </form>               
        </div>
    );

}

export default Login;