import React, {useEffect, useState, ChangeEvent} from 'react';
import {Form, Formik} from 'formik';
import * as Yup from "yup";
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft} from 'react-icons/fi';
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



const CreateUser = () =>{

    const [ formData, setFormData] = useState({
        email: "",
        senha: "",
    })

    const history = useHistory();

    const initialValues: FormValues = { email: '', senha: ''};

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target
        setFormData({...formData, [name]:value }) //copia tudo que ja tem la dentro pra evitar de um apagar o outro
    };

    async function handleSubmit(){
        const {email, senha} = formData;

        const data = new FormData();
        data.append('email', email);
        data.append('name', senha);

        await api.post('mechanicals', data);

        alert('Empresa cadastrada com sucesso!');
        history.push('/login');
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
                        <h1>Cadastro de Usuário</h1>
                        <fieldset>
                            <legend>
                                <h2>Dados</h2>
                            </legend>
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
                            Cadastrar
                        </button>
                    </Form> 
                )}
            </Formik>          
        </div>
    );

}

export default CreateUser;