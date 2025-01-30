// Funcionalidades / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useRef } from 'react';
import { STORAGE_CREATE } from "../../../../API/storageApi";

// Context:
// import UserContext from "../../../../contexts/userContext";

// Components:
import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
// import './createstorage.css';


CreateStorage.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func
}
export function CreateStorage({ close, setReflashState }) {
    const [loading, setLoading] = useState(false);

    const nameRef = useRef('');
    const obsRef = useRef('');


    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        async function initializeComponent() {
            console.log('Effect Window CreateStorage');            
        }
        initializeComponent();
    }, []);



    // CREATE:
    async function handleSubmitCreteStorage(e) 
    {
        e.preventDefault();
        setLoading(true);

        const name = nameRef.current?.value;
        const obs = obsRef.current?.value;

        if(name !== '' && obs !== '') {
            try {
                const response = await STORAGE_CREATE(JSON.parse(tokenCookie), name, obs);
                console.log(response);  
    
                if(response.success) {
                    close();
                    setReflashState(prev => !prev);
                    toast.success('Depósito cadastrado!');
                }
                else if(response.success == false) {
                    console.warn(response.message);
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
        <div className='Window CreateStorage grid'>
            <h3>Cadastrar novo local de depósito</h3>   

            <form className="content-window" onSubmit={handleSubmitCreteStorage} autoComplete="off">
                <div className="label--input">
                    <label htmlFor="nome">Nome</label>
                    <input ref={nameRef} className="input" id='nome' type="text" required />
                </div>

                <div className="label--input">
                    <label htmlFor="obs">Observação</label>
                    <textarea ref={obsRef} className="input" id="obs" required ></textarea>
                </div>


                <div className="btns">
                    <button className="btn primary" disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Cadastrar depósito'}
                    </button>

                    <button className="btn cancel" type="button" onClick={close} disabled={loading}>
                        Cancelar
                    </button>
                </div>
            </form>           
        </div>
    )        
}