import React, {useEffect, useState, ChangeEvent} from 'react';
import {Form, Formik} from 'formik';
import * as Yup from "yup";

import logo from '../../assets/logo.png';


interface FormValues { //necessário para o formik
    email: string;
    senha: string;
}

const schema = Yup.object().shape({ //validation com Yup
    email: Yup.string().email('Email inválido').required('O campo Email é obrigatório'),
    senha: Yup.string().required('O campo senha é obrigatório').min(6)
})


const Login = () =>{

    const initialValues: FormValues = { email: '', senha: ''};

    async function handleSubmit(){      
    };

    return(
        <div id="page-login">
            <header>
                <img className="logo_register" src={logo} alt="Oficina Mecânica" />
            </header>
            <Formik
                validationSchema={schema}
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                {({errors}) =>(
                    <Form>
                        <h1>Login</h1>
                    </Form> 
                )}
            </Formik>          
        </div>
    );

}

export default Login;