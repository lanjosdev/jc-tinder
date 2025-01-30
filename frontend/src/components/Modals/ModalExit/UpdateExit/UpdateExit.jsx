// Funcionalidades / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useRef, useContext } from 'react';
import { PRODUCT_GET_PER_PARAMS } from "../../../../API/productApi";
import { EXIT_UPDATE, EXIT_UPDATE_DISCARD } from "../../../../API/exitApi";

// Contexts:
import UserContext from "../../../../contexts/userContext";

// Components:
import { toast } from "react-toastify";
import { SelectAndSearch } from "../../../SelectAndSearch/SelectSearch";

// Utils:
import { formatToIdCode } from "../../../../utils/formatStrings";

// Assets:

// Estilo:
// import './updateexit.css';


UpdateExit.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func,
    exitSelect: PropTypes.object
}
export function UpdateExit({ close, setReflashState, exitSelect }) {
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(true);
    const elementFocusRef = useRef(null);
    // const [loadingInput, setLoadingInput] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);


    const [products, setProducts] = useState([]);
    const [pageProducts, setPageProducts] = useState(1);
    const [totalPagesProducts, setTotalPagesProducts] = useState(0);

    const [focusSelect, setFocusSelect] = useState(false);


    // Dados para submeter:
    const exitMode = exitSelect.discarded ? 'discard' : 'default';
    const [productSelect, setProductSelect] = useState(exitSelect.id_product ? {id: exitSelect.id_product, expiration_date: exitSelect.fk_input_id ? 1 : 0} : null);
    const [quantity, setQuantity] = useState(exitSelect.quantity || '');
    const [deliveryTo, setDeliveryTo] = useState(exitSelect.delivery_to || '');
    const [reason, setReason] = useState(exitSelect.reason_project || '');
    const [obs, setObs] = useState(exitSelect.observation || '');
    const inputPreview = exitSelect.fk_input_id || null;

    const { settingsAdmin } = useContext(UserContext);

    const tokenCookie = Cookies.get('tokenEstoque');




    useEffect(()=> {
        // Inicia dando foco em um elemento do WindowModal
        if(elementFocusRef.current) {
            setTimeout(() => { 
                elementFocusRef.current.focus(); 
            }, 100);
        }
    }, []);

    useEffect(()=> {
        async function getAllProducts() {
            console.log('Effect Window UpdateExit');

            try {
                const response = await PRODUCT_GET_PER_PARAMS(JSON.parse(tokenCookie), 'active=true&is_group=0', pageProducts);
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
                    console.error('Requisição não autenticada.');
                }
                else {
                    toast.error('Houve algum erro.');
                }
            }

            setLoading(false);
        }
        getAllProducts();
    }, [tokenCookie, pageProducts]);



    
    // SUBMIT UPDATE
    async function handleSubmitUpdateExit(e) 
    {
        e.preventDefault();
        setLoadingSubmit(true);

        // const idInput = inputPreview.id || null; 
        console.log(productSelect.id);
        console.log(quantity);
        console.log(deliveryTo);
        console.log(reason);
        console.log(obs);
        console.log(inputPreview);
        
        if(productSelect.id && quantity > 0 && deliveryTo != '' && reason != '' && obs != '') {
            try {
                // const response = await EXIT_UPDATE(JSON.parse(tokenCookie), exitSelect.id, idProductSelect, quantity, reason, obs, deliveryTo);
                const response = await EXIT_UPDATE(JSON.parse(tokenCookie), exitSelect.id, productSelect.id, quantity, deliveryTo, reason, obs, inputPreview);
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
                    console.error('Requisição não autenticada.');
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

    // SUBMIT UPDATE DESCARTE:
    async function handleSubmitUpdateExitDiscard(e) 
    {
        e.preventDefault();
        setLoadingSubmit(true);

        // const idInput = inputPreview.id || null; 
        console.log(productSelect.id);
        console.log(quantity);
        console.log(obs);
        console.log(inputPreview);

        if(productSelect.id && quantity > 0 && obs != '' && inputPreview) {
            try {
                const response = await EXIT_UPDATE_DISCARD(JSON.parse(tokenCookie), exitSelect.id, productSelect.id, quantity, obs, inputPreview);
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
                    console.error('Requisição não autenticada.');
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
        <div className='Window UpdateExit CreateExit UpdateReservation grid'>
            <h3>Editar {exitMode == 'default' ? 'saída' : 'descarte'} no estoque</h3>

            <div className="top-window">
                <p>Abaixo você pode editar os dados {exitMode == 'default' ? 'da saída' : 'do descarte'} em questão.</p>
                
                <SelectAndSearch
                loading={loading}
                arrayItems={products}
                totalPages={totalPagesProducts}
                pageCurrent={pageProducts}
                setPageCurrent={setPageProducts}
                focusSelect={focusSelect}
                setFocusSelect={setFocusSelect}
                itemSelect={productSelect}
                setItemSelect={setProductSelect}
                defaultSearch={exitSelect.product_name}
                disabledComponent={true}
                //disabledComponent={exitSelect.fk_input_id}
                />
            </div>

            {exitMode == 'default' ? (

                productSelect ? (
                <form className="content-window" onSubmit={handleSubmitUpdateExit} autoComplete="off">
    
                    {exitSelect.fk_input_id && (
                        <div className="label--input">
                            <label>Entrada relacionada nesta saída</label>
    
                            <div className={`msg`} disabled>
                                <p>
                                    <span>ID: <b>{formatToIdCode(inputPreview, 4)}</b> {exitSelect.input_deleted && `(${exitSelect.input_deleted})`}</span>
                                    {/* <span>Status: <b>{inputPreview?.status == "Em alerta" ? 'À vencer' : inputPreview?.status}</b></span>  */}
                                    {/* <span>Qtd. disponível: <b>{inputPreview?.quantity_active}</b></span> */}
                                </p>
                            </div>
                        </div>
                    )} 
                    {/* productSelect.expiration_date == 1 && (
                        <div className="label--input">
                            <label>Entrada relacionada nesta saída (em ordem de validade)</label>
    
                            <div className={`msg ${(!loadingInput && (hasError || inputPreview?.status == "Vencido")) ? 'error' : inputPreview?.status == "Em alerta" ? 'warn' : ''}`}>
                                {loadingInput ? (
                                    <span>Carregando...</span>
                                ) : (
                                    hasError ? (
                                    <span>{hasError?.length > 0 ? hasError : 'Houve algum erro.'}</span>
                                    ) : (
                                    <p>
                                        <span>ID: <b>{formatToIdCode(inputPreview?.id, 4)}</b></span>
                                        <span>Status: <b>{inputPreview?.status == "Em alerta" ? 'À vencer' : inputPreview?.status}</b></span> 
                                        <span>Qtd. disponível: <b>{inputPreview?.quantity_active}</b></span>
                                    </p>
                                    )
                                )}
                            </div>
                        </div>
                    ))} */}
    
    
                    {/* {(productSelect.expiration_date == 0 && productSelect?.quantity_stock == 0) && (
                    <div className="msg error">
                        <span>{hasError?.length > 0 ? hasError : 'Houve algum erro.'}</span>
                    </div>
                    )} */}
    
                    <div className="label--input">
                        <label htmlFor="qtd">Quantidade</label>
                        <input ref={elementFocusRef} className="input" value={quantity} onChange={(e)=> setQuantity(e.target.value)} id="qtd" type="number" min={1} max={settingsAdmin.max_input_quantity} onFocus={()=> setFocusSelect(false)} required />
                    </div>
                    {/* <div className="label--input">
                        <label htmlFor="qtd">
                            Quantidade 
                            {productSelect.id != exitSelect.id_product && `(Qtd. ${productSelect.expiration_date == 0 ? `em estoque: ${productSelect?.quantity_stock}` : `máxima: ${inputPreview?.quantity_active || 0}`})`}
                        </label>
                        <input ref={elementFocusRef} className="input" value={quantity} onChange={(e)=> setQuantity(e.target.value)} id="qtd" type="number" min={1} max={settingsAdmin.max_input_quantity} onFocus={()=> setFocusSelect(false)} required disabled={hasError} />
                    </div> */}
    
    
                    <div className={`more-datas ${(hasError || focusSelect) ? 'none' : ''}`}>
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
                        disabled={loading || loadingSubmit || hasError || !deliveryTo || !reason || obs.replace(/\s/g, '').length == 0 || (exitSelect.id_product == productSelect.id && exitSelect.quantity == quantity && exitSelect.delivery_to == deliveryTo && exitSelect.reason_project == reason && exitSelect.observation == obs)}
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
                    <button className="btn cancel" type="button" onClick={close} disabled={loadingSubmit}>
                        Cancelar
                    </button>
                </div>
                )

            ) : (

                productSelect ? (
                <form className="content-window" onSubmit={handleSubmitUpdateExitDiscard} autoComplete="off">
                    {exitSelect.fk_input_id && (
                    <div className="label--input">
                        <label>Entrada relacionada (ID)</label>

                        <div className={`msg`} disabled>
                            <p>
                                <span>ID: <b>{formatToIdCode(inputPreview, 4)}</b> {exitSelect.input_deleted && `(${exitSelect.input_deleted})`}</span>
                            </p>
                        </div>
                    </div>
                    )} 
        
    
                    <div className="label--input">
                        <label htmlFor="qtd">Quantidade</label>
                        <input ref={elementFocusRef} className="input" value={quantity} onChange={(e)=> setQuantity(e.target.value)} id="qtd" type="number" min={1} max={settingsAdmin.max_input_quantity} onFocus={()=> setFocusSelect(false)} required />
                    </div>
                    
    
    
                    <div className={`more-datas ${(hasError || focusSelect) ? 'none' : ''}`}>
                        <div className="label--input">
                            <label htmlFor="obs">Observação</label>
                            <textarea className="input" value={obs} onChange={(e)=> setObs(e.target.value)} id="obs" required></textarea>
                        </div>
                    </div>
    
    
                    <div className="btns">
                        <button 
                        className="btn primary" 
                        disabled={loading || loadingSubmit || hasError || obs.replace(/\s/g, '').length == 0 || (exitSelect.id_product == productSelect.id && exitSelect.quantity == quantity && exitSelect.delivery_to == deliveryTo && exitSelect.reason_project == reason && exitSelect.observation == obs)}
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
                    <button className="btn cancel" type="button" onClick={close} disabled={loadingSubmit}>
                        Cancelar
                    </button>
                </div>
                )

            )} 
                         
        </div>
    )        
}