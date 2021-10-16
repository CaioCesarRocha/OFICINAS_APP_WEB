import React, {useState, ChangeEvent} from 'react';
import {Form, Formik} from 'formik';
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
    senha: Yup.string().required('O campo Senha é obrigatório').min(6),
})

const CreateUser : React.FC<{}> = () =>{
    const [ formData, setFormData] = useState({
        name: "",
        email: "",
        senha: "",
    })
    const [errorEmail, setErrorEmail] = useState(false)

    const history = useHistory();

    const initialValues: FormValues = { name: '', email: '', senha: ''};

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target
        setFormData({...formData, [name]:value }) //copia tudo que ja tem la dentro pra evitar de um apagar o outro
    };


    async function handleSubmit(){
        const {name, email, senha} = formData;

       const dataUsers = []
            dataUsers.push({name: name, email: email, senha: senha})                              
            const dataUser  = JSON.stringify(dataUsers);

       const res = await api.post('users', dataUser, {
            headers: {
            'Content-Type': 'application/json'
            }
        });
        console.log(res)
        if(res.data.errorEmail === true){
            setErrorEmail(true);
        }
        else{
            alert('Usuário cadastrado com sucesso!');
            history.push({
                pathname: '/',
                state: {name: name, avatar: '', email: email}
            })
        }      
    };
    

    return(
        <div id="page-create-user">
            <header>
                <img className="logo_register" src={logo} alt="Oficina Mecânica" />
                <Link to="/login">
                <span><FiArrowLeft/></span>
                    Voltar para Home
                </Link>
            </header>
            
            <Formik
                validationSchema={schema}
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                {({errors}) =>(
                    <Form>
                        <h1>Cadastro do Usuário</h1>

                        <fieldset>
                            <div className="field">
                                <label htmlFor="name">Nome</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    onChange = {handleInputChange}                       
                                />
                                {errors.name &&(<div className="errorsForm">{errors.name}</div>)}
                            </div>
                                      
                            <div className="field">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    onChange = {handleInputChange}                                                               
                                />
                                {errors.email &&(<div className="errorsForm">{errors.email}</div>)} 
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
                                    onChange = {handleInputChange}
                                />
                                {errors.senha &&(<div className="errorsForm">{errors.senha}</div>)}                         
                            </div>
                        </fieldset>
                        <button type="submit" onClick={handleSubmit} >
                            Cadastrar Empresa
                        </button>
                    </Form>  
                )}
            </Formik>        
        </div>
    );

}

export default CreateUser;