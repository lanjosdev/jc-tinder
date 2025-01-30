// Funcionalidades / Libs:
import PropTypes from 'prop-types';
import Cookies from "js-cookie";
import { useState, useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { USER_PROFILE_DETAILS } from '../API/userApi';

// Contexts:
import UserContext from '../contexts/userContext';

// Components:
import { toast } from 'react-toastify';

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
import SpinnerLogo from '../assets/BIZSYS_logo_icon.png';


ControllerRouter.propTypes = {
    children: PropTypes.array.isRequired,
}
export default function ControllerRouter({ children }) {
    const [loading, setLoading] = useState(true);
    
    const {
        profileDetails, 
        setProfileDetails
    } = useContext(UserContext);



    // Verifica validade do token sempre que acessar rotas privadas SE SIM alimenta profileDetails:
    useEffect(()=> {
        async function checkToken()
        {
            console.log('Effect ControllerRouter');
            const tokenCookie = Cookies.get('tokenEstoque') || null;  

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
                console.error('DEU ERRO: ', error);
    
                if(error?.response?.data?.message == 'Unauthenticated.') {
                    // remove token e profileDetails;
                    Cookies.remove('tokenEstoque');
                    setProfileDetails(null);
                }
                else {
                    console.error('Houve algum erro.');
                }
            }

            setLoading(false);
        }
        checkToken();
    }, [setProfileDetails]);

    // console.log('Profile: ', profileDetails);
    


    return (
        <>
        {loading ? (

            <div className="loading-route">
                <img src={SpinnerLogo} alt="" />
            </div>

        ) : (
            
            profileDetails ? (
                children
            ) : (
                <Navigate to='/' />
            )
        
        )}
        </>
    )        
}