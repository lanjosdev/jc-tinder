// Funcionalidades / Libs:
import PropTypes from 'prop-types';
import Cookies from "js-cookie";
import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';

// Config JSON:
import imagesServer from '../../../public/configApi.json';

// API
// import { PRODUCT_GET_ALERT } from '../../API/productApi';

// Contexts:
import UserContext from '../../contexts/userContext';

// Componets:

// Utils:
// import { primeiraPalavra } from '../../utils/formatStrings';

// Assets:
import imgLogo from '../../assets/Logo.png';

// Estilo:
import './navbar.css';


NavBar.propTypes = {
    showBtnBack: PropTypes.bool,
    showBtnProfile: PropTypes.bool
}
export function NavBar({ showBtnBack=true, showBtnProfile=true }) {
    const {
        loading,
        profileDetails
    } = useContext(UserContext);
    // Estados do componente:
    const [loadingMatches, setLoadingMatches] = useState(true);
    // const [error, setError] = useState(null);

    // Dados pré-carregados:
    const [matches, setMatches] = useState([]); //??? vai alimentar esse array?

    // Logica da UI:
    // const navBarRef = useRef(null);

    const navigate = useNavigate();
    const tokenCookie = Cookies.get('token_jc');




    useEffect(()=> {     
        async function getMatches() {
            console.log('Effect Component NavBar');

            // try {
            //     const response = await PRODUCT_GET_ALERT(JSON.parse(tokenCookie), 1);
            //     // console.log(response);

            //     if(response.success) {
            //         const arrayProcessed = response.data.data.slice(0, 5);
            //         // console.log(arrayProcessed)
            //         setProductsAlert(arrayProcessed);                    
            //         setHasError(false);
            //     }
            //     else if(response.success == false) {
            //         console.error(response.message);
            //     }
            //     else {
            //         console.error('Erro inesperado.');
            //     }
            // }
            // catch(error) {
            //     console.error('DEU ERRO:', error);

            //     if(error?.response?.data?.message == 'Unauthenticated.') {
            //         console.error('Requisição não autenticada.');
            //     }
            //     else {
            //         console.error('Houve algum erro.');
            //     }
            // }
            
            setLoadingMatches(false);
        }
        getMatches();
    }, []);

    // useEffect(()=> {        
    //     const handleClickOutside = (event) => { 
    //         if(navMenuRef.current && !navMenuRef.current.contains(event.target)) { 
    //             if(isOpen) {
    //                 console.warn('Clique fora do NavMenu!');
    //                 setIsOpen(false);
    //             }
    //         } 

    //         if(conteinerAlertRef.current && !conteinerAlertRef.current.contains(event.target)) { 
    //             if(isOpenAlert) {
    //                 console.warn('Clique fora do conteinerAlert!');
    //                 setIsOpenAlert(false);
    //             }
    //         } 
    //     }; 
        
    //     // Adiciona o listener
    //     document.addEventListener('mousedown', handleClickOutside); 
        
    //     // Cleanup: remove os listeners quando o componente for desmontado
    //     return ()=> { 
    //         document.removeEventListener('mousedown', handleClickOutside); 
    //     };
    // }, [isOpen, isOpenAlert]);

    
    

    return (
        <header className='NavBar'>

            <nav className="NavBarContent grid">
                <div className="nav_left">
                    <Link 
                    className={`btn back ${!showBtnBack ? 'hidden' : ''}`}
                    onClick={()=> navigate(-1)} 
                    >
                        <ion-icon name="chevron-back"></ion-icon>
                    </Link>

                    <Link 
                    className='logo' 
                    to='/home'
                    >
                        <img src={imgLogo} alt="Logotipo" />
                    </Link>
                </div>
                
                <div className="nav_right">
                    <Link 
                    className={`link profile ${!showBtnProfile ? 'hidden' : ''}`}
                    to='/settings'
                    >
                        <span>Perfil</span>

                        <div className="photo_profile">
                            {loading ? (
                                <i className="bi bi-person-circle"></i>
                            ) : (
                                profileDetails.photos[0] ? (
                                <img 
                                src={`${imagesServer.images_url}${profileDetails.photos[0]?.thumb_photo}`} alt="Foto do perfil"
                                />
                                ) : (
                                <i className="bi bi-person-circle"></i>
                                )
                            )}
                        </div>
                    </Link>

                    <Link
                    className='link matches'
                    to='/matches'
                    disabled={loadingMatches}
                    >
                        <i className="bi bi-bell-fill"></i>

                        {matches.length > 0 && (
                        <div className="indicator"></div>
                        )}
                    </Link>
                </div>
            </nav>

            <div className="border_bottom"></div>

        </header>
    )        
}