// Funcionalidades / Libs:
import PropTypes from 'prop-types';
import Cookies from "js-cookie";
import { useState, useContext, useEffect } from 'react';
import { Navigate } from 'react-router';

// API:
import { USER_PROFILE_DETAILS } from '../API/userApi';

// Contexts:
import UserContext from '../contexts/userContext';

// Components:
import { toast } from 'react-toastify';

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import SpinnerLogo from '../assets/BIZSYS_logo_icon.png';


ControllerRouter.propTypes = {
    children: PropTypes.array.isRequired,
}
export default function ControllerRouter({ children }) {
    const {
        profileDetails, 
        setProfileDetails
    } = useContext(UserContext);
    
    const [loading, setLoading] = useState(true);
    



    // Verifica validade do token sempre que acessar rotas privadas SE SIM alimenta profileDetails:
    useEffect(()=> {
        async function checkToken()
        {
            console.log('Effect ControllerRouter');
            const tokenCookie = Cookies.get('token_jc') || null;  

            try {
                const response = await USER_PROFILE_DETAILS(JSON.parse(tokenCookie));
                console.log(response);  
    
                if(response.success) {
                    setProfileDetails(response.data);
                }
                else if(response.success == false) {
                    toast.error(response.message);
                    console.warn(response.message);
                }
                else {
                    toast.error('Erro inesperado.');
                }
            }
            catch(error) {
                if(error?.response?.data?.message == 'Unauthenticated.') {
                    console.error('Requisição não autenticada. Token Invalido!');
                    // remove token e profileDetails;
                    Cookies.remove('token_jc');
                    setProfileDetails(null);
                }
                else {
                    console.error('Houve algum erro.');
                }

                console.error('DETALHES DO ERRO: ', error);
            }

            setLoading(false);
        }
        checkToken();
    }, [setProfileDetails]);

    



    return (
        <>
        {loading ? (

            <div className="loading_route">
                {/* <img src={SpinnerLogo} alt="" /> */}
                <span className="loader_black"></span>
            </div>

        ) : (
            
            profileDetails ? (
                children
            ) : (
                <Navigate to='/login' />
            )
        
        )}
        </>
    )        
}