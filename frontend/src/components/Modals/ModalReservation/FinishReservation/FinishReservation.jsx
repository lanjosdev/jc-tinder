// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useState, useEffect, useRef } from 'react';
import { RESERVATION_FINISH } from "../../../../API/reservationApi";
import Cookies from "js-cookie";

// Components:
import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
// import './deleteexit.css';


FinishReservation.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func,
    reservationSelect: PropTypes.object
}
export function FinishReservation({ close, setReflashState, reservationSelect }) {
    const [loading, setLoading] = useState(false);
    const elementFocusRef = useRef(null);

    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        function initializeComponent() {
            console.log('Effect Window FinishReservation');

            // Coloca foco no elemento em questão
            if(elementFocusRef.current) {
                setTimeout(() => { 
                    elementFocusRef.current.focus(); 
                }, 100);
            }
        }
        initializeComponent();
    }, []);



    // FINISH:
    async function handleSubmitFinishReservation() 
    {
        setLoading(true);

        try {
            const response = await RESERVATION_FINISH(JSON.parse(tokenCookie), reservationSelect.id);
            console.log(response);  

            if(response.success) {
                close();
                setReflashState(prev => !prev);
                toast.success('Reserva finalizada!');
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
        <div className='Window FinishReservation grid'>
            <h3>
                <span>Finalizar reserva</span>
            </h3>       

            <div className="content-window">
                <p>
                    Deseja finalizar a reserva do produto <b>{reservationSelect.product_name}</b> para <b>{reservationSelect.delivery_to}</b>?
                </p>          

                <div className="btns">
                    <button className="btn primary" onClick={handleSubmitFinishReservation} disabled={loading}>
                        {loading ? 'Finalizando...' : 'Finalizar reserva'}
                    </button>

                    <button ref={elementFocusRef} className="btn cancel" onClick={close} disabled={loading}>
                        Cancelar
                    </button>
                </div>
            </div>     
        </div>
    )        
}