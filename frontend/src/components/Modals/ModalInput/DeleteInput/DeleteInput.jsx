// Funcionalidades / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useRef, useContext } from 'react';
import { INPUT_DELETE } from "../../../../API/inputApi";

// Context:
import UserContext from "../../../../contexts/userContext";

// Components:
import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
// import './deleteinput.css';


DeleteInput.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func,
    inputSelect: PropTypes.object
}
export function DeleteInput({ close, setReflashState, inputSelect }) {
    const [loading, setLoading] = useState(false);
    const elementFocusRef = useRef(null);

    const {profileDetails} = useContext(UserContext); 

    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        function initializeComponent() {
            console.log('Effect Window DeleteInput');

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
    async function handleSubmitDeleteInput() 
    {
        setLoading(true);

        try {
            const response = await INPUT_DELETE(JSON.parse(tokenCookie), inputSelect.id);
            console.log(response);  

            if(response.success) {
                close();
                setReflashState(prev => !prev);
                toast.success('Entrada deletada!');
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
        <div className='Window DeleteInput grid'>
            <h3 className="title-danger">
                <i className="bi bi-question-octagon"></i> 
                <span>Deletar entrada</span>
            </h3>       

            <div className="content-window">
                {profileDetails.level == 'admin' ?  (
                <p>
                    Deseja deletar a entrada de <b>{inputSelect.quantity}</b> ite{inputSelect.quantity > 1 ? 'ns' : 'm'} de <b>{inputSelect.product_name}</b>?
                </p> 
                ) : (
                <p className="text-not-access">
                    <i className="bi bi-exclamation-triangle"></i> 
                    Você não pode seguir com esta ação, contate o administrador do ambiente.
                </p>   
                )}            

                <div className="btns">
                    {profileDetails.level == 'admin' && (
                    <button className="btn danger" onClick={handleSubmitDeleteInput} disabled={loading}>
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