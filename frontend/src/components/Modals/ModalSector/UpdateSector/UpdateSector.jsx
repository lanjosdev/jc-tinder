// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useState, useEffect, useRef } from 'react';
import { CATEGORY_UPDATE } from "../../../../API/categoryApi";
import Cookies from "js-cookie";

// Components:
import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
import './updatesector.css';


UpdateSector.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func,
    sectorSelect: PropTypes.object
}
export function UpdateSector({ close, setReflashState, sectorSelect }) {
    const [loading, setLoading] = useState(false);
    const elementFocusRef = useRef(null);

    const nameRef = useRef('');
    const descRef = useRef('');
    const [updateSector, setUpdateSector] = useState(false);

    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        function initializeComponent() {
            console.log('Effect Window UpdateSector');

            if(elementFocusRef.current) {
                setTimeout(() => { 
                    elementFocusRef.current.focus(); 
                }, 100);
            }

            if(nameRef.current && descRef.current) {
                nameRef.current.value = sectorSelect.name;
                descRef.current.value = sectorSelect.description;
            }
        }
        initializeComponent();
    }, [sectorSelect]);



    // UPDATE:
    async function handleSubmitUpdateSector(e) 
    {
        e.preventDefault();
        setLoading(true);

        const name = nameRef.current?.value;
        const description = descRef.current?.value;
        console.log(sectorSelect?.id);
        console.log(name);
        console.log(description);

        if(name !== '' && description !== '' && sectorSelect?.id) {
            try {
                const response = await CATEGORY_UPDATE(JSON.parse(tokenCookie), sectorSelect?.id, name, description);
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

        setLoading(false);
    }

    

    return (
        <div className='Window UpdateSector grid'>
            <h3>Editar setor</h3>

            <form className="content-window" onSubmit={handleSubmitUpdateSector} autoComplete="off">
                <p>Abaixo você pode editar as informações do setor de <b>{sectorSelect.name}</b>.</p> 

                <div className="label--input">
                    <label htmlFor="nome">Nome</label>
                    <input ref={nameRef} className="input" id='nome' type="text" required onFocus={()=> setUpdateSector(true)} />
                </div>

                <div className="label--input">
                    <label htmlFor="desc">Descrição</label>
                    <textarea ref={descRef} className="input" id="desc" required onFocus={()=> setUpdateSector(true)} ></textarea>
                </div>


                <div className="btns">
                    <button className="btn primary" disabled={loading || !updateSector}>
                        {loading ? 'Salvando...' : 'Salvar alteração'}
                    </button>

                    <button ref={elementFocusRef} className="btn cancel" type="button" onClick={close} disabled={loading}>
                        Cancelar
                    </button>
                </div>
            </form>                
        </div>
    )        
}