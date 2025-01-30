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
// import imgLogo from '../../assets/LOGO-BIZSYS_preto.png';

// Estilo:
// import './style.css';



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
                    <h1>Entrar</h1>
                </div>

                <div className="login_modes">
                    {/* <div className="google_mode">
                        ENTRAR COM GOOGLE
                    </div>
                    
                    <div className="separator"></div> */}

                    <div className="phone_mode">
                        <form className="form" onSubmit={handleSubmitLogin} autoComplete="off">
                            <div className="label--input">
                                <label>
                                    <span>Com telefone</span>
                                    <input className="input" type="tel" value={phone} onChange={handleChangePhone} required />
                                </label>
                            </div>

                            <div className="label--input">
                                <label>
                                    <span>Senha</span>
                                    <InputPassword value={password} funcSetValue={handleChangePassword} />
                                </label>
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