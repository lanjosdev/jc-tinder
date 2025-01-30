// Funcionalidades / Libs:
// import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { USER_REGISTER } from "../../API/userApi";

// Contexts:
// import UserContext from "../../contexts/userContext";

// Components:
import { toast } from "react-toastify";
import { InputPassword } from "../../components/InputPassword/InputPassword";
// import { NavMenu } from "../../components/NavMenu/NavMenu";

// Utils
// import { primeiraPalavra } from "../../utils/formatStrings";

// Assets:
// import imgLogo from '../../assets/LOGO-BIZSYS_preto.png';

// Estilo:
import './style.css';



export default function Register() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
        error: null,
        password: null
    });
    
    // Dados a submeter
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [dateBirth, setDateBirth] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');



    useEffect(()=> {
        function initializePage() {
            console.log('Effect /Register');
            // console.log(error);
        } 
        initializePage();
    }, []);
    


    function handleChangePassword(e) {
        setError((prev) => ({
            ...prev, 
            password: null
        }));
        setPassword(e.target.value);
    }

    function handleChangePasswordConfirm(e) {
        if(e.target.value == password) {
            setError((prev) => ({
                ...prev, 
                password: null
            }));
        }
        setPasswordConfirm(e.target.value);
    }
    function handleBlurPasswordConfirm() {
        if(passwordConfirm.length > 0 && passwordConfirm != password) {
            setError((prev) => ({
                ...prev, 
                password: 'Confirme a senha corretamente'
            }));
        }
    }


    // SUBMIT API
    async function handleSubmitRegister(e) {
        e.preventDefault();
        setLoading(true);

        // Validações
        console.log(name)
        console.log(phone)
        console.log(dateBirth)
        console.log(password)
        console.log(passwordConfirm)

        if(passwordConfirm != password) {
            setError((prev) => ({
                ...prev, 
                password: 'Confirme a senha corretamente'
            }));
            toast.error('Confirme a senha corretamente');

            setLoading(false);
            return;
        }


        // SUBMIT
        try {
            const response = await USER_REGISTER(name, phone, dateBirth, password);
            console.log(response);

            if(response.success) {
                toast.success('Cadastro realizado!');
            }
            else if(response.success == false) {
                if(!response.errors) {
                    toast.error(response.message);
                    // setLoading(false); 
                    // return;
                }

                //=// Restante das validações
            }
            else {
                toast.error('Erro inesperado.');
            }
        }
        catch(error) {
            console.error('Deu erro: ', error);

            if(error?.response?.data?.message == 'Unauthenticated.') {
                console.error('Requisição não autenticada.');
            }
            else {
                toast.error('Houve algum erro.');
            }
        }

        setLoading(false);
    }

    
  
    return (
        <div className="Page Register">
            
            {/* <NavMenu /> */}

            <main className='PageContent RegisterContent grid'>
                {/* <div className="top_actions">

                </div> */}

                <div className="title_page">
                    <h1>Cadastro com Telefone</h1>
                </div>

                <div className="content_main">
                    <form className="form" onSubmit={handleSubmitRegister} autoComplete="off">
                        <div className="label--input">
                            <label htmlFor="name">Nome</label>
                            <input 
                            id="name" 
                            className="input" 
                            type="text" 
                            placeholder="Digite seu nome" 
                            value={name}
                            onChange={(e)=> setName(e.target.value)}
                            required 
                            />
                        </div>

                        <div className="label--input">
                            <label htmlFor="nascimento">Data de nascimento</label>
                            <small>Para cadastrar é necessário ser maior de idade.</small>
                            <input id="nascimento" className="input" 
                            type="date" 
                            value={dateBirth}
                            onChange={(e)=> setDateBirth(e.target.value)}
                            required 
                            />
                        </div>

                        <div className="label--input">
                            <label htmlFor="">Número de telefone</label>
                            {/* //=// */}
                            <input className="input" type="tel" 
                            placeholder="(99) 99999-9999" 
                            value={phone}
                            onChange={(e)=> setPhone(e.target.value)}
                            required 
                            />
                        </div>

                        {/* Senhas */}
                        <div className="label--input">
                            <label>Senha</label>

                            <InputPassword 
                            value={password} 
                            funcSetValue={handleChangePassword} 
                            />
                        </div>
                        <div className="label--input">
                            <label>Confirmar senha</label>

                            <InputPassword 
                            value={passwordConfirm} 
                            funcSetValue={handleChangePasswordConfirm} 
                            dataError={error?.password}
                            funcOnBlur={handleBlurPasswordConfirm}
                            />
                        </div>


                        {/* Butão submit */}
                        <div className="btns_container">
                            <button className="btn primary" disabled={loading}>Cadastrar com Telefone</button>
                        </div>
                    </form>

                    <Link to='/login'>Já possuo uma conta. Fazer login!</Link>
                </div>
            </main>

        </div>
    );
}