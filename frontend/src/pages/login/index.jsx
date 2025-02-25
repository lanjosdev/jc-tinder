// Funcionalidades / Libs:
// import Cookies from "js-cookie";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router";

// Contexts:
import UserContext from "../../contexts/userContext";

// Components:
import { InputPassword } from "../../components/InputPassword/InputPassword";

// Utils

// Assets:
import imgLogo from '../../assets/Logo.png';

// Estilo:
import './style.css';



export default function Login() {
    const { loading, logarUser } = useContext(UserContext);

    // const navigate = useNavigate();
    // const [error, setError] = useState(null);
    

    // Dados a submiter
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');



    useEffect(()=> {
        function initializePage() {
            console.log('Effect /Login');
            
        } 
        initializePage();
    }, []);
    

    
    function handleChangePhone(e) {
        setPhone(e.target.value);
    }
    function handleChangePassword(e) {
        setPassword(e.target.value);
    }


    // Submit para login
    async function handleSubmitLogin(e) {
        e.preventDefault();

        if(phone !== '' && password !== '') {
            logarUser(phone, password);
        }        
    } 


  
    return (
        <div className="Page Login">
            
            <main className='PageContent LoginContent grid'>
                <div className="title_page">
                    <Link to='/'>
                        <img src={imgLogo} alt="" />
                    </Link>
                    <h1>Entrar</h1>
                </div>

                <div className="login_modes">
                    <div className="google_mode">
                        <button className="btn primary">
                            <svg className="lJpQBb" aria-label="Ir para a página inicial do Google" height="24" width="24" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#4285f4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"></path><path fill="#34a853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"></path><path fill="#fbbc04" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"></path><path fill="#ea4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"></path></svg>
                            
                            <span>Entrar com conta Google</span>
                        </button>
                    </div>
                    
                    <div className="separator"></div>

                    <div className="phone_mode">
                        <form className="form" onSubmit={handleSubmitLogin} autoComplete="off">
                            <div className="label--input">
                                <label htmlFor="tel">Com telefone</label>

                                <input id="tel" className="input" type="tel" 
                                placeholder="WhatsApp (Ex: 11980556891)" 
                                minLength="11" maxLength="11"
                                value={phone}
                                onChange={handleChangePhone}
                                required 
                                />
                            </div>

                            <div className="label--input">
                                <label>Senha</label>

                                <InputPassword value={password} funcSetValue={handleChangePassword} />
                            </div>


                            {/* Btns form */}
                            <div className="btns_container">
                                <button className="btn primary" disabled={loading}>
                                    {loading ? <span className="loader"></span> : 'Entrar com Telefone'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <Link to='/register'>
                    Ainda não possui uma conta? <br />
                    <b>Cadastrar com telefone</b>
                </Link>
            </main>

        </div>
    );
}