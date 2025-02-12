// Funcionalidades / Libs:
// import Cookies from "js-cookie";
import { useContext, useEffect } from "react";
import { Link } from "react-router";

// Contexts:
import UserContext from "../../contexts/userContext";

// Components:
import { NavBar } from "../../components/NavBar/NavBar";

// Utils

// Assets:
// import imgLogo from '../../assets/LOGO-BIZSYS_preto.png';

// Estilo:
// import './style.css';



export default function Settings() {
    const {
        loading,
        // profileDetails,
        logoutUser
    } = useContext(UserContext);
    // const navigate = useNavigate();
    // const [error, setError] = useState(null);

    // Dados a submiter
    


    useEffect(()=> {
        function initializePage() {
            console.log('Effect /Settings');

        } 
        initializePage();
    }, []);
    

    

  
    return (
        <div className="Page Settings">
            <NavBar />
            
            <main className='PageContent SettingsContent grid animate__animated animate__bounceInRight'>
                <div className="title_page">
                    <h1>
                        <span>Perfil</span>
                    </h1>

                    <button className="link" onClick={logoutUser} disabled={loading}>
                        Sair do app
                    </button>
                </div>

                <div className="links_container">
                    <Link 
                    to='/profile'
                    className="btn primary"
                    >
                        <span>Editar Informações do Perfil</span>
                    </Link>

                    <Link 
                    to='/preferences'
                    className="btn primary"
                    >
                        <span>Alterar Preferências</span>
                    </Link>

                    <Link 
                    to='/photos'
                    className="btn primary"
                    >
                        <span>Organizar Fotos</span>
                    </Link>
                </div>
            </main>

        </div>
    );
}