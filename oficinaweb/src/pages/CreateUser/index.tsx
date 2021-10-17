import React, {useState} from 'react';
import {useFormik} from 'formik';
import * as Yup from "yup";
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft} from 'react-icons/fi';

import api from '../../services/api';
import logo from '../../assets/logo.png';
import './style.css';


interface FormValues { //necessário para o formik
    name: string;
    email: string;
    senha: string;
}


const schema = Yup.object().shape({ //validation com Yup
    name: Yup.string().required('O campo Nome é obrigatório'),
    email: Yup.string().email('Email inválido').required('O campo Email é obrigatório'),
    senha: Yup.string().required('O campo Senha é obrigatório').min(6, 'A senha deve ter pelo menos 6 caracteres'),
})



const CreateUser : React.FC<{}> = () =>{
    const [errorEmail, setErrorEmail] = useState(false)

    const history = useHistory();

    const initialValues: FormValues = { name: '', email: '', senha: ''};


    async function handleSubmit(data : FormValues){

       const dataUsers = []
            dataUsers.push({name: data.name, email: data.email, senha: data.senha})                              
            const dataUser  = JSON.stringify(dataUsers);

       const res = await api.post('users', dataUser, {
            headers: {
            'Content-Type': 'application/json'
            }
        });

        return res
    };


    const formik = useFormik({
        
        initialValues: initialValues,
    
        validationSchema: schema,
    
        enableReinitialize: true,
    
        onSubmit: async (data) => {  
           
            const resposta = await handleSubmit(data);

            if(resposta.data.errorEmail === false){                  
                formik.resetForm();
                alert(`'Usuário ${data.name} cadastrado com sucesso!'`);
                history.push({
                    pathname: '/',
                    state: {name: data.name, avatar: '', email: data.email}
                })   
            }
            else{
                setErrorEmail(true)
            }                            
        }       
    })
    

    return(
        <div id="page-create-user">
            <header>
                <img className="logo_register" src={logo} alt="Oficina Mecânica" />
                <Link to="/">
                <span><FiArrowLeft/></span>
                    Voltar para Home
                </Link>
            </header>

                   
                    <form onSubmit={formik.handleSubmit}>
                        <h1>Cadastro do Usuário</h1>

                        <fieldset>
                            <div className="field">
                                <label htmlFor="name">Nome</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}                    
                                />
                                {formik.errors.name && formik.touched.name &&(<div className="errorsForm">{formik.errors.name}</div>)}
                            </div>
                                      
                            <div className="field">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}                                                                                  
                                />
                                {formik.errors.email && formik.touched.email &&(<div className="errorsForm">{formik.errors.email}</div>)} 
                                {
                                    errorEmail
                                    ?
                                    <div className="errorsForm">Este Email já foi utilizado.</div>
                                    :
                                    <div></div>
                                }
                            </div> 
                                                                     
                            <div className="field">
                                <label htmlFor="senha">Senha</label>
                                <input
                                    type="password"
                                    name="senha"
                                    id="senha"
                                    value={formik.values.senha}
                                    onChange={formik.handleChange}
                                />
                                {formik.errors.senha && formik.touched.senha &&(<div className="errorsForm">{formik.errors.senha}</div>)}                         
                            </div>
                        </fieldset>
                        <button type="submit" >
                            Finalizar Cadastro
                        </button>
                    </form>       
        </div>
    );

}

export default CreateUser;