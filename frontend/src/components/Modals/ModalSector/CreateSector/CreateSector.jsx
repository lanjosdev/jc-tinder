// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useState, useEffect, useRef } from 'react';
import { CATEGORY_CREATE } from "../../../../API/categoryApi";
import Cookies from "js-cookie";

// Components:
import { toast } from "react-toastify";
// import { UserCreate } from './UserCreate/UserCreate';

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
import './createsector.css';


CreateSector.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func
}
export function CreateSector({ close, setReflashState }) {
    const [loading, setLoading] = useState(false);

    const nameRef = useRef('');
    const descRef = useRef('');

    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        // function initialComponent() {
            console.log('Effect Window CreateSector');

        // }
        // initialComponent();
    }, []);



    // CREATE:
    async function handleSubmitCreteSector(e) 
    {
        e.preventDefault();
        setLoading(true);

        const name = nameRef.current?.value;
        const description = descRef.current?.value;

        if(name !== '' && description !== '') {
            try {
                const response = await CATEGORY_CREATE(JSON.parse(tokenCookie), name, description);
                console.log(response);  
    
                if(response.success) {
                    close();
                    setReflashState(prev => !prev);
                    toast.success('Setor criado!');
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
        <div className='Window CreateSector grid'>
            <h3>Cadastrar novo setor</h3>

            <form className="content-window" onSubmit={handleSubmitCreteSector} autoComplete="off">
                <div className="label--input">
                    <label htmlFor="nome">Nome</label>
                    <input ref={nameRef} className="input" id='nome' type="text" required />
                </div>

                <div className="label--input">
                    <label htmlFor="desc">Descrição</label>
                    <textarea ref={descRef} className="input" id="desc" required ></textarea>
                </div>


                <div className="btns">
                    <button className="btn primary" disabled={loading}>
                        {loading ? 'Criando...' : 'Criar setor'}
                    </button>

                    <button className="btn cancel" type="button" onClick={close} disabled={loading}>
                        Cancelar
                    </button>
                </div>
            </form>                
        </div>
    )        
}