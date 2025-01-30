// Funcionalidades / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect } from 'react';
import { USER_RESTORE } from "../../../../API/userApi";
// import { Navigate } from 'react-router-dom';

// Components:
import { toast } from "react-toastify";
// import { UserCreate } from './UserCreate/UserCreate';

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
// import './restoreuser.css';


RestoreUser.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func,
    userSelect: PropTypes.object
}
export function RestoreUser({ close, setReflashState, userSelect }) {
    const [loading, setLoading] = useState(false);

    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        function initialComponent() {
            console.log('Effect Modal RestoreUser');
            
        }
        initialComponent();
    }, []);


    // RESTORE:
    async function handleConfirmRestoreUser() {
        setLoading(true);

        try {
            const response = await USER_RESTORE(JSON.parse(tokenCookie), userSelect.id);
            console.log(response);  

            if(response.success) {
                close();
                setReflashState(prev => !prev);
                toast.success(`Usuário "${response.data.name}" restaurado!`);
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
                console.error('Requisição não autenticada.');
            }
            else {
                toast.error('Houve algum erro.');
            }
        }

        setLoading(false);
    }


    return (
        <div className="Modal RestoreUser">
            <div className='bg-modal' onClick={close}></div>

            <div className='WindowRestoreUser WindowCreateUser grid'>
                    <h3 className="title-neutral">
                        <i className="bi bi-arrow-clockwise"></i>
                        <span>Restaurar usuário</span>
                    </h3>

                    <div className="content-window">
                        <p>Deseja restaurar usuário <b>{userSelect.name}</b> associado ao e-mail <b>{userSelect.email}</b>?</p>          

                        <div className="btns">
                            <button className="btn primary" onClick={handleConfirmRestoreUser} disabled={loading}>
                                {loading ? <span className="loader"></span> : 'Restaurar'}
                            </button>
                            <button className="btn cancel" onClick={close} disabled={loading}>Cancelar</button>
                        </div>
                    </div>
            </div>
        </div>
    )        
}