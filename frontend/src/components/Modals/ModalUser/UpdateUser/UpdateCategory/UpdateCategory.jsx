// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useState, useEffect } from 'react';
import { CATEGORY_GET_ALL } from '../../../../../API/categoryApi';
import { USER_GET_CATEGORY, USER_UPDATE_CATEGORY } from '../../../../../API/userApi';
import { ACCESS_RESERVATION } from "../../../../../API/reservationApi";
import Cookies from "js-cookie";
// import { Navigate } from 'react-router-dom';

// Components:
import { toast } from 'react-toastify';

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:


// Estilo:
import './updatecategory.css';


UpdateCategory.propTypes = {
    close: PropTypes.func,
    userSelect: PropTypes.object,
    setReflashState: PropTypes.func
}
export function UpdateCategory({ close, userSelect, setReflashState }) {
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(true);
    const [hasChange, setHasChange] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    
    const [categories, setCategories] = useState([]);
    // const [categoriesIds, setCategoriesIds] = useState([]);
    const [userCategoriesIds, setUserCategoriesIds] = useState([]);
    const [enableReservation, setEnableReservation] = useState(userSelect.reservation_enabled == 1 ? true : false);
    
    const tokenCookie = Cookies.get('tokenEstoque');



    useEffect(()=> {
        async function getCategories() 
        {
            console.log('Effect Component UpdateCategory');

            try {
                //=> GET ALL CATEGORY
                const response = await CATEGORY_GET_ALL(JSON.parse(tokenCookie));
                console.log(response);

                if(response.success) {
                    setCategories(response.data);
                    // setCategoriesIds(response.data.map(item=> item.id));

                    //=> GET USER CATEGORY
                    const response2 = await USER_GET_CATEGORY(JSON.parse(tokenCookie), userSelect.id);
                    console.log(response2);

                    if(response2.success) {
                        setUserCategoriesIds(response2.data.map(item=> item["id-category"]));
                        setHasError(false);
                    }
                    else if(response2.success == false) {
                        toast.error(response2.message);
                    }
                    else {
                        toast.error('Erro inesperado.');
                    }
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
        getCategories();
    }, [tokenCookie, userSelect]);


    // Função para lidar com as mudanças de cada checkbox
    function handleCheckboxChange(categorySelect) {
        setHasChange(true);
        // console.log(categorySelect);
        // console.log('Setores do USER:', userCategoriesIds);

        const newUserCategories = userCategoriesIds.includes(categorySelect) 
            ? userCategoriesIds.filter(item=> item !== categorySelect) //Remove o item se já está marcado
            : [...userCategoriesIds, categorySelect]; //Adiciona o valor se não está marcado


        console.log('NEW Setores do USER:', newUserCategories);
        setUserCategoriesIds(newUserCategories);
    }

    async function handleSubmitUpdateCategory() {
        setLoadingSubmit(true);
        
        if(hasChange && userCategoriesIds.length >= 0) {
            try {
                const response = await USER_UPDATE_CATEGORY(JSON.parse(tokenCookie), userSelect.id, userCategoriesIds);
                console.log(response);  
    
                if(response.success) {
                    const valueReservation = enableReservation ? 1 : 0;
                    if(valueReservation != userSelect.reservation_enabled) {

                        const response2 = await ACCESS_RESERVATION(JSON.parse(tokenCookie), userSelect.id, valueReservation);
                        console.log(response2);

                        if(response2.success) {
                            close();
                            setReflashState(prev => !prev);
                            toast.success('Alteração salva!');
                        }
                        else if(response2.success == false) {
                            toast.error(response2.message);
                        }
                        else {
                            toast.error('Erro inesperado.');
                        }

                    } 
                    else {
                        close();
                        // setReflashState(prev => !prev);
                        toast.success('Setores atualizado!');
                    }
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
        <div className="UpdateCategory">
            <h3>
                <span>Alterar setor do usuário</span>
            </h3>

            <div className="content-window">
                {loading ? (

                    <p>Carregando setores...</p>

                ) : (
                    hasError ? (

                    <p>Erro ao exibir setores!</p>

                    ) : (
                    <>
                    <p>Selecione os setores que o usuário <b>{userSelect.name}</b> irá fazer parte:</p>
                    
                    <div className="checkbox-group">
                    {categories.map(item=> (
                        <label key={item.id} title={item.description}>
                            <input 
                            type="checkbox" 
                            value={item.id} 
                            checked={userCategoriesIds.includes(item.id)}
                            onChange={()=> handleCheckboxChange(item.id)} 
                            />

                            {item.name}
                        </label>
                    ))}
                    </div> 
                    
                    <div className="separator"></div>

                    <label>
                        <input type="checkbox" checked={enableReservation} onChange={()=> {setEnableReservation(prev => !prev); setHasChange(true);}} /> 
                        Autorizar o usuário a realizar <b>reservas</b> de produtos.
                    </label>  
                    </>   
                    )
                )}

                <div className="btns">
                    <button className="btn primary" onClick={handleSubmitUpdateCategory} disabled={loading || loadingSubmit || hasError || !hasChange}>
                        {loadingSubmit ? 'Salvando...' : 'Salvar alteração'}
                    </button>

                    <button className="btn cancel" onClick={close} disabled={loading}>Cancelar</button>
                </div>
            </div>            
        </div>
    )        
}