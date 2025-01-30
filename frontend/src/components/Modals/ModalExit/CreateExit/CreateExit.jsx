// Funcionalidades / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useContext } from 'react';
import { PRODUCT_GET_PER_PARAMS } from "../../../../API/productApi";
import { INPUT_GET_EXPIRATION_PER_PRODUCT, INPUT_GET_PER_PARAMS } from "../../../../API/inputApi";
import { EXIT_CREATE, EXIT_CREATE_DISCARD } from "../../../../API/exitApi";

// Contexts:
import UserContext from "../../../../contexts/userContext";

// Components:
import { toast } from "react-toastify";
import { SelectAndSearch } from "../../../SelectAndSearch/SelectSearch";

// Utils:
import { formatToIdCode } from "../../../../utils/formatStrings";

// Assets:

// Estilo:
import './createexit.css';


CreateExit.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func
}
export function CreateExit({ close, setReflashState }) {
    const { settingsAdmin } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(true);
    const [loadingInput, setLoadingInput] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [refreshComponent, setRefreshComponent] = useState('');

    // States para pré carrementos de Produtos
    const [products, setProducts] = useState([]);
    const [pageProducts, setPageProducts] = useState(1);
    const [totalPagesProducts, setTotalPagesProducts] = useState(0);

    const [focusSelect, setFocusSelect] = useState(false);

    // States para pré carrementos de Entradas
    const [inputs, setInputs] = useState([]);
    const [pageInputs, setPageInputs] = useState(1);
    const [totalPagesInputs, setTotalPagesInputs] = useState(0);

    const [focusSelectInput, setFocusSelectInput] = useState(false);

    
    // Dados para submeter:
    const [exitMode, setExitMode] = useState('default'); // ou 'discard'
    const [productSelect, setProductSelect] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [deliveryTo, setDeliveryTo] = useState('');
    const [reason, setReason] = useState('');
    const [obs, setObs] = useState('');
    const [inputPreview, setInputPreview] = useState({});
    const [inputSelect, setInputSelect] = useState(null);


    const tokenCookie = Cookies.get('tokenEstoque');




    useEffect(()=> {
        async function getAllProducts() {
            console.log('Effect Window CreateExit');

            try {
                setLoading(true);
                setHasError(true);

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


    useEffect(()=> {
        async function getInputExpirationPerProduct() {
            if(exitMode == 'default') {
                setHasError(false);
                setInputPreview({});

                if(productSelect?.expiration_date == 1) {
                    setLoadingInput(true);
                    setHasError(true);

                    try {
                        const response = await INPUT_GET_EXPIRATION_PER_PRODUCT(JSON.parse(tokenCookie), productSelect.id);
                        console.log(response);
        
                        if(response.success) {
                            setInputPreview(response.data);
                            setHasError(false);
                        }
                        else if(response.success == false) {
                            console.error(response.message);

                            if(response.message == 'Nenhuma entrada encontrada, faça novas entradas ou verifique.') {
                                setHasError('Produto sem estoque, necessário realizar uma entrada.');
                            }
                            else {
                                toast.error(response.message);
                            }
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

                    setLoadingInput(false);
                }
            }
            
            
            //=> Verifica se produto selecionado tem estoque
            if(productSelect?.quantity_stock == 0) {
                setHasError('Produto sem estoque, necessário realizar uma entrada.');
            }
        }
        getInputExpirationPerProduct();
    }, [exitMode, productSelect, tokenCookie]);


    useEffect(()=> {
        async function getAllInputsPerProduct() {
            if(exitMode == 'discard') {
                setInputSelect(null);
            }

            if(exitMode == 'discard' && productSelect?.quantity_stock > 0) {
                try {
                    setLoading(true);
                    setHasError(true);
                    setInputs([]);
                    
                    const response = await INPUT_GET_PER_PARAMS(JSON.parse(tokenCookie), `product_id=${productSelect.id}&zero=false`, pageInputs);
                    console.log(response);
    
                    if(response.success) {
                        setInputs(prev => [...prev, ...response.data.data]);
                        setTotalPagesInputs(response.data.last_page);
                        setHasError(false);
                    }
                    else if(response.success == false) {
                        console.warn(response.message);
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
        }
        getAllInputsPerProduct();
    }, [exitMode, productSelect, tokenCookie, pageInputs]);


    


    function handleChangeModeExit(mode) {
        if(mode != exitMode) {
            setProductSelect(null);
            setInputSelect(null);
            setQuantity('');
            setDeliveryTo('');
            setReason('');
            setObs('');
            setRefreshComponent('reset');
        }

        setExitMode(mode);
    }
    
    // SUBMIT CREATE
    async function handleSubmitCreateExit(e) 
    {
        e.preventDefault();
        setLoadingSubmit(true);

        const idInput = inputPreview.id || null; 
        console.log(productSelect.id);
        console.log(quantity);
        console.log(deliveryTo);
        console.log(reason);
        console.log(obs);
        console.log(idInput);
        
        if(productSelect.id && quantity > 0 && deliveryTo != '' && reason != '' && obs != '') {
            try {
                // const response = await EXIT_CREATE(JSON.parse(tokenCookie), productSelect.id, quantity, reason, obs, deliveryTo);
                const response = await EXIT_CREATE(JSON.parse(tokenCookie), productSelect.id, quantity, deliveryTo, reason, obs, idInput);
                console.log(response);  
    
                if(response.success) {
                    close();
                    setReflashState(prev => !prev);
                    toast.success('Saída registrada!');
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

    // SUBMIT CREATE DISCARD:
    async function handleSubmitCreateExitDiscard(e) 
    {
        e.preventDefault();
        setLoadingSubmit(true);

        console.log(productSelect.id);
        console.log(quantity);
        console.log(obs);
        console.log(inputSelect.id);

        if(productSelect.id && quantity > 0 && obs != '' && inputSelect.id) {
            try {
                const response = await EXIT_CREATE_DISCARD(JSON.parse(tokenCookie), productSelect.id, quantity, obs, inputSelect.id);
                console.log(response);  
    
                if(response.success) {
                    close();
                    setReflashState(prev => !prev);
                    toast.success('Descarte registrado!');
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
        <div className='Window CreateExit grid'>
            <h3>Registrar {exitMode == 'default' ? 'saída' : 'descarte'} no estoque</h3>

            <div className="tabs">
                <button 
                className={exitMode == 'default' ? 'tab-ativa' : ''}
                onClick={()=> handleChangeModeExit('default')}
                disabled={loadingSubmit}
                >Saída padrão</button>

                <button 
                className={exitMode == 'discard' ? 'tab-ativa' : ''}
                onClick={()=> handleChangeModeExit('discard')}
                disabled={loadingSubmit}
                >Descarte</button>
            </div>


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
            refreshComponent={refreshComponent}
            setRefreshComponent={setRefreshComponent}
            />


            {exitMode == 'default' ? (
                
                productSelect ? (
                <form className="content-window" onSubmit={handleSubmitCreateExit} autoComplete="off">

                    {productSelect.expiration_date == 1 && (
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
                    )}

                    {(productSelect.expiration_date == 0 && productSelect?.quantity_stock == 0) && (
                    <div className="msg error">
                        <span>{hasError?.length > 0 ? hasError : 'Houve algum erro.'}</span>
                    </div>
                    )}

                    <div className="label--input">
                        <label htmlFor="qtd">
                            Quantidade (Qtd. {productSelect.expiration_date == 0 ? `em estoque: ${productSelect?.quantity_stock}` : `máxima: ${inputPreview?.quantity_active || 0}`})
                        </label>
                        <input className="input" value={quantity} onChange={(e)=> setQuantity(e.target.value)} id="qtd" type="number" min={1} max={settingsAdmin.max_input_quantity} onFocus={()=> setFocusSelect(false)} required disabled={hasError} />
                    </div>
    

                    <div className={`more-datas ${(loadingInput || hasError || focusSelect) ? 'none' : ''}`}>
                        <div className="label--input">
                            <label htmlFor="delivery">Entregue para</label>
                            <input className="input" value={deliveryTo} onChange={(e)=> setDeliveryTo(e.target.value)} id="delivery" type="text" required />
                        </div>
    
                        <div className="label--input">
                            <label htmlFor="reason">Razão (projeto)</label>
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
                            {loadingSubmit ? 'Registrando...' : 'Registrar saída'}
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
                <>
                {productSelect && (
                    productSelect?.quantity_stock > 0 ? (

                        loading ? (
                            <p>Carregando...</p>
                        ) : (
                            <SelectAndSearch 
                            typeData="entrada"
                            loading={loading}
                            arrayItems={inputs}
                            totalPages={totalPagesInputs}
                            pageCurrent={pageInputs}
                            setPageCurrent={setPageInputs}
                            focusSelect={focusSelectInput}
                            setFocusSelect={setFocusSelectInput}
                            itemSelect={inputSelect}
                            setItemSelect={setInputSelect}
                            />
                        )

                    ) : (

                    <div className="msg error">
                        <span>{hasError?.length > 0 ? hasError : 'Houve algum erro.'}</span>
                    </div>

                    )
                )}

                
                {(productSelect && inputSelect) ? (                
                    <form className="content-window" onSubmit={handleSubmitCreateExitDiscard} autoComplete="off">
                        <div className="label--input">
                            <label htmlFor="qtd">
                                Quantidade (Qtd. {productSelect.expiration_date == 0 ? `em estoque: ${productSelect?.quantity_stock}` : `máxima: ${inputSelect?.quantity_active || 0}`})
                            </label>
                            <input className="input" value={quantity} onChange={(e)=> setQuantity(e.target.value)} id="qtd" type="number" min={1} max={settingsAdmin.max_input_quantity} onFocus={()=> setFocusSelect(false)} required disabled={hasError} />
                        </div>
        

                        <div className={`more-datas ${(loadingInput || hasError || focusSelect) ? 'none' : ''}`}>
                            <div className="label--input">
                                <label htmlFor="obs">Observação</label>
                                <textarea className="input" value={obs} onChange={(e)=> setObs(e.target.value)} id="obs" required></textarea>
                            </div>
                        </div>
        
                        <div className="btns">
                            <button 
                            className="btn primary" 
                            disabled={loading || loadingSubmit || hasError || obs.replace(/\s/g, '').length == 0}
                            >
                                {loadingSubmit ? 'Registrando...' : 'Registrar saída'}
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
                )}
                </>
            )} 
               
        </div>
    )        
}