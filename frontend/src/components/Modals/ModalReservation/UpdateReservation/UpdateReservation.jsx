// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useState, useRef, useEffect, useContext } from 'react';
import { PRODUCT_GET_PER_PAGE } from "../../../../API/productApi";
import { RESERVATION_UPDATE } from "../../../../API/reservationApi";
import Cookies from "js-cookie";

// Contexts:
import UserContext from "../../../../contexts/userContext";

// Components:
import { toast } from "react-toastify";
import { SelectAndSearch } from "../../../SelectAndSearch/SelectSearch";

// Utils:
import { formatDateAmerican, formatDateAmericanMinDate } from "../../../../utils/formatDate";

// Assets:

// Estilo:
import './updatereservation.css';


UpdateReservation.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func,
    reservationSelect: PropTypes.object
}
export function UpdateReservation({ close, setReflashState, reservationSelect }) {
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(true);
    const elementFocusRef = useRef(null);
    const [loadingSubmit, setLoadingSubmit] = useState(false);


    const [products, setProducts] = useState([]);
    const [pageProducts, setPageProducts] = useState(1);
    const [totalPagesProducts, setTotalPagesProducts] = useState(0);

    const [focusSelect, setFocusSelect] = useState(false);



    // Dados para submeter:
    const [idProductSelect, setIdProductSelect] = useState(reservationSelect.id_product || null);
    const [quantity, setQuantity] = useState(reservationSelect.quantity || '');
    const [returnDate, setReturnDate] = useState(formatDateAmerican(reservationSelect.return_date) || '');
    const [deliveryTo, setDeliveryTo] = useState(reservationSelect.delivery_to || '');
    const [reason, setReason] = useState(reservationSelect.reason_project || '');
    const [obs, setObs] = useState(reservationSelect.observation || '');

    const { settingsAdmin } = useContext(UserContext);

    const tokenCookie = Cookies.get('tokenEstoque');
    
    const formattedMinDate = formatDateAmericanMinDate(reservationSelect.created_at); 
    // console.log(formattedMinDate); // Exemplo de saída: "2024-12-03T11:15"


    useEffect(()=> {
        // Inicia dando foco em um elemento do WindowModal
        if(elementFocusRef.current) {
            setTimeout(() => { 
                elementFocusRef.current.focus(); 
            }, 100);
        }
    }, []);

    useEffect(()=> {
        async function initializeComponent() {
            console.log('Effect Window UpdateReservation');

            //=> GET ALL PRODUTOS
            try {
                const response = await PRODUCT_GET_PER_PAGE(JSON.parse(tokenCookie), pageProducts);
                console.log(response);

                if(response.success) {
                    setProducts(prev => [...prev, ...response.data.data]);
                    setTotalPagesProducts(response.data.last_page);
                    setHasError(false);
                }
                else if(response.success == false) {
                    toast.error(response.message);
                }
                else {
                    toast.error('Erro inesperado.');
                }
            }
            catch(error) {
                console.error('DEU ERRO:', error);

                if(error?.response?.data?.message == 'Unauthenticated.') {
                    toast.error('Requisição não autenticada.');
                }
                else {
                    toast.error('Houve algum erro.');
                }
            }

            setLoading(false);
        }
        initializeComponent();
    }, [tokenCookie, pageProducts]);




    async function handleSubmitUpdateReservation(e) 
    {
        e.preventDefault();
        setLoadingSubmit(true);

        const dateReturnFormat = returnDate.replace("T", " ");
        console.log(idProductSelect);
        console.log(quantity);
        console.log(dateReturnFormat);
        console.log(deliveryTo);
        console.log(reason);
        console.log(obs);
        
        if(idProductSelect && quantity > 0 && dateReturnFormat && deliveryTo != '' && reason != '' && obs != '') {
            try {
                const response = await RESERVATION_UPDATE(JSON.parse(tokenCookie), reservationSelect.id, idProductSelect, quantity, reason, obs, deliveryTo, dateReturnFormat);
                console.log(response);  
    
                if(response.success) {
                    close();
                    setReflashState(prev => !prev);
                    toast.success('Alteração salva!');
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
        } 
        else {
            console.warn('Algum erro com a condicional!');
        }   

        setLoadingSubmit(false);
    }

    

    return (
        <div className='Window UpdateReservation CreateReservation grid'>
            <h3>Editar reserva</h3>

            <div className="top-window">
                <p>Abaixo você pode editar os dados da reserva em questão.</p>
                
                <SelectAndSearch
                loading={loading}
                products={products}
                totalPagesProducts={totalPagesProducts}
                pageProducts={pageProducts}
                setPageProducts={setPageProducts}
                focusSelect={focusSelect}
                setFocusSelect={setFocusSelect}
                idProductSelect={idProductSelect}
                setIdProductSelect={setIdProductSelect}
                defaultSearch={reservationSelect.product_name}
                />
            </div>

            {idProductSelect ? (
            <form className="content-window" onSubmit={handleSubmitUpdateReservation} autoComplete="off">
                <div className="label--input">
                    <label htmlFor="qtd">Quantidade</label>
                    <input ref={elementFocusRef} className="input" value={quantity} onChange={(e)=> setQuantity(e.target.value)} id="qtd" type="number" min={1} max={settingsAdmin.max_input_quantity} onFocus={()=> setFocusSelect(false)} required />
                </div>

                <div className={`more-datas ${focusSelect ? 'none' : ''}`}>
                    <div className="label--input">
                        <label htmlFor="retorno">Data de retorno</label>
                        <input id="retorno" className="input" type="datetime-local" value={returnDate} onChange={(e)=> setReturnDate(e.target.value)} min={formattedMinDate} required />
                    </div>

                    <div className="label--input">
                        <label htmlFor="delivery">Entregue para</label>
                        <input className="input" value={deliveryTo} onChange={(e)=> setDeliveryTo(e.target.value)} id="delivery" type="text" required />
                    </div>

                    <div className="label--input">
                        <label htmlFor="reason">Razão</label>
                        <input className="input" value={reason} onChange={(e)=> setReason(e.target.value)} id="reason" type="text" required />
                    </div>

                    <div className="label--input">
                        <label htmlFor="obs">Observação</label>
                        <textarea className="input" value={obs} onChange={(e)=> setObs(e.target.value)} id="obs" required></textarea>
                    </div>
                </div>

                <div className="btns">
                    <button 
                    className="btn primary" 
                    disabled={loading || loadingSubmit || hasError || !deliveryTo || !reason || obs.replace(/\s/g, '').length == 0 || (reservationSelect.id_product == idProductSelect && reservationSelect.quantity == quantity && formatDateAmerican(reservationSelect.return_date) == returnDate && reservationSelect.delivery_to == deliveryTo && reservationSelect.reason_project == reason && reservationSelect.observation == obs)}
                    >
                        {loadingSubmit ? 'Salvando...' : 'Salvar alteração'}
                    </button>

                    <button className="btn cancel" type="button" onClick={close} disabled={loadingSubmit}>
                        Cancelar
                    </button>
                </div>
            </form>
            ) : (
            <div className="btns">
                {/* <button 
                className="btn primary" 
                disabled={loading || loadingSubmit || hasError || !deliveryTo || !reason || obs.replace(/\s/g, '').length == 0}
                >
                    {loadingSubmit ? 'Registrando...' : 'Registrar reserva'}
                </button> */}

                <button className="btn cancel" type="button" onClick={close} disabled={loadingSubmit}>
                    Cancelar
                </button>
            </div>
            )}   
        </div>
    )        
}