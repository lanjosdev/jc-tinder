// Funcionalidades / Libs:
// import Cookies from "js-cookie";
import { useContext, useEffect } from "react";
import { Link } from "react-router";

// Contexts:
import UserContext from "../../contexts/userContext";

// Config JSON:
import imagesServer from '../../../public/configApi.json';

// Components:
import { NavBar } from "../../components/NavBar/NavBar";

// Utils

// Assets:
import iconEditProfile from '../../assets/iconBt-EditarPerfil.svg';
import iconEditPreferences from '../../assets/iconBt-AlterarPrefs.svg';
import iconEditPhotos from '../../assets/iconBt-Photo.svg';
import iconMatches from '../../assets/iconBt-Photo_1.svg';

// Estilo:
import './style.css';



export default function Settings() {
    const {
        loading,
        profileDetails,
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
            
            <main className='PageContent SettingsContent grid animate__animated animate__bounceInRight animate__faster'>
                <div className="title_page">
                    <div className="photo">
                        <img src={`${imagesServer.images_url}${profileDetails?.photos[0]?.thumb_photo}`} alt="" />
                    </div>
                    <h1>
                        <span className="name_profile">{profileDetails.name}, </span>
                        <span>{profileDetails.age}</span>
                    </h1>
                </div>

                <div className="links_container">
                    <Link 
                    className="btn primary"
                    to='/profile'
                    >
                        <img src={iconEditProfile} alt="" />
                        <span>Editar Informações do Perfil</span>
                    </Link>

                    <Link 
                    className="btn primary"
                    to='/preferences'
                    >
                        <img src={iconEditPreferences} alt="" />
                        <span>Alterar Preferências</span>
                    </Link>

                    <Link 
                    className="btn primary"
                    to='/photos'
                    >
                        <img src={iconEditPhotos} alt="" />
                        <span>Organizar Fotos</span>
                    </Link>

                    <Link 
                    className="btn primary"
                    to='/matches'
                    >
                        <img src={iconMatches} alt="" />
                        <span>Meus Matches</span>
                    </Link>
                </div>

                <div className="main_bottom">
                    <button className="link" onClick={logoutUser} disabled={loading}>
                        Sair do app
                    </button>
                </div>
            </main>
        </div>
    );
}