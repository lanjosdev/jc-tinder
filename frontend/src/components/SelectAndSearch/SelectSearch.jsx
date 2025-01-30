// Funcionalidades / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useRef } from 'react';
import { PRODUCT_GET_PER_PARAMS } from "../../API/productApi";
import { STORAGE_GET_PER_PARAMS } from "../../API/storageApi";

// Components:
import { toast } from "react-toastify";

// Utils:
import { formatToIdCode } from '../../utils/formatStrings';

// Assets:

// Estilo:
import './selectsearch.css';


SelectAndSearch.propTypes = {
    typeData: PropTypes.string,
    loading: PropTypes.bool,
    arrayItems: PropTypes.array,
    totalPages: PropTypes.any,
    pageCurrent: PropTypes.any,
    setPageCurrent: PropTypes.func,
    focusSelect: PropTypes.bool,
    setFocusSelect: PropTypes.func,
    itemSelect: PropTypes.any,
    setItemSelect: PropTypes.func,
    defaultSearch: PropTypes.any,
    disabledComponent: PropTypes.any,
    refreshComponent: PropTypes.any,
    setRefreshComponent: PropTypes.func
    // currentPage: PropTypes.number,
    // pages: PropTypes.array
}
export function SelectAndSearch({ typeData='produto', loading, arrayItems, totalPages, pageCurrent, setPageCurrent, focusSelect, setFocusSelect, itemSelect, setItemSelect, defaultSearch='', disabledComponent=false, refreshComponent, setRefreshComponent }) {
    const textsComponent = {
        'produto': {
            label: 'Produto',
            placeholder: 'Selecione ou Busque um produto'
        },
        'deposito': {
            label: 'Depositar em',
            placeholder: 'Selecione ou Busque um depósito'
        },
        'entrada': {
            label: 'Entrada relacionada (ID)',
            placeholder: 'Selecione ou Busque pelo ID'
        }
    }
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const thisComponentRef = useRef(null);

    const [productsSearch, setProductsSearch] = useState(null);
    const [pageProductsSearch, setPageProductsSearch] = useState(1);
    const [totalPagesProductsSearch, setTotalPagesProductsSearch] = useState(0);

    const [searchProduct, setSearchProduct] = useState(defaultSearch || '');  


    const tokenCookie = Cookies.get('tokenEstoque');



    //=//
    useEffect(()=> {
        //=> zera os inputs ao mudar o modo de submit modal
        if(refreshComponent == 'reset') {
            console.log('RESETA COMPONENTE')
            setSearchProduct('');
            setProductsSearch(null);
            setRefreshComponent('');
        }
    }, [refreshComponent, setRefreshComponent]);

    // const submitSearchProduct = useCallback(async (e)=> {
    //     if(e) {
    //         e.preventDefault();
    //     }
    //     setLoadingSubmit(true);

        
    //     toast.success('PESQUISAAA')
    //     console.log('PESQUISAAA')
    //     let mock = [
    //         {
    //             "id": 1,
    //             "name-category": "TI (Deletado)",
    //             "name": "pesquisa1",
    //             "quantity_stock": 4,
    //             "quantity_min": 1,
    //             "fk_category_id": 1,
    //             "created_at": "06/12/2024 18:56:46",
    //             "updated_at": "06/12/2024 18:56:46"
    //         },
    //         {
    //             "id": 2,
    //             "name-category": "Oficina",
    //             "name": "pesquisa2",
    //             "quantity_stock": 0,
    //             "quantity_min": 4,
    //             "fk_category_id": 3,
    //             "created_at": "06/12/2024 19:05:29",
    //             "updated_at": "06/12/2024 19:05:29"
    //         }
    //     ];
    //     setProductsSearch(mock)
    //     setTotalPagesProductsSearch(2);


        
    //     setLoadingSubmit(false);
    // }, []);

    // useEffect(()=> {
    //     async function showMoreResults() {
    //         console.log('Effect SelectAndSearch');

    //         //=> GET SEARCH PRODUTOS
    //         // try {
    //         //     const response = await PRODUCT_GET_PER_PAGE_SEARCH(JSON.parse(tokenCookie), "dhretdjtrjk");
    //         //     console.log(response);

    //         //     // if(response.success) {
    //         //     //     setProducts(prev => [...prev, ...response.data.data]);
    //         //     //     setTotalPagesProducts(response.data.last_page);
    //         //     //     setHasError(false);
    //         //     // }
    //         //     // else if(response.success == false) {
    //         //     //     toast.error(response.message);
    //         //     // }
    //         //     // else {
    //         //     //     toast.error('Erro inesperado.');
    //         //     // }
    //         // }
    //         // catch(error) {
    //         //     console.error('DEU ERRO:', error);

    //         //     if(error?.response?.data?.message == 'Unauthenticated.') {
    //         //         toast.error('Requisição não autenticada.');
    //         //     }
    //         //     else {
    //         //         toast.error('Houve algum erro.');
    //         //     }
    //         // }
    //     }
    //     showMoreResults()
    // }, [tokenCookie]);
    useEffect(()=> {        
        const handleClickOutside = (event) => { 
            if(thisComponentRef.current && !thisComponentRef.current.contains(event.target)) { 
                if(focusSelect) {
                    console.warn('Clicou fora');
                    setFocusSelect(false);
                }
            } 
        }; 
        
        // Adiciona o listener
        document.addEventListener('mousedown', handleClickOutside); 
        
        // Cleanup: remove os listeners quando o componente for desmontado
        return ()=> { 
            document.removeEventListener('mousedown', handleClickOutside); 
        };
    }, [focusSelect, setFocusSelect]);





    function handleChangeSearchProduct(e) 
    {
        setSearchProduct(e.target.value);
        setItemSelect(null);

        // setShowError(false);
        if(e.target.value == '') {
            console.log('Zera busca');
            setProductsSearch(null);
        }
    }
    function handleClickItemSelect(productSelect) 
    {
        console.log(productSelect);
        setItemSelect(productSelect);
        setSearchProduct(productSelect.name || productSelect.id);
    }


    async function handleClickShowMoreResults() {
        setLoadingSubmit(true);

        let page = pageProductsSearch + 1;
        setPageProductsSearch(pageProductsSearch + 1);
        // console.log(page);


        //=> GET ALL PRODUTOS
        try {
            const response = await PRODUCT_GET_PER_PARAMS(JSON.parse(tokenCookie), `active=true&name=${searchProduct}&is_group=0`, page);
            console.log(response);

            if(response.success) {
                setProductsSearch(prev => [...prev, ...response.data.data]);
                // setTotalPagesProducts(response.data.last_page);
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


        setLoadingSubmit(false);
    }

    async function getSearchProduct() {
        try {
            // const response = await PRODUCT_GET_PER_PAGE_SEARCH(JSON.parse(tokenCookie), searchProduct, 1);
            const response = await PRODUCT_GET_PER_PARAMS(JSON.parse(tokenCookie), `active=true&name=${searchProduct}&is_group=0`, 1);
            console.log(response);

            if(response.success) {
                setProductsSearch(response.data.data);
                setTotalPagesProductsSearch(response.data.last_page);
            }
            else if(response.success == false) {
                console.warn(response.message);

                if(response.message == "Nenhum produto encontrado com o nome informado.") {
                    setProductsSearch([]);
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
                toast.error('Requisição não autenticada.');
            }
            else {
                toast.error('Houve algum erro.');
            }
        }        
    }
    async function getSearchStorage() {
        try {
            // const response = await PRODUCT_GET_PER_PARAMS(JSON.parse(tokenCookie), `active=true&name=${searchProduct}`, 1);
            const response = await STORAGE_GET_PER_PARAMS(JSON.parse(tokenCookie), `active=true&name=${searchProduct}`, 1);
            console.log(response);

            if(response.success) {
                setProductsSearch(response.data.data);
                setTotalPagesProductsSearch(response.data.last_page);
            }
            else if(response.success == false) {
                console.warn(response.message);

                if(response.message == "Nenhum resultado encontrado para pesquisa solicitada.") {
                    setProductsSearch([]);
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
                toast.error('Requisição não autenticada.');
            }
            else {
                toast.error('Houve algum erro.');
            }
        }      
    }

    async function handleSubmitSearchProduct(e) {
        e.preventDefault();
        setLoadingSubmit(true);

        switch(typeData) {
            case 'produto': 
                await getSearchProduct();
                break;            
            case 'deposito': 
                await getSearchStorage();
                break;            
        }     

        setLoadingSubmit(false);
    }
    
    

    return (
        <form className="SelectAndSearch" onSubmit={handleSubmitSearchProduct} autoComplete="off" ref={thisComponentRef}>

            <div className="label--select">
                <label htmlFor={typeData}>{textsComponent[typeData]['label']}</label>

                <div className="SelectSearch">
                    <div className="search" onClick={()=> setFocusSelect(true)} disabled={disabledComponent || loading}>
                        <input
                        id={typeData}
                        type="text"
                        placeholder={textsComponent[typeData]['placeholder']}
                        value={searchProduct}
                        onChange={handleChangeSearchProduct}
                        disabled={disabledComponent}
                        />

                        {focusSelect ? (
                            <button disabled={!searchProduct || loadingSubmit || itemSelect || searchProduct.replace(/\s/g, '').length < 2}>
                                {/* BUSCAR */}
                                {loadingSubmit ? <span className="loader"></span> : <i className="bi bi-search"></i>}
                            </button>
                            ) : (
                            <button type="button" disabled={disabledComponent}>
                                <i className="bi bi-caret-down-fill"></i>
                            </button>
                        )}
                    </div>

                    <ul className={`select ${focusSelect ? 'mostra' : ''}`}>
                        <li className="title-group">
                            {productsSearch ? 'Resultado da busca' : 'Todos'}
                        </li>

                        {productsSearch ? (
                        <>
                        {productsSearch.length > 0 ? (
                            productsSearch.map(itemS => (
                            <li
                            key={itemS.id}
                            className={`item-group ${itemSelect?.id == itemS.id ? 'selecionado' : ''}`}
                            onClick={()=> handleClickItemSelect(itemS)}
                            >
                                {formatToIdCode(itemS.id)} - {itemS.name}
                            </li>
                            ))
                        ) : (
                            <li className='item-group'>Nenhum resultado encontrado.</li>
                        )}

                        {pageProductsSearch < totalPagesProductsSearch && (
                            <p className="show-more" onClick={handleClickShowMoreResults} disabled={loadingSubmit}>
                                Mais resultados
                            </p>
                        )}
                        </>
                
                        ) : (
                        <>
                        {typeData == 'entrada' ? (
                            arrayItems.map(item=> (
                                <li
                                key={item.id}
                                className={`item-group ${itemSelect?.id == item.id ? 'selecionado' : ''} input`}
                                onClick={()=> handleClickItemSelect(item)}
                                >
                                    <span>ID: <b>{formatToIdCode(item.id, 4)}</b></span>
                                    {item.expiration_date && (
                                    <>
                                    <span className={item.status}>Status: <b>{item.status == "Em alerta" ? 'À vencer' : item.status}</b></span>
                                    <span>Qtd. disponível: <b>{item.quantity_active}</b></span>
                                    </>
                                    )}
                                </li>
                            ))
                        ) : (
                            arrayItems.map(item=> (
                                <li
                                key={item.id}
                                className={`item-group ${itemSelect?.id == item.id ? 'selecionado' : ''}`}
                                onClick={()=> handleClickItemSelect(item)}
                                >
                                    {formatToIdCode(item.id)} - {item.name}
                                </li>
                            ))
                        )}

                        {pageCurrent < totalPages && (
                            <p className="show-more" onClick={()=> setPageCurrent(pageCurrent + 1)}>
                                Mostrar mais
                            </p>
                        )}
                        </>
                        )}
                    </ul>
                </div>
            </div>
            
        </form>
    )        
}