// Funcionalidades / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useRef, useContext } from 'react';
import { RESERVATION_DELETE } from "../../../../API/reservationApi";

// Context:
import UserContext from "../../../../contexts/userContext";

// Components:
import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
// import './deletereservation.css';


DeleteReservation.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func,
    reservationSelect: PropTypes.object
}
export function DeleteReservation({ close, setReflashState, reservationSelect }) {
    const [loading, setLoading] = useState(false);
    const elementFocusRef = useRef(null);

    const {profileDetails} = useContext(UserContext); 

    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        function initializeComponent() {
            console.log('Effect Window DeleteReservation');

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
    async function handleSubmitDeleteReservation() 
    {
        setLoading(true);
        
        try {
            const response = await RESERVATION_DELETE(JSON.parse(tokenCookie), reservationSelect.id);
            console.log(response);  

            if(response.success) {
                close();
                setReflashState(prev => !prev);
                toast.success('Reserva deletada!');
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
        <div className='Window DeleteReservation grid'>
            <h3 className="title-danger">
                <i className="bi bi-question-octagon"></i> 
                <span>Deletar reserva</span>
            </h3>       

            <div className="content-window">
                {profileDetails.level == 'admin' ?  (
                <p>
                    Deseja deletar a reserva do produto <b>{reservationSelect.product_name}</b> para <b>{reservationSelect.delivery_to}</b>?
                </p> 
                ) : (
                <p className="text-not-access">
                    <i className="bi bi-exclamation-triangle"></i> 
                    Você não pode seguir com esta ação, contate o administrador do ambiente.
                </p>   
                )} 
                    

                <div className="btns">
                    {profileDetails.level == 'admin' && (
                    <button className="btn danger" onClick={handleSubmitDeleteReservation} disabled={loading}>
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