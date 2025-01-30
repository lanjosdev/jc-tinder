// Funcionalidades / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useRef, useContext } from 'react';
import { PRODUCT_GET_PER_PARAMS } from "../../../../API/productApi";
import { STORAGE_GET_PER_PARAMS } from "../../../../API/storageApi";

import { INPUT_CREATE } from "../../../../API/inputApi";

// Contexts:
import UserContext from "../../../../contexts/userContext";

// Components:
import { toast } from "react-toastify";
import { SelectAndSearch } from "../../../SelectAndSearch/SelectSearch";

// Utils:
import { formatMinDateCalender } from "../../../../utils/formatDate";

// Assets:

// Estilo:
// import './createinput.css';


CreateInput.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func
}
export function CreateInput({ close, setReflashState }) {
    const { settingsAdmin } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);


    // States para pré carrementos de Produtos
    const [products, setProducts] = useState([]);
    const [pageProducts, setPageProducts] = useState(1);
    const [totalPagesProducts, setTotalPagesProducts] = useState(0);

    const [focusSelectProduct, setFocusSelectProduct] = useState(false);

    // States para pré carrementos de Depositos
    const [storages, setStorages] = useState([]);
    const [pageStorages, setPageStorages] = useState(1);
    const [totalPagesStorages, setTotalPagesStorages] = useState(0);

    const [focusSelectStorage, setFocusSelectStorage] = useState(false);


    // Estados e dados para o modal
    // Obtém a data e hora atuais 
    const currentDate = new Date(); 
    const formattedMinDate = formatMinDateCalender(currentDate, true);
    
    
    // Dados para submeter:
    const [productSelect, setProductSelect] = useState(null);
    const [storageSelect, setStorageSelect] = useState(null);
    const quantRef = useRef(null);
    const [fabricationDate, setFabricationDate] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const alertDaysRef = useRef(null);

    const tokenCookie = Cookies.get('tokenEstoque');



    useEffect(()=> {
        async function getAllProductsActives() {
            console.log('Effect Window CreateInput');

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
                    toast.error('Requisição não autenticada.');
                }
                else {
                    toast.error('Houve algum erro.');
                }
            }

            setLoading(false);
        }
        getAllProductsActives();
    }, [tokenCookie, pageProducts]);

    useEffect(()=> {
        async function getAllStoragesActives() {
            try {
                setLoading(true);
                setHasError(true);
                
                const response = await STORAGE_GET_PER_PARAMS(JSON.parse(tokenCookie), 'active=true', pageStorages);
                console.log(response);

                if(response.success) {
                    setStorages(prev => [...prev, ...response.data.data]);
                    setTotalPagesStorages(response.data.last_page);
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
        getAllStoragesActives();
    }, [tokenCookie, pageStorages]);



    // CREATE
    async function handleSubmitCreateInput(e) 
    {
        e.preventDefault();
        setLoadingSubmit(true);

        const quantity = quantRef.current?.value || '';
        const alertDays = alertDaysRef.current?.value || '';
        console.log(productSelect.id);
        console.log(storageSelect.id);
        console.log(quantity);
        console.log(fabricationDate);
        console.log(expirationDate);
        console.log(alertDays);
        
        
        if(productSelect.id && storageSelect.id && quantity > 0) {
            if(productSelect.expiration_date) {
                if(fabricationDate >= expirationDate) {
                    toast.warn('A data de vencimento não pode ser menor ou igual a de fabricação.');
                    setLoadingSubmit(false);
                    return;
                }
            }

            try {
                const response = await INPUT_CREATE(JSON.parse(tokenCookie), productSelect.id, storageSelect.id, quantity, fabricationDate, expirationDate, alertDays);
                console.log(response);  
    
                if(response.success) {
                    close();
                    setReflashState(prev => !prev);
                    toast.success('Entrada registrada!');
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
        <div className='Window CreateInput grid'>
            <h3>Registrar entrada no estoque</h3>

            <SelectAndSearch 
            typeData="produto"
            loading={loading}
            arrayItems={products}
            totalPages={totalPagesProducts}
            pageCurrent={pageProducts}
            setPageCurrent={setPageProducts}
            focusSelect={focusSelectProduct}
            setFocusSelect={setFocusSelectProduct}
            itemSelect={productSelect}
            setItemSelect={setProductSelect}
            />

            <SelectAndSearch 
            typeData="deposito"
            loading={loading}
            arrayItems={storages}
            totalPages={totalPagesStorages}
            pageCurrent={pageStorages}
            setPageCurrent={setPageStorages}
            focusSelect={focusSelectStorage}
            setFocusSelect={setFocusSelectStorage}
            itemSelect={storageSelect}
            setItemSelect={setStorageSelect}
            />

            {(productSelect && storageSelect) ? (
            <form className="content-window" onSubmit={handleSubmitCreateInput} autoComplete="off">
                <div className="label--input">
                    <label htmlFor="qtd">Quantidade</label>
                    <input ref={quantRef} className="input" id="qtd" type="number" min={1} max={settingsAdmin.max_input_quantity} required />
                </div>

                {/* <div className="separator"></div> */}


                {(productSelect.expiration_date && !focusSelectProduct && !focusSelectStorage) ? (
                    <>
                    <div className="label--input">
                        <label htmlFor="fabrication">Data de fabricação</label>
                        <input id="fabrication" className="input" value={fabricationDate} onChange={(e)=>setFabricationDate(e.target.value)} type="date" max={formattedMinDate} required />
                    </div>

                    <div className="label--input">
                        <label htmlFor="fabrication">Data de vencimento</label>
                        <input id="fabrication" className="input" value={expirationDate} onChange={(e)=>setExpirationDate(e.target.value)} type="date" min={formattedMinDate} required />
                    </div>

                    <div className="label--input">
                        <label htmlFor="alert-days">Adicionar alerta antes de vencer (em dias)</label>
                        <input ref={alertDaysRef} className="input" id="alert-days" type="number" min={1} max={365} required />
                    </div>
                    </>
                ) : null}



                <div className="btns">
                    <button className="btn primary" disabled={loading || loadingSubmit || hasError}>
                        {loadingSubmit ? 'Registrando...' : 'Registrar entrada'}
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
               
        </div>
    )        
}