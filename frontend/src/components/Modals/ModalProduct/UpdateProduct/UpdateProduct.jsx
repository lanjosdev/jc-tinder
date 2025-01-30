// Funcionalidades / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useRef, useContext } from 'react';
import { CATEGORY_GET_ALL } from "../../../../API/categoryApi";
import { PRODUCT_GET_PER_PARAMS, PRODUCT_UPDATE, PRODUCT_UPDATE_GROUP } from "../../../../API/productApi";

// Context:
import UserContext from "../../../../contexts/userContext";

// Components:
import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
// import './updateproduct.css';


UpdateProduct.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func,
    productSelect: PropTypes.object,
    optionUpdate: PropTypes.any
}
export function UpdateProduct({ close, setReflashState, productSelect, optionUpdate }) {
    const { settingsAdmin } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(true);
    const [loadingProduct, setLoadingProduct] = useState(false);
    const elementFocusRef = useRef(null);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [hasChange, setHasChange] = useState(false);

    const [sectors, setSectors] = useState([]);
    const [products, setProducts] = useState([]);
    const [pageProducts, setPageProducts] = useState(1);
    const [totalPagesProducts, setTotalPagesProducts] = useState(0);


    // Dados para submiter no update:
    const [name, setName] = useState(productSelect.name || '');
    const [sectorProduct, setSectorProduct] = useState(productSelect.fk_category_id);
    const [quantMin, setQuantMin] = useState(productSelect.quantity_min || '');
    const [obs, setObs] = useState(productSelect.observation || '');
    const [hasExpiration, setHasExpiration] = useState(productSelect.expiration_date);
    const [listIdsProducts, setlistIdsProducts] = useState(productSelect.components_group.map(item=> item.id));
    
    const [selectedProducts, setSelectedProducts] = useState(productSelect.components_group.length > 0 ? productSelect.components_group : []);


    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        async function initializeComponent() {
            console.log('Effect Window UpdateProduct');
            // console.log(optionUpdate);

            if(elementFocusRef.current) {
                setTimeout(() => { 
                    elementFocusRef.current.focus(); 
                }, 100);
            }
            

            if(optionUpdate == 'sector' || productSelect.is_group == 1) {
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
            }
            else {
                setHasError(false);
            }

            setLoading(false);
        }
        initializeComponent();
    }, [productSelect, optionUpdate, tokenCookie]);

    useEffect(()=> {
        async function getAllProductsPerSector() {

            if(productSelect.is_group == 1 && sectorProduct) {
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
    }, [tokenCookie, productSelect, pageProducts, sectorProduct]);






    // Função para lidar com os radios
    function handleRadioChange(idSectorSelect) {
        setHasChange(false);
        setSectorProduct(idSectorSelect); 

        if(idSectorSelect == productSelect.fk_category_id) {
            setlistIdsProducts(productSelect.components_group.map(item=> item.id));
            setSelectedProducts(productSelect.components_group);
        }
        else {
            setlistIdsProducts([]); 
            setSelectedProducts([]);
        }
    }

    // Função para lidar com as mudanças de cada checkbox
    function handleCheckboxChange(idProductSelect) {
        setHasChange(true);
        console.log(idProductSelect);
        // console.log('Setores do USER:', userCategoriesIds);

        const newListIdsProducts = listIdsProducts.includes(idProductSelect) 
            ? listIdsProducts.filter(item=> item !== idProductSelect) //Remove o item se já está marcado
            : [...listIdsProducts, idProductSelect]; //Adiciona o valor se não está marcado


        console.log('NEW Produtos do grupo:', newListIdsProducts);
        setlistIdsProducts(newListIdsProducts);

        
        //=> Alimenta/atualiza a lista de preview de selecionados
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

    // UPDATE:
    async function handleSubmitUpdateProduct(e) 
    {
        e.preventDefault();
        setLoadingSubmit(true);

        console.log(name)
        console.log(quantMin)
        console.log(sectorProduct)
        console.log(obs)
        console.log(hasExpiration)

        if(name !== '' && quantMin > 0 && sectorProduct > 0 && hasExpiration !== null) {
            // if(
            //     name == productSelect.name && 
            //     quantMin == productSelect.quantity_min && 
            //     sectorProduct == productSelect.fk_category_id &&
            //     hasExpiration == productSelect.expiration_date
            // ) {
            //     console.log('Nenhuma alteração!');
            //     setLoadingSubmit(false);
            //     return;
            // }

            try {
                const response = await PRODUCT_UPDATE(JSON.parse(tokenCookie), productSelect.id, name, quantMin, sectorProduct, obs, hasExpiration);
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

    // UPDATE GROUP:
    async function handleSubmitUpdateProductGroup(e) 
    {
        e.preventDefault();
        setLoadingSubmit(true);

        console.log(name);
        console.log(sectorProduct);
        console.log(listIdsProducts);

        if(name !== '' && sectorProduct && listIdsProducts.length > 1) {
            try {
                // const response = await PRODUCT_CREATE_GROUP(JSON.parse(tokenCookie), name, sectorProduct, listIdsProducts);
                const response = await PRODUCT_UPDATE_GROUP(JSON.parse(tokenCookie), productSelect.id, name, sectorProduct, listIdsProducts);
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
            if(listIdsProducts.length <= 1) toast.warn('É necessário selecionar mais de um produto');
        }

        setLoadingSubmit(false);
    }
    

    return (
        <div className='Window UpdateProduct CreateProduct grid'>
            {productSelect.is_group == 0 ? (

                optionUpdate == 'product' ? (
                    <>
                    <h3>Editar produto</h3>
        
                    <form className="content-window" onSubmit={handleSubmitUpdateProduct} autoComplete="off">
                        <p>Abaixo você pode editar as informações do produto <b>{productSelect.name}</b>.</p> 
        
                        <div className="label--input">
                            <label htmlFor="nome">Nome</label>
                            <input className="input" id='nome' type="text" 
                            required 
                            value={name} 
                            onChange={(e)=> setName(e.target.value)} 
                            // onFocus={()=> setUpdateProduct(true)} 
                            />
                        </div>
        
                        <div className="label--input">
                            <label htmlFor="qtd">Quantidade mínima</label>
                            <input className="input" id="qtd" type="number" 
                            min={1} 
                            max={settingsAdmin.max_input_quantity_min} 
                            required 
                            value={quantMin}
                            onChange={(e)=> setQuantMin(e.target.value)}
                            // onFocus={()=> setUpdateProduct(true)} 
                            />
                        </div>
        
                        <div className="label--input question">
                            <label>Tem data de vencimento?</label>
        
                            <div className="yes--no">
                                <label>
                                    <input
                                    type="radio"
                                    name="expiration"
                                    // value={1}
                                    onChange={()=> setHasExpiration(1)}
                                    checked={hasExpiration == 1}
                                    required
                                    /> 
                                    Sim
                                </label>
                                <label>
                                    <input
                                    type="radio"
                                    name="expiration"
                                    // value={0}
                                    onChange={()=> setHasExpiration(0)}
                                    checked={hasExpiration == 0}
                                    required
                                    />
                                    Não
                                </label>
                            </div>
                        </div>
        
        
                        <div className="btns">
                            <button className="btn primary" 
                            disabled={loading || loadingSubmit || (name == productSelect.name && quantMin == productSelect.quantity_min && hasExpiration == productSelect.expiration_date)}
                            >
                                {loadingSubmit ? 'Salvando...' : 'Salvar alteração'}
                            </button>
        
                            <button ref={elementFocusRef} className="btn cancel" type="button" onClick={close} disabled={loadingSubmit}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                    </>
                ) : (
                optionUpdate == 'sector' ? (
                    <>
                    <h3>Alterar setor do produto</h3>
        
                    <form className="content-window" onSubmit={handleSubmitUpdateProduct}>
                        <p>Abaixo você pode alterar o setor do produto <b>{productSelect.name}</b>.</p>
        
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
                                            checked={sectorProduct == item.id}
                                            onChange={()=> setSectorProduct(item.id)}
                                            required
                                            />
                                            {item.name}
                                        </label>
                                    ))
                                )}
                            </div>
                        </div>
        
                        <div className="btns">
                            <button className="btn primary" disabled={loading || hasError || sectorProduct == productSelect.fk_category_id || loadingSubmit }>
                                {loadingSubmit ? 'Salvando...' : 'Salvar alteração'}
                            </button>
        
                            <button ref={elementFocusRef} className="btn cancel" type="button" onClick={close} disabled={loadingSubmit}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                    </>
                ) : (
                    <>
                    <h3>Editar observação do produto</h3>
        
                    <form className="content-window" onSubmit={handleSubmitUpdateProduct}>
                        <p>Abaixo você pode editar a observação do produto <b>{productSelect.name}</b>.</p> 
        
                        <div className="label--input">
                            <label htmlFor="obs">Observação</label>
                            <textarea className="input" id="obs" value={obs} onChange={(e)=> setObs(e.target.value)}></textarea>
                        </div>
        
                        <div className="btns">
                            <button className="btn primary" disabled={loading || hasError || (obs == (productSelect.observation || '')) || loadingSubmit }>
                                {loadingSubmit ? 'Salvando...' : 'Salvar alteração'}
                            </button>
        
                            <button ref={elementFocusRef} className="btn cancel" type="button" onClick={close} disabled={loadingSubmit}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                    </>
                )
                )

            ) : (

            <>
            <h3>Editar grupo de produtos</h3>

            <form className="content-window" onSubmit={handleSubmitUpdateProductGroup} autoComplete="off">
                <p>Abaixo você pode editar as informações do grupo <b>{productSelect.name}</b>.</p> 
        
                <div className="label--input">
                    <label htmlFor="nome">Nome do grupo</label>
                    <input className="input" id='nome' type="text" 
                    required 
                    value={name} 
                    onChange={(e)=> setName(e.target.value)} 
                    />
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
                                    onChange={()=> {handleRadioChange(item.id)}}
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

                    {(!loadingProduct && selectedProducts.length > 0) && (
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
                                    

                <div className="btns">
                    <button className="btn primary" 
                    disabled={loading || loadingProduct || loadingSubmit || hasError || (name == productSelect.name && (sectorProduct == productSelect.fk_category_id && !hasChange))}
                    >
                        {loadingSubmit ? 'Salvando...' : 'Salvar alteração'}
                    </button>

                    <button ref={elementFocusRef} className="btn cancel" type="button" onClick={close} disabled={loadingSubmit}>
                        Cancelar
                    </button>
                </div>
            </form> 
            </>

            )}
        
                            
        </div>
    )        
}