// Funcionalidades / Libs:
import PropTypes from 'prop-types';
// import Cookies from "js-cookie";
import { useEffect } from 'react';
import { Link } from 'react-router';

// API
// import { PRODUCT_GET_ALERT } from '../../API/productApi';

// Contexts:
// import UserContext from '../../contexts/userContext';

// Componets:

// Utils:
// import { primeiraPalavra } from '../../utils/formatStrings';

// Assets:
import imgLogo from '../../../assets/Logo.png';

// Estilo:
// import './navbarsecundary.css';


NavBarSecundary.propTypes = {
    isForms: PropTypes.bool,
    step: PropTypes.number,
    setStep: PropTypes.func,
    showBtnBack: PropTypes.bool
}
export function NavBarSecundary({ isForms=false, step, setStep, showBtnBack=true }) {
    // Estados do componente:
    // const [loadingMatches, setLoadingMatches] = useState(true);
    // const [error, setError] = useState(null);

    // Logica da UI:
    // const navBarRef = useRef(null);


    // const navigate = useNavigate();



    useEffect(()=> {     
        async function initializeComponent() {
            console.log('Effect Component NavBarSecundary');

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
            
            // setLoadingMatches(false);
        }
        initializeComponent();
    }, []);

    
    

    return (
        <header className='NavBar Secundary'>

            <nav className="NavBarContent grid">
                <div className="nav_left">
                    {isForms ? (
                        <button 
                        className={`btn back ${(step <= 1 || !showBtnBack) ? 'hidden' : ''}`}
                        onClick={()=> setStep(prev=> prev - 1)} 
                        >
                            <ion-icon name="chevron-back"></ion-icon>
                        </button>
                    ) : (
                        <Link 
                        className='btn back'
                        // onClick={()=> navigate(-1)} 
                        to='/login'
                        >
                            <ion-icon name="chevron-back"></ion-icon>
                        </Link>
                    )}

                    <Link 
                    className='logo' 
                    to={isForms ? '/forms' : '/'}
                    >
                        <img src={imgLogo} alt="Logotipo" />
                    </Link>
                </div>
                
            </nav>

            <div className={`border_bottom ${isForms ? 'bar_progress' : ''} step${step}`}></div>

        </header>
    )        
}