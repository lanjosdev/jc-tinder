// Funcionalidades / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useRef, useContext } from 'react';
import { PRODUCT_GET_PER_PARAMS } from "../../../../API/productApi";
import { STORAGE_GET_PER_PARAMS } from "../../../../API/storageApi";

import { INPUT_UPDATE } from "../../../../API/inputApi";

// Contexts:
import UserContext from "../../../../contexts/userContext";

// Components:
import { toast } from "react-toastify";
import { SelectAndSearch } from "../../../SelectAndSearch/SelectSearch";

// Utils:
import { formatMinDateCalender, formatDateAmerican } from "../../../../utils/formatDate";

// Assets:

// Estilo:
import './updateinput.css';


UpdateInput.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func,
    inputSelect: PropTypes.object
}
export function UpdateInput({ close, setReflashState, inputSelect }) {
    const { settingsAdmin } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(true);
    const elementFocusRef = useRef(null);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    // States para pré carrementos de Produtos
    const [products, setProducts] = useState([]);
    const [pageProducts, setPageProducts] = useState(1);
    const [totalPagesProducts, setTotalPagesProducts] = useState(0);

    const [focusSelect, setFocusSelect] = useState(false);

    // States para pré carrementos de Depositos
    const [storages, setStorages] = useState([]);
    const [pageStorages, setPageStorages] = useState(1);
    const [totalPagesStorages, setTotalPagesStorages] = useState(0);

    const [focusSelectStorage, setFocusSelectStorage] = useState(false);

    // Estados e dados para o modal
    // Obtém a data e hora atuais 
    const currentDate = new Date(); 
    const dateCurrentAmerican = formatMinDateCalender(currentDate, true);
    const minInputExpirationDate = formatDateAmerican(inputSelect?.expiration_date, true) < dateCurrentAmerican ? formatDateAmerican(inputSelect?.expiration_date, true) : dateCurrentAmerican;


    // Dados para submeter:
    const [productSelect, setProductSelect] = useState(inputSelect.id_product ? {id: inputSelect.id_product, expiration_date: inputSelect.expiration_date} : null);
    const [storageSelect, setStorageSelect] = useState(inputSelect.storage_locations_id ? {id: inputSelect.storage_locations_id} : null);
    const [quantity, setQuantity] = useState(inputSelect.quantity || '');
    const [fabricationDate, setFabricationDate] = useState(formatDateAmerican(inputSelect?.date_of_manufacture, true));
    const [expirationDate, setExpirationDate] = useState(formatDateAmerican(inputSelect?.expiration_date, true));
    const [alertDays, setAlertDays] = useState(inputSelect?.alert);


    const tokenCookie = Cookies.get('tokenEstoque');



    useEffect(()=> {
        // Inicia dando foco em um elemento do WindowModal
        if(elementFocusRef.current) {
            setTimeout(() => { 
                elementFocusRef.current.focus(); 
            }, 100);
        }
    }, []);

    // useEffect(()=> {
    //     async function initializeComponent() {
    //         console.log('Effect Window UpdateInput');

    //         //=> GET ALL PRODUTOS
    //         try {
    //             const response = await PRODUCT_GET_PER_PAGE(JSON.parse(tokenCookie), pageProducts);
    //             console.log(response);

    //             if(response.success) {
    //                 setProducts(prev => [...prev, ...response.data.data]);
    //                 setTotalPagesProducts(response.data.last_page);
    //                 setHasError(false);
    //             }
    //             else if(response.success == false) {
    //                 toast.error(response.message);
    //             }
    //             else {
    //                 toast.error('Erro inesperado.');
    //             }
    //         }
    //         catch(error) {
    //             console.error('DEU ERRO:', error);

    //             if(error?.response?.data?.message == 'Unauthenticated.') {
    //                 toast.error('Requisição não autenticada.');
    //             }
    //             else {
    //                 toast.error('Houve algum erro.');
    //             }
    //         }

    //         setLoading(false);
    //     }
    //     initializeComponent();
    // }, [tokenCookie, pageProducts]);
    useEffect(()=> {
        async function getAllProductsActives() {
            console.log('Effect Window UpdateInput');

            try {
                setLoading(true);
                setHasError(true);
                
                // const response = await PRODUCT_GET_PER_PAGE(JSON.parse(tokenCookie), pageProducts);
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




    // UPDATE
    async function handleSubmitUpdateInput(e) 
    {
        e.preventDefault();
        setLoadingSubmit(true);

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
                const response = await INPUT_UPDATE(JSON.parse(tokenCookie), inputSelect.id, productSelect.id, storageSelect.id, quantity, fabricationDate, expirationDate, alertDays);
                console.log(response);  
    
                if(response.success) {
                    close();
                    setReflashState(prev => !prev);
                    toast.success('Alteração registrada!');
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
        <div className='Window UpdateInput UpdateReservation grid'>
            <h3>Editar entrada no estoque</h3>

            <div className="top-window">
                <p>Abaixo você pode editar os dados da entrada em questão.</p>
                
                {/* <SelectAndSearch
                typeData="produto"
                loading={loading}
                products={products}
                totalPagesProducts={totalPagesProducts}
                pageProducts={pageProducts}
                setPageProducts={setPageProducts}
                focusSelect={focusSelect}
                setFocusSelect={setFocusSelect}
                idProductSelect={idProductSelect}
                setIdProductSelect={setIdProductSelect}
                defaultSearch={inputSelect.product_name}
                /> */}
                <SelectAndSearch 
                typeData="produto"
                loading={loading}
                arrayItems={products}
                totalPages={totalPagesProducts}
                pageCurrent={pageProducts}
                setPageCurrent={setPageProducts}
                focusSelect={focusSelect}
                setFocusSelect={setFocusSelect}
                itemSelect={productSelect}
                setItemSelect={setProductSelect}
                defaultSearch={inputSelect.product_name}
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
                defaultSearch={inputSelect.storage_locations_name}
                />
            </div>

            {(productSelect && storageSelect) ? (
            <form className="content-window" onSubmit={handleSubmitUpdateInput} autoComplete="off">
                <div className="label--input">
                    <label htmlFor="qtd">Quantidade</label>
                    <input ref={elementFocusRef} className="input" value={quantity} onChange={(e)=> setQuantity(e.target.value)} id="qtd" type="number" min={1} max={settingsAdmin.max_input_quantity} onFocus={()=> setFocusSelect(false)} required />
                </div>

                {(productSelect.expiration_date && !focusSelect && !focusSelectStorage) ? (
                    <>
                    <div className="label--input">
                        <label htmlFor="fabrication">Data de fabricação</label>
                        <input id="fabrication" className="input" value={fabricationDate} onChange={(e)=>setFabricationDate(e.target.value)} type="date" max={dateCurrentAmerican} required />
                    </div>

                    <div className="label--input">
                        <label htmlFor="fabrication">Data de vencimento</label>
                        <input 
                        type="date" 
                        id="fabrication" 
                        className="input" 
                        value={expirationDate} 
                        onChange={(e)=>setExpirationDate(e.target.value)} 
                        min={fabricationDate != '' ? fabricationDate : minInputExpirationDate} 
                        required 
                        />
                    </div>

                    <div className="label--input">
                        <label htmlFor="alert-days">Adicionar alerta antes de vencer (em dias)</label>
                        <input className="input" id="alert-days" type="number" value={alertDays} onChange={(e)=> setAlertDays(e.target.value)} min={1} max={365} required />
                    </div>
                    </>
                ) : null}



                <div className="btns">
                    <button className="btn primary" disabled={ loading || loadingSubmit || hasError || !productSelect || (inputSelect.id_product == productSelect.id && inputSelect.storage_locations_id == storageSelect.id && inputSelect.quantity == quantity && fabricationDate == formatDateAmerican(inputSelect?.date_of_manufacture, true) && expirationDate == formatDateAmerican(inputSelect?.expiration_date, true) && alertDays == inputSelect?.alert) }>
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
            )} 
          
        </div>
    )        
}