// Funcionalidades / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useRef } from 'react';
import { CATEGORY_DELETE } from "../../../../API/categoryApi";

// Components:
import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
import './deletesector.css';


DeleteSector.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func,
    sectorSelect: PropTypes.object
}
export function DeleteSector({ close, setReflashState, sectorSelect }) {
    const [loading, setLoading] = useState(false);
    const elementFocusRef = useRef(null);

    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        function initializeComponent() {
            console.log('Effect Window DeleteSector');

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
    async function handleSubmitDeleteSector() 
    {
        setLoading(true);

        try {
            const response = await CATEGORY_DELETE(JSON.parse(tokenCookie), sectorSelect.id);
            console.log(response);  

            if(response.success) {
                close();
                setReflashState(prev => !prev);
                toast.success('Setor deletado!');
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
        <div className='Window DeleteSector grid'>
            <h3 className="title-danger">
                <i className="bi bi-question-octagon"></i> 
                <span>Deletar setor</span>
            </h3>       

            <div className="content-window">
                <p>Deseja deletar o setor <b>{sectorSelect.name}</b>?</p>          

                <div className="btns">
                    <button className="btn danger" onClick={handleSubmitDeleteSector} disabled={loading}>
                        {loading ? 'Deletando...' : 'Deletar'}
                    </button>

                    <button ref={elementFocusRef} className="btn cancel" onClick={close} disabled={loading}>
                        Cancelar
                    </button>
                </div>
            </div>     
        </div>
    )        
}