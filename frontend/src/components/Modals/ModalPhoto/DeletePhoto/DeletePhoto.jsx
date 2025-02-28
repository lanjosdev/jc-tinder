// Funcionalidades / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useContext } from 'react';

// API:
import { PHOTO_DELETE } from "../../../../API/photoApi";

// Context:
import UserContext from "../../../../contexts/userContext";

// Config JSON:
import imagesServer from '../../../../../public/configApi.json';

// Components:
import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
import imgEmpty from '../../../../assets/photo-empty.jpg';
import iconRemove from '../../../../assets/icon-PhotoExcluir.svg';

// Estilo:
import './deletephoto.css';


DeletePhoto.propTypes = {
    close: PropTypes.func,
    setLoadingModal: PropTypes.func,
    inputSelect: PropTypes.object
}
export function DeletePhoto({ close, setLoadingModal, inputSelect }) {
    const { setRefreshContext } = useContext(UserContext);

    const [loadingSubmit, setLoadingSubmit] = useState(false);


    const tokenCookie = Cookies.get('token_jc') || null;




    useEffect(()=> {
        function initializeComponent() {
            console.log('Effect Component DeletePhoto');

        }
        initializeComponent();
    }, []);



    // DELETE:
    async function handleSubmitDeletePhoto() 
    {
        setLoadingModal(true);
        setLoadingSubmit(true);
        console.log(inputSelect.id);

        // SUBMIT
        try {
            const response = await PHOTO_DELETE(JSON.parse(tokenCookie), inputSelect.id);
            console.log(response);

            if(response.success) {
                close();
                setRefreshContext(prev => !prev);
                toast.success('Foto deletada.');
            }
            else if(response.success == false) {
                toast.error(response.message);
            }
            else {
                toast.error('Erro inesperado.');
            }
        }
        catch(error) {
            if(error?.response?.data?.message == 'Unauthenticated.') {
                console.error('Requisição não autenticada.');
            }
            else {
                toast.error('Houve algum erro.');
            }

            console.error('DETALHES DO ERRO:', error);
        }

        setLoadingModal(false);
        setLoadingSubmit(false);
    }

    

    return (
        <div className='WindowConfirm DeleteStorage'>
            <div className="photo">
                <img src={imgEmpty} className='hidden' alt="" />
                <img src={`${imagesServer.images_url}${inputSelect.thumb_photo}`} className='preview' alt="" />
            </div>   


            <div className="text--actions">
                <div className="text_confirm">
                    <img src={iconRemove} alt="" />
                    <p>Deseja deletar esta foto?</p>
                </div>

                <div className="btns_container">
                    <button className="btn cancel" onClick={close} disabled={loadingSubmit}>
                        Cancelar
                    </button>

                    <button className="btn primary" onClick={handleSubmitDeletePhoto} disabled={loadingSubmit}>
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    )        
}