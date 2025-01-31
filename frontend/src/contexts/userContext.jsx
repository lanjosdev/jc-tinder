// Funcionalidades / Libs:
import PropTypes from 'prop-types';
import Cookies from "js-cookie";
import { createContext, useState } from "react";
import { useNavigate } from 'react-router';

// API
import { USER_LOGIN } from "../API/userApi";

// Cria o Contexto:
const UserContext = createContext();

// Componentes:
import { toast } from "react-toastify";


// Provedor do contexto acima (prove os values(var, states, functions, etc) aos filhos desse provedor):
UserProvider.propTypes = {
    children: PropTypes.array.isRequired,
}
export function UserProvider({ children }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [profileDetails, setProfileDetails] = useState(null);
    const [settingsAdmin, setSettingsAdmin] = useState({
        max_input_quantity: 1000,
        max_input_quantity_min: 100,
    }); //Configs do ambiente para futuras versões (ex: max_input_quantity = 100)
    

    
    // Logar usuario:
    async function logarUser(email, senha, direct='/home') {
        setLoading(true);    
        console.log('Call function Logar do Context...');

        try {
            const response = await USER_LOGIN(email, senha);
            console.log(response);  

            if(response.success) {
                // toast.success('Login realizado com sucesso!');
                Cookies.set('token_jc', JSON.stringify(response.data), { expires: 1 });
                navigate(direct);
            }
            else if(response.success == false) {
                if(!response.errors) {
                    toast.error(response.message);
                    // setLoading(false); 
                    // return;
                }
                
                //=// Restante das validações
                // if(response.errors.phone[0]) {

                // }
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

    // Logout usuario:
    // async function logoutUser() 
    // {
    //     setLoading(true);    
    //     console.log('Call function Logout do Context...');
    //     const tokenCookie = Cookies.get('tokenEstoque') || null;

    //     try {
    //         const response = await USER_LOGOUT(JSON.parse(tokenCookie));
    //         console.log(response);  

    //         if(response.success || response.message == 'Unauthenticated.') {
    //             setProfileDetails(null);               
    //             Cookies.remove('tokenEstoque');

    //             navigate('/');
    //             toast.success('Usuário desconectado.');
    //         }
    //         else if(response.success == false) {
    //             toast.error(response.message);
    //         }
    //         else {
    //             toast.error('Erro inesperado.');
    //         }
    //     }
    //     catch(error) {
    //         console.error('Deu erro: ', error);

    //         if(error?.response?.data?.message == 'Unauthenticated.') {
    //             toast.error('Requisição não autenticada.');
    //         }
    //         else {
    //             toast.error('Houve algum erro.');
    //         }
    //     }

    //     setLoading(false);
    // }

    
    return (
        <UserContext.Provider
        value={{ 
            loading, 
            profileDetails, 
            setProfileDetails, 
            logarUser, 
            settingsAdmin, 
            setSettingsAdmin
        }} 
        >
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;