// Funcionalidades / Libs:
// import Cookies from "js-cookie";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router";
import { USER_REGISTER } from "../../API/userApi";

// Contexts:
// import UserContext from "../../contexts/userContext";
import UserContext from "../../contexts/userContext";

// Components:
import { toast } from "react-toastify";
import { NavBarSecundary } from "../../components/NavBar/Secundary/NavBarSecundary";
import { InputPassword } from "../../components/InputPassword/InputPassword";
// import { NavMenu } from "../../components/NavMenu/NavMenu";

// Utils
// import { primeiraPalavra } from "../../utils/formatStrings";

// Assets:
// import imgLogo from '../../assets/LOGO-BIZSYS_preto.png';

// Estilo:
import './style.css';



export default function Register() {
    const { loading, logarUser } = useContext(UserContext);

    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [error, setError] = useState({
        error: null,
        name: null,
        dateBirth: null,
        phone: null,
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
        setLoadingSubmit(true);
        setError({
            error: null,
            name: null,
            dateBirth: null,
            phone: null,
            password: null
        });
        console.log(name)
        console.log(phone)
        console.log(dateBirth)
        console.log(password)
        console.log(passwordConfirm)


        // VALIDAÇÕES
        if(passwordConfirm != password) {
            setError((prev) => ({
                ...prev, 
                password: 'Confirme a senha corretamente'
            }));
            toast.error('Confirme a senha corretamente');

            setLoadingSubmit(false);
            return;
        }


        // SUBMIT
        try {
            const response = await USER_REGISTER(name, phone, dateBirth, password);
            console.log(response);

            if(response.success) {
                ////toast.success('Cadastro realizado!');

                await logarUser(phone, password, '/forms');
            }
            else if(response.success == false) {
                toast.error(response.message);
                
                if(response.errors?.name) {
                    setError(prev => ({...prev, name: response.errors.name[0]})); //=// Campo nome é obrigatório. > fazer nas validações
                }
                if(response.message == "Não é possível particpar do app sendo menor de idade.") {
                    setError(prev => ({...prev, dateBirth: true}));
                }
                if(response.errors?.phone || response.message == "Já existe um registro com esse número, por favor verifique.") {
                    setError(prev => ({...prev, phone: true})); //=// Campo número celular deve conter no mínimo 11 digitos. > fazer nas validações
                }
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

        setLoadingSubmit(false);
    }

    
  
    return (
        <div className="Page Register">
            
            <NavBarSecundary/>

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
                            data-error={`${error.name}`}
                            required 
                            />

                            {error.name && (
                                <span className="txt-erro">{error.name}</span>
                            )}
                        </div>

                        <div className="label--input">
                            <label htmlFor="nascimento">Data de nascimento</label>
                            <small className={error.dateBirth ? 'txt-erro' : ''}>
                                Para cadastrar é necessário ser maior de idade.
                            </small>
                            <input id="nascimento" className="input" 
                            type="date" 
                            value={dateBirth}
                            onChange={(e)=> setDateBirth(e.target.value)}
                            data-error={`${error.dateBirth}`}
                            required 
                            />
                        </div>

                        <div className="label--input">
                            <label htmlFor="">Número de telefone</label>
                            <input className="input" type="tel" 
                            placeholder="WhatsApp (Ex: 11980556891)" 
                            minLength="11" maxLength="11"
                            value={phone}
                            onChange={(e)=> setPhone(e.target.value)}
                            data-error={`${error.phone}`}
                            required 
                            />

                            {error.phone && (
                                <span className="txt-erro">{error.phone}</span>
                            )}
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
                            <button className="btn primary" disabled={loading || loadingSubmit}>Cadastrar com Telefone</button>
                        </div>
                    </form>

                    <Link to='/login'>Já possuo uma conta. Fazer login!</Link>
                </div>
            </main>

        </div>
    );
}