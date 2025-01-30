// Funcionalidades / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useRef, useContext } from 'react';
import { RESERVATION_UNDOFINISH } from "../../../../API/reservationApi";

// Context:
import UserContext from "../../../../contexts/userContext";

// Components:
import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
// import './deleteexit.css';


UndoFinishReservation.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func,
    reservationSelect: PropTypes.object
}
export function UndoFinishReservation({ close, setReflashState, reservationSelect }) {
    const [loading, setLoading] = useState(false);
    const elementFocusRef = useRef(null);

    const {profileDetails} = useContext(UserContext); 

    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        function initializeComponent() {
            console.log('Effect Window UndoFinishReservation');

            // Coloca foco no elemento em questão
            if(elementFocusRef.current) {
                setTimeout(() => { 
                    elementFocusRef.current.focus(); 
                }, 100);
            }
        }
        initializeComponent();
    }, []);



    // UNDOFINISH:
    async function handleSubmitUndoFinishReservation() 
    {
        setLoading(true);

        try {
            const response = await RESERVATION_UNDOFINISH(JSON.parse(tokenCookie), reservationSelect.id);
            console.log(response);  

            if(response.success) {
                close();
                setReflashState(prev => !prev);
                toast.success('Finalização desfeita!');
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
        <div className='Window UndoFinishReservation grid'>
            <h3>
                <span>Desfazer a finalização da reserva</span>
            </h3>       

            <div className="content-window">
                {profileDetails.level !== 'admin' ?  (
                <p className="text-not-access">
                    <i className="bi bi-exclamation-triangle"></i> 
                    Você não pode seguir com esta ação, contate o administrador do ambiente.
                </p>
                ) : (
                <p>
                    Deseja desfazer a finalização da reserva do produto <b>{reservationSelect.product_name}</b> para <b>{reservationSelect.delivery_to}</b>?
                </p>  
                )}        

                <div className="btns">
                    {profileDetails.level == 'admin' && (
                    <button className="btn primary" onClick={handleSubmitUndoFinishReservation} disabled={loading}>
                        {loading ? 'Desfazendo...' : 'Desfazer'}
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