// Funcionalidades / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useRef, useContext } from 'react';
import { PRODUCT_DELETE } from "../../../../API/productApi";

// Context:
import UserContext from "../../../../contexts/userContext";

// Components:
import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
// import './deleteproduct.css';


DeleteProduct.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func,
    productSelect: PropTypes.object
}
export function DeleteProduct({ close, setReflashState, productSelect }) {
    const [loading, setLoading] = useState(false);
    const elementFocusRef = useRef(null);

    const {profileDetails} = useContext(UserContext); 

    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        function initializeComponent() {
            console.log('Effect Window DeleteProduct');

            // Coloca foco no elemento em questão
            if(elementFocusRef.current) {
                setTimeout(() => { 
                    elementFocusRef.current.focus(); 
                }, 100);
            }

        }
        initializeComponent();
    }, []);



    // DELETE:
    async function handleSubmitDeleteProduct() 
    {
        setLoading(true);

        try {
            const response = await PRODUCT_DELETE(JSON.parse(tokenCookie), productSelect.id);
            console.log(response);  

            if(response.success) {
                close();
                setReflashState(prev => !prev);
                toast.success(`${productSelect.is_group == 0 ? 'Produto' : 'Grupo de produtos'} deletado!`);
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

        setLoading(false);
    }

    

    return (
        <div className='Window DeleteProduct grid'>
            <h3 className="title-danger">
                <i className="bi bi-question-octagon"></i> 
                <span>Deletar {productSelect.is_group == 0 ? 'produto' : 'grupo de produtos'}</span>
            </h3>       

            <div className="content-window">

                {profileDetails.level == 'admin' ?  (
                <p>
                    Deseja deletar o {productSelect.is_group == 0 ? 'produto' : 'grupo'} <b>{productSelect.name}</b>?
                </p>
                ) : (
                <p className="text-not-access">
                    <i className="bi bi-exclamation-triangle"></i> 
                    Você não pode seguir com esta ação, contate o administrador do ambiente.
                </p>   
                )}            

                <div className="btns">
                    {profileDetails.level == 'admin' && (
                    <button className="btn danger" onClick={handleSubmitDeleteProduct} disabled={loading}>
                        {loading ? 'Deletando...' : 'Deletar'}
                    </button>
                    )}

                    <button ref={elementFocusRef} className="btn cancel" onClick={close} disabled={loading}>
                        {profileDetails.level == 'admin' ? 'Cancelar' : 'Fechar'}
                    </button>
                </div>
            </div>     
        </div>
    )        
}