// Funcionalidades / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useRef } from 'react';
import { CATEGORY_RESTORE } from "../../../../API/categoryApi";

// Components:
import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
// import './restoresector.css';


RestoreSector.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func,
    sectorSelect: PropTypes.object
}
export function RestoreSector({ close, setReflashState, sectorSelect }) {
    const [loading, setLoading] = useState(false);
    const elementFocusRef = useRef(null);

    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        function initializeComponent() {
            console.log('Effect Window RestoreSector');

            // Coloca foco no elemento em questão
            if(elementFocusRef.current) {
                setTimeout(() => { 
                    elementFocusRef.current.focus(); 
                }, 100);
            }

        }
        initializeComponent();
    }, []);



    // RESTORE (POST):
    async function handleSubmitRestoreSector() 
    {
        setLoading(true);

        try {
            const response = await CATEGORY_RESTORE(JSON.parse(tokenCookie), sectorSelect.id);
            console.log(response);  

            if(response.success) {
                close();
                setReflashState(prev => !prev);
                toast.success(`Setor "${response.data.name}" restaurado!`);
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

        setLoading(false);
    }

    

    return (
        <div className='Window RestoreSector grid'>
            <h3 className="title-neutral">
                <i className="bi bi-arrow-clockwise"></i>
                <span>Restaurar setor</span>
            </h3>

            <div className="content-window">
                <p>Deseja restaurar o setor <b>{sectorSelect.name}</b>?</p>          

                <div className="btns">
                    <button className="btn primary" onClick={handleSubmitRestoreSector} disabled={loading}>
                        {loading ? 'Restaurando...' : 'Restaurar'}
                    </button>

                    <button ref={elementFocusRef} className="btn cancel" onClick={close} disabled={loading}>
                        Cancelar
                    </button>
                </div>
            </div>     
        </div>
    )        
}