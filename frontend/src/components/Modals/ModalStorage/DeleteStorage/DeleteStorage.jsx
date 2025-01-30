// Funcionalidades / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useRef, useContext } from 'react';
import { STORAGE_DELETE } from "../../../../API/storageApi";

// Context:
import UserContext from "../../../../contexts/userContext";

// Components:
import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
// import './deletestorage.css';


DeleteStorage.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func,
    storageSelect: PropTypes.object
}
export function DeleteStorage({ close, setReflashState, storageSelect }) {
    const [loading, setLoading] = useState(false);
    const elementFocusRef = useRef(null);

    const {profileDetails} = useContext(UserContext); 

    const tokenCookie = Cookies.get('tokenEstoque') || null;


    useEffect(()=> {
        function initializeComponent() {
            console.log('Effect Window DeleteStorage');

            // Coloca foco no elemento em questão
            if(elementFocusRef.current) {
                setTimeout(() => { 
                    elementFocusRef.current.focus(); 
                }, 100);
            }

        }
        initializeComponent();
    }, []);



    // DELETE:
    async function handleSubmitDeleteStorage() 
    {
        setLoading(true);

        try {
            const response = await STORAGE_DELETE(JSON.parse(tokenCookie), storageSelect.id);
            console.log(response);  

            if(response.success) {
                close();
                setReflashState(prev => !prev);
                toast.success('Depósito deletado!');
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
        <div className='Window DeleteStorage grid'>
            <h3 className="title-danger">
                <i className="bi bi-question-octagon"></i> 
                <span>Deletar depósito</span>
            </h3>       

            <div className="content-window">
                          
                {profileDetails.level == 'admin' ?  (
                <p>
                    Deseja deletar o depósito <b>{storageSelect.name}</b>?
                </p>
                ) : (
                <p className="text-not-access">
                    <i className="bi bi-exclamation-triangle"></i> 
                    Você não pode seguir com esta ação, contate o administrador do ambiente.
                </p>   
                )}            


                <div className="btns">
                    {profileDetails.level == 'admin' && (
                    <button className="btn danger" onClick={handleSubmitDeleteStorage} disabled={loading}>
                        {loading ? 'Deletando...' : 'Deletar'}
                    </button>
                    )}

                    <button ref={elementFocusRef} className="btn cancel" onClick={close} disabled={loading}>
                        {profileDetails.level == 'admin' ? 'Cancelar' : 'Fechar'}
                    </button>
                </div>

            </div>     
        </div>
    )        
}