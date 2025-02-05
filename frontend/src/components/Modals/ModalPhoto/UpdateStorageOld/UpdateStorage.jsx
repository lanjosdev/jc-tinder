// Funcionalidades / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useRef } from 'react';
import { STORAGE_UPDATE } from "../../../../API/storageApi";

// Components:
import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
// import './updatestorage.css';


UpdateStorage.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func,
    storageSelect: PropTypes.object
}
export function UpdateStorage({ close, setReflashState, storageSelect }) {
    const [loading, setLoading] = useState(false);
    const elementFocusRef = useRef(null);

    const nameRef = useRef('');
    const obsRef = useRef('');
    const [updateStorage, setUpdateStorage] = useState(false);

    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        function initializeComponent() {
            console.log('Effect Window UpdateStorage');

            if(elementFocusRef?.current) {
                setTimeout(() => { 
                    elementFocusRef.current.focus(); 
                }, 100);
            }

            if(nameRef.current && obsRef.current) {
                nameRef.current.value = storageSelect.name;
                obsRef.current.value = storageSelect.observation;
            }
        }
        initializeComponent();
    }, [storageSelect]);



    // UPDATE:
    async function handleSubmitUpdateStorage(e) 
    {
        e.preventDefault();
        setLoading(true);

        const name = nameRef?.current?.value;
        const obs = obsRef?.current?.value;

        console.log(storageSelect?.id);
        console.log(name);
        console.log(obs);

        if(name !== '' && obs !== '' && storageSelect?.id) {
            try {
                // const response = await CATEGORY_UPDATE(JSON.parse(tokenCookie), storageSelect?.id, name, obs);
                const response = await STORAGE_UPDATE(JSON.parse(tokenCookie), storageSelect?.id, name, obs);
                console.log(response);  
    
                if(response.success) {
                    close();
                    setReflashState(prev => !prev);
                    toast.success('Alteração salva!');
                }
                else if(response.success == false) {
                    console.error(response.message);
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

        setLoading(false);
    }

    

    return (
        <div className='Window UpdateStorage grid'>
            <h3>Editar local de depósito</h3>

            <form className="content-window" onSubmit={handleSubmitUpdateStorage} autoComplete="off">
                <p>Abaixo você pode editar as informações do depósito <b className="item-edit">{`"${storageSelect.name}"`}</b>.</p> 

                <div className="label--input">
                    <label htmlFor="nome">Nome</label>
                    <input ref={nameRef} className="input" id='nome' type="text" required onFocus={()=> setUpdateStorage(true)} />
                </div>

                <div className="label--input">
                    <label htmlFor="obs">Observação</label>
                    <textarea ref={obsRef} className="input" id="obs" required onFocus={()=> setUpdateStorage(true)} ></textarea>
                </div>


                <div className="btns">
                    <button className="btn primary" disabled={loading || !updateStorage}>
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