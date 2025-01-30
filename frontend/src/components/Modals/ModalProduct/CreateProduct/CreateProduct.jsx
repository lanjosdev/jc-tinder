// Funcionalidades / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useRef, useContext } from 'react';
import { CATEGORY_GET_ALL } from "../../../../API/categoryApi";
import { PRODUCT_GET_PER_PARAMS, PRODUCT_CREATE, PRODUCT_CREATE_GROUP } from "../../../../API/productApi";

// Context:
import UserContext from "../../../../contexts/userContext";

// Components:
import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
import './createproduct.css';


CreateProduct.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func
}
export function CreateProduct({ close, setReflashState }) {
    const { settingsAdmin } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(true);
    const [loadingProduct, setLoadingProduct] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const [sectors, setSectors] = useState([]);
    const [products, setProducts] = useState([]);
    const [pageProducts, setPageProducts] = useState(1);
    const [totalPagesProducts, setTotalPagesProducts] = useState(0);
    

    const [selectedProducts, setSelectedProducts] = useState([]);
    // Dados para submeter
    const [modeCreate, setModeCreate] = useState('unitary');
    const nameRef = useRef('');
    const quantMinRef = useRef(0);
    const [sectorProduct, setSectorProduct] = useState(null);
    const obsRef = useRef(null);
    const [hasExpiration, setHasExpiration] = useState(null);
    const [listIdsProducts, setlistIdsProducts] = useState([]);


    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        async function initializeComponent() {
            console.log('Effect Window CreateProduct');

            try {
                //=> GET ALL CATEGORY
                const response = await CATEGORY_GET_ALL(JSON.parse(tokenCookie), 'active=true');
                console.log(response);

                if(response.success) {
                    setSectors(response.data);
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
    }, [tokenCookie]);

    useEffect(()=> {
        async function getAllProductsPerSector() {

            if(modeCreate == 'group' && sectorProduct) {
                try {
                    setLoadingProduct(true);
                    setHasError(true);
                    setProducts([]);
                    
                    const response = await PRODUCT_GET_PER_PARAMS(JSON.parse(tokenCookie), `active=true&category=${sectorProduct}&expiration_date=0`, pageProducts);
                    console.log(response);
    
                    if(response.success) {
                        setProducts(prev => [...prev, ...response.data.data]);
                        setTotalPagesProducts(response.data.last_page);
                        setHasError(false);
                    }
                    else if(response.success == false) {
                        console.error(response.message);

                        if(response.message == "Nenhum produto encontrado com o nome informado.") {
                            setHasError(false);
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

                setLoadingProduct(false);
            }

        }
        getAllProductsPerSector();
    }, [tokenCookie, modeCreate, pageProducts, sectorProduct]);




    function handleChangeModeCreate(mode) {
        nameRef.current.value = '';
        quantMinRef.current = null;
        obsRef.current = null;
        setSectorProduct(null);
        setHasExpiration(null);
        setProducts([]);
        setPageProducts(1);
        setTotalPagesProducts(0);

        setModeCreate(mode);
    }

    // Função para lidar com as mudanças de cada checkbox
    function handleCheckboxChange(idProductSelect) {
        console.log(idProductSelect);
        // console.log('Setores do USER:', userCategoriesIds);

        const newListIdsProducts = listIdsProducts.includes(idProductSelect) 
            ? listIdsProducts.filter(item=> item !== idProductSelect) //Remove o item se já está marcado
            : [...listIdsProducts, idProductSelect]; //Adiciona o valor se não está marcado


        console.log('NEW Produtos do grupo:', newListIdsProducts);
        setlistIdsProducts(newListIdsProducts);

        

        let previewSelected = [];
        for(let i=0; i < newListIdsProducts.length; i++) {
            for(let j=0; j < products.length; j++) {
                if(newListIdsProducts[i] == products[j].id) {
                    previewSelected.push(products[j]);
                    break;
                }
            }
        }
        console.log(previewSelected);
        setSelectedProducts(previewSelected);
    }

    // CREATE:
    async function handleSubmitCreteProduct(e) 
    {
        e.preventDefault();
        setLoadingSubmit(true);

        // const isGroup = modeCreate == 'unitary' ? 0 : 1;
        const isGroup = 0;
        const name = nameRef.current?.value;
        const quantMin = quantMinRef.current?.value;
        const obs = obsRef.current?.value;
        console.log(isGroup);
        console.log(name);
        console.log(quantMin);
        console.log(sectorProduct);
        console.log(obs);
        console.log(hasExpiration);

        if(name !== '' && quantMin > 0 && sectorProduct && hasExpiration !== null) {
            try {
                // const response = await PRODUCT_CREATE(JSON.parse(tokenCookie), name, quantMin, sectorProduct, obs, hasExpiration);
                const response = await PRODUCT_CREATE(JSON.parse(tokenCookie), isGroup, name, quantMin, sectorProduct, obs, hasExpiration);
                console.log(response);  
    
                if(response.success) {
                    close();
                    setReflashState(prev => !prev);
                    toast.success('Produto cadastrado!');
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

    // CREATE GROUP:
    async function handleSubmitCreteProductGroup(e) 
    {
        e.preventDefault();
        setLoadingSubmit(true);

        const name = nameRef.current?.value;
        console.log(name);
        console.log(sectorProduct);
        console.log(listIdsProducts);

        if(name !== '' && sectorProduct && listIdsProducts.length > 1) {
            try {
                // const response = await PRODUCT_CREATE(JSON.parse(tokenCookie), isGroup, name, quantMin, sectorProduct, obs, hasExpiration);
                const response = await PRODUCT_CREATE_GROUP(JSON.parse(tokenCookie), name, sectorProduct, listIdsProducts);
                console.log(response);  
    
                if(response.success) {
                    close();
                    setReflashState(prev => !prev);
                    toast.success('Grupo de produtos cadastrado!');
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
            if(listIdsProducts.length <= 1) toast.warn('É necessário selecionar mais de um produto');
        } 

        setLoadingSubmit(false);
    }

    

    return (
        <div className='Window CreateProduct grid'>
            <h3>Cadastrar novo {modeCreate == 'unitary' ? 'produto' : 'grupo de produtos'}</h3>

            <div className="tabs">
                <button 
                className={modeCreate == 'unitary' ? 'tab-ativa' : ''}
                onClick={()=> handleChangeModeCreate('unitary')}
                disabled={loadingSubmit}
                >Unitário</button>

                <button 
                className={modeCreate == 'group' ? 'tab-ativa' : ''}
                onClick={()=> handleChangeModeCreate('group')}
                disabled={loadingSubmit}
                >Grupo</button>
            </div>


            {modeCreate == 'unitary' ? (
                <form className="content-window" onSubmit={handleSubmitCreteProduct} autoComplete="off">
                    <div className="label--input">
                        <label htmlFor="nome">Nome</label>
                        <input ref={nameRef} className="input" id='nome' type="text" required />
                    </div>

                    <div className="label--input">
                        <label htmlFor="qtd">Quantidade mínima</label>
                        <input ref={quantMinRef} className="input" id="qtd" type="number" min={1} max={settingsAdmin.max_input_quantity_min} required />
                    </div>

                    <div className="label--input">
                        <label>Setor</label>
                        
                        <div className="radio-group">
                            {loading ? (
                                <p>Carregando...</p>
                            ) : (
                                sectors.map(item=> (
                                    <label key={item.id} title={item.description}>
                                        <input 
                                        type="radio" 
                                        name="setor"
                                        value={item.id} 
                                        onChange={()=> setSectorProduct(item.id)}
                                        required
                                        />
                                        {item.name}
                                    </label>
                                ))
                            )}
                            
                        </div>
                    </div>

                    <div className="label--input">
                        <label htmlFor="obs">Observação</label>
                        <textarea ref={obsRef} className="input" id="obs"></textarea>
                    </div>

                    <div className="label--input question">
                        <label>Tem data de vencimento?</label>

                        <div className="yes--no">
                            <label>
                                <input
                                type="radio"
                                name="expiration"
                                value={1}
                                onChange={()=> setHasExpiration(1)}
                                required
                                /> 
                                Sim
                            </label>
                            <label>
                                <input
                                type="radio"
                                name="expiration"
                                value={0}
                                onChange={()=> setHasExpiration(0)}
                                required
                                />
                                Não
                            </label>
                        </div>
                    </div>


                    <div className="btns">
                        <button className="btn primary" disabled={loading || loadingSubmit || !sectorProduct || hasError}>
                            {loadingSubmit ? 'Cadastrando...' : 'Cadastrar produto'}
                        </button>

                        <button className="btn cancel" type="button" onClick={close} disabled={loadingSubmit}>
                            Cancelar
                        </button>
                    </div>
                </form> 
            ) : (
                <form className="content-window" onSubmit={handleSubmitCreteProductGroup} autoComplete="off">
                    <div className="label--input">
                        <label htmlFor="nome">Nome do grupo</label>
                        <input ref={nameRef} className="input" id='nome' type="text" required />
                    </div>

                    <div className="label--input">
                        <label>Setor</label>
                        
                        <div className="radio-group">
                            {loading ? (
                                <p>Carregando...</p>
                            ) : (
                                sectors.map(item=> (
                                    <label key={item.id} title={item.description}>
                                        <input 
                                        type="radio" 
                                        name="setor"
                                        value={item.id} 
                                        onChange={()=> {setSectorProduct(item.id); setlistIdsProducts([]); setSelectedProducts([])}}
                                        checked={item.id == sectorProduct}
                                        required
                                        />
                                        {item.name}
                                    </label>
                                ))
                            )}
                            
                        </div>
                    </div>

                    {sectorProduct && (
                    <div className="label--input">
                        <label htmlFor="">Selecione os produtos ({listIdsProducts.length})</label>

                        <div className="checkbox-group input">

                        {loadingProduct ? (

                            <p>Carregando...</p>

                        ) : (
                        hasError ? (

                            <p>Erro ao carregar produtos!</p>

                        ) : (
                            products.length == 0 ? (
                                
                                <p>Nada encontrado.</p>
                                
                            ) : (
                                <>
                                {products.map(item=> (
                                    <label key={item.id} title={item.id}>
                                        <input
                                        type="checkbox"
                                        // value={item.id}
                                        checked={listIdsProducts.includes(item.id)}
                                        onChange={()=> handleCheckboxChange(item.id)}
                                        />
                                        <span> {item.name}</span>
                                    </label>
                                ))}
                                
                                {pageProducts < totalPagesProducts && (
                                    <label className="see-more" onClick={()=> setPageProducts(pageProducts + 1)}>
                                        <i className="bi bi-chevron-down"></i>
                                        Mostrar mais
                                    </label>
                                )}
                                </>
                            )
                        )
                        )}

                        </div> 

                        {selectedProducts.length > 0 && (
                            <div className="show-selected">
                                <small>Você selecionou: </small>

                                {selectedProducts.map(item=> (
                                    <button type="button" className="tag" key={item.id} onClick={()=> handleCheckboxChange(item.id)}>
                                        {item.name}
                                        <i className="bi bi-x"></i>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div> 
                    )}
                                       

                    {/* <div className="label--input">
                        <label htmlFor="obs">Observação</label>
                        <textarea ref={obsRef} className="input" id="obs"></textarea>
                    </div> */}


                    <div className="btns">
                        <button className="btn primary" disabled={loading || loadingSubmit || !sectorProduct || hasError}>
                            {loadingSubmit ? 'Cadastrando...' : 'Cadastrar grupo'}
                        </button>

                        <button className="btn cancel" type="button" onClick={close} disabled={loadingSubmit}>
                            Cancelar
                        </button>
                    </div>
                </form> 
            )}               
        </div>
    )        
}