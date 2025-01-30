// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useState, useEffect, useContext } from 'react';
import { PRODUCT_GET_PER_PARAMS } from "../../../../API/productApi";
import { RESERVATION_CREATE } from "../../../../API/reservationApi";
import Cookies from "js-cookie";

// Contexts:
import UserContext from "../../../../contexts/userContext";

// Components:
import { toast } from "react-toastify";
import { SelectAndSearch } from "../../../SelectAndSearch/SelectSearch";

// Utils:
import { formatMinDateCalender } from "../../../../utils/formatDate";

// Assets:

// Estilo:
import './createreservation.css';


CreateReservation.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func
}
export function CreateReservation({ close, setReflashState }) {
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);


    const [products, setProducts] = useState([]);
    const [pageProducts, setPageProducts] = useState(1);
    const [totalPagesProducts, setTotalPagesProducts] = useState(0);

    const [focusSelect, setFocusSelect] = useState(false);



    // Dados para submeter:
    const [idProductSelect, setIdProductSelect] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [deliveryTo, setDeliveryTo] = useState('');
    const [reason, setReason] = useState('');
    const [obs, setObs] = useState('');

    const { settingsAdmin } = useContext(UserContext);

    const tokenCookie = Cookies.get('tokenEstoque');
    // Obtém a data e hora atuais 
    const currentDate = new Date(); 
    const formattedMinDate = formatMinDateCalender(currentDate); 
    // console.log(formattedMinDate); // Exemplo de saída: "2024-12-03T11:15"


    useEffect(()=> {
        async function initializeComponent() {
            console.log('Effect Window CreateReservation');

            //=> GET ALL PRODUTOS
            try {
                const response = await PRODUCT_GET_PER_PARAMS(JSON.parse(tokenCookie), 'active=true', pageProducts);
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




    async function handleSubmitCreateReservation(e) 
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
                const response = await RESERVATION_CREATE(JSON.parse(tokenCookie), idProductSelect, quantity, reason, obs, deliveryTo, dateReturnFormat);
                console.log(response);  
    
                if(response.success) {
                    close();
                    setReflashState(prev => !prev);
                    toast.success('Reserva registrada!');
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
        <div className='Window CreateReservation grid'>
            <h3>Registrar reserva</h3>

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
            />

            {idProductSelect ? (
            <form className="content-window" onSubmit={handleSubmitCreateReservation} autoComplete="off">
                <div className="label--input">
                    <label htmlFor="qtd">Quantidade</label>
                    <input className="input" value={quantity} onChange={(e)=> setQuantity(e.target.value)} id="qtd" type="number" min={1} max={settingsAdmin.max_input_quantity} onFocus={()=> setFocusSelect(false)} required />
                </div>

                <div className={`more-datas ${focusSelect ? 'none' : ''}`}>
                    <div className="label--input">
                        <label htmlFor="retorno">Data de retorno</label>
                        <input id="retorno" className="input" value={returnDate} onChange={(e)=> setReturnDate(e.target.value)} type="datetime-local" min={formattedMinDate} required />
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
                    disabled={loading || loadingSubmit || hasError || !deliveryTo || !reason || obs.replace(/\s/g, '').length == 0}
                    >
                        {loadingSubmit ? 'Registrando...' : 'Registrar reserva'}
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