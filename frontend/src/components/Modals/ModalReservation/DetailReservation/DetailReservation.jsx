// Funcionalidades / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useRef } from 'react';

// Components:
// import { toast } from "react-toastify";

// Utils:
import { formatFullToHoursMinutes } from "../../../../utils/formatDate";

// Assets:

// Estilo:
import './detailreservation.css';


DetailReservation.propTypes = {
    close: PropTypes.func,
    reservationSelect: PropTypes.object
}
export function DetailReservation({ close, reservationSelect }) {
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(true);
    const elementFocusRef = useRef(null);


    // Dados da reserva:
    // const [productName, setProductName] = useState(reservationSelect.product_name || null);
    // const [quantity, setQuantity] = useState(reservationSelect.quantity || '');
    // const [returnDate, setReturnDate] = useState(reservationSelect.return_date || '');
    // const [deliveryTo, setDeliveryTo] = useState(reservationSelect.delivery_to || '');
    // const [reason, setReason] = useState(reservationSelect.reason_project || '');
    // const [obs, setObs] = useState(reservationSelect.observation || '');

    const tokenCookie = Cookies.get('tokenEstoque');
    

    useEffect(()=> {
        async function initializeComponent() {
            console.log('Effect Window DetailReservation');

            // Coloca foco no elemento em questão
            if(elementFocusRef.current) {
                setTimeout(() => { 
                    elementFocusRef.current.focus(); 
                }, 100);
            }

            ////=> GET ID RESERVATION ???
            // try {
            //     const response = await PRODUCT_GET_PER_PAGE(JSON.parse(tokenCookie), pageProducts);
            //     console.log(response);

            //     if(response.success) {
            //         setProducts(prev => [...prev, ...response.data.data]);
            //         setTotalPagesProducts(response.data.last_page);
            //         setHasError(false);
            //     }
            //     else if(response.success == false) {
            //         toast.error(response.message);
            //     }
            //     else {
            //         toast.error('Erro inesperado.');
            //     }
            // }
            // catch(error) {
            //     console.error('DEU ERRO:', error);

            //     if(error?.response?.data?.message == 'Unauthenticated.') {
            //         toast.error('Requisição não autenticada.');
            //     }
            //     else {
            //         toast.error('Houve algum erro.');
            //     }
            // }

            setHasError(false);
            setLoading(false);
        }
        initializeComponent();
    }, [tokenCookie]);

    

    return (
        <div className='Window DetailReservation UpdateReservation CreateReservation grid'>
            <h3>Detalhes da reserva</h3>

            <div className="content-window">
                {/* <p>Abaixo está os detalhes da reserva para visualização.</p> */}


                <div className="container-infos">
                    <div className="status">
                        {reservationSelect.status == 'Delayed' ? (
                            <span className='badge danger'>Em atraso</span>
                        ) : (
                        reservationSelect.status == 'Finished' ? (
                            <span className='badge success'>Finalizada</span>
                        ) : (
                            <span className='badge'>Em andamento</span>
                        )) }

                        {reservationSelect.updated_at != reservationSelect.created_at && (
                        <div className="update">
                            <small>
                                Última atualização: {formatFullToHoursMinutes(reservationSelect.updated_at)}
                            </small>
                        </div>
                        )}
                    </div>

                    <div className="label--input">
                        <label>(ID) Produto</label>
                        <p className="input">({reservationSelect.id_product}) {reservationSelect.product_name}</p>
                    </div>

                    <div className="grid-container">
                        <div className="label--input">
                            <label>Setor</label>
                            <p className="input">{reservationSelect.category_name || 'Deletado'}</p>
                        </div>
                        
                        <div className="label--input">
                            <label>Quantidade</label>
                            <p className="input">{reservationSelect.quantity}</p>
                        </div>
                        <div className="label--input">
                            <label>(ID) Criado por</label>
                            <p className="input">({reservationSelect.fk_user_id_create}) {reservationSelect.name_user_create}</p>
                        </div>
                        {reservationSelect.name_user_finished && (
                        <div className="label--input">
                            <label>(ID) Finalizado por</label>
                            <p className="input">({reservationSelect.fk_user_id_finished}) {reservationSelect.name_user_finished}</p>
                        </div>
                        )}
                        <div className="label--input">
                            <label>Data de retirada</label>
                            <p className="input">{formatFullToHoursMinutes(reservationSelect.withdrawal_date)}</p>
                        </div>
                        
                        <div className="label--input">
                            <label>Data de retorno</label>
                            <p className="input">{reservationSelect.return_date}</p>
                        </div>
                    </div>
                    
                    <div className="separator"></div>

                    <div className="grid-container">
                        <div className="label--input">
                            <label>Entregue para</label>
                            <p className="input">{reservationSelect.delivery_to}</p>
                        </div>
                        <div className="label--input">
                            <label>Razão</label>
                            <p className="input">{reservationSelect.reason_project}</p>
                        </div>
                        <div className="label--input obs">
                            <label>Observação</label>
                            <p className="input">{reservationSelect.observation}</p>
                        </div>
                    </div>

                </div>         
                   


                <div className="btns">
                    <button ref={elementFocusRef} className="btn cancel" type="button" onClick={close}>
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    )        
}