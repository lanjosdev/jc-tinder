// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useState, useEffect } from 'react';
import { USER_DELETE } from "../../../../API/userApi";
import Cookies from "js-cookie";
// import { Navigate } from 'react-router-dom';

// Components:
import { toast } from "react-toastify";
// import { UserCreate } from './UserCreate/UserCreate';

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
import './deleteuser.css';


DeleteUser.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func,
    userSelect: PropTypes.object
}
export function DeleteUser({ close, setReflashState, userSelect }) {
    const [loading, setLoading] = useState(false);

    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        function initialComponent() {
            console.log('Effect Modal DeleteUser');
            
        }
        initialComponent();
    }, []);


    // DELETE:
    async function handleConfirmDeleteUser() {
        setLoading(true);

        try {
            const response = await USER_DELETE(JSON.parse(tokenCookie), userSelect.id);
            console.log(response);  

            if(response.success) {
                close();
                setReflashState(prev => !prev);
                toast.success('Usuário deletado!');
            }
            else if(response.success == false) {
                toast.error(response.message);
            }
            else {
                toast.error('Erro inesperado.');
            }
        }
        catch(error) {
            console.error('Deu erro: ', error);

            if(error?.response?.data?.message == 'Unauthenticated.') {
                toast.error('Requisição não autenticada.');
            }
            else {
                toast.error('Houve algum erro.');
            }
        }

        setLoading(false);
    }


    return (
        <div className="Modal DeleteUser">
            <div className='bg-modal' onClick={close}></div>

            <div className='WindowDeleteUser WindowCreateUser grid'>
                    <h3 className="title-danger">
                        <i className="bi bi-question-octagon"></i> 
                        <span>Deletar usuário</span>
                    </h3>

                    <div className="content-window">
                        <p>Deseja deletar usuário <b>{userSelect.name}</b> associado ao e-mail <b>{userSelect.email}</b>?</p>          

                        <div className="btns">
                            <button className="btn danger" onClick={handleConfirmDeleteUser} disabled={loading}>
                                {loading ? <span className="loader"></span> : 'Deletar'}
                            </button>
                            <button className="btn cancel" onClick={close} disabled={loading}>Cancelar</button>
                        </div>
                    </div>
            </div>
        </div>
    )        
}