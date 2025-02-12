// Funcionalidades / Libs:
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useState, useEffect, useContext } from 'react';

// API:
import { PHOTO_UPDATE, PHOTO_UPDATE_SEQUENCE } from "../../../../API/photoApi";

// Context:
import UserContext from "../../../../contexts/userContext";

// Components:
import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
import imgEmpty from '../../../../assets/photo-empty.jpg'

// Estilo:
// import './updatephoto.css';



UpdatePhoto.propTypes = {
    close: PropTypes.func,
    setLoadingModal: PropTypes.func,
    inputSelect: PropTypes.object,
    file: PropTypes.any
}
export function UpdatePhoto({ close, setLoadingModal, inputSelect, file }) {
    const { setRefreshContext, profileDetails } = useContext(UserContext);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const urlPhotoPreview = URL.createObjectURL(file);
    

    const tokenCookie = Cookies.get('token_jc') || null;



    useEffect(()=> {
        function initializeComponent() {
            console.log('Effect Component UpdatePhoto');

        }
        initializeComponent();
    }, []);



    async function updateSequencePhotos(newId) {
        let result = false;
        console.log('newID: ', newId)
        console.log('Photo my-profile: ', profileDetails.photos)

        // Tratamento/manipulação de array
        const newSequence = profileDetails.photos.map((item, idx)=> {
            return {
                order: idx,
                fk_sequences_photos_id: item.id
            }
        })

        newSequence[inputSelect.index] = {
            order: inputSelect.index,
            fk_sequences_photos_id: newId
        }
        console.log('Array tratada para API: ', newSequence);

        // Submit API
        try {
            const response = await PHOTO_UPDATE_SEQUENCE(JSON.parse(tokenCookie), newSequence);
            console.log(response);

            if(response.success) {
                console.log('SEQUENCIA ATUALIZADA');
                result = true;
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

        
        return result;
    }

    // SUBMIT API (UPDATE):
    async function handleSubmitUpdatePhoto() 
    {
        setLoadingModal(true);
        setLoadingSubmit(true);
        console.log(inputSelect.id);

        // SUBMIT
        try {
            const response = await PHOTO_UPDATE(JSON.parse(tokenCookie), inputSelect.id, file);
            console.log(response);

            if(response.success) {
                const result = await updateSequencePhotos(response.data);
            
                setRefreshContext(prev => !prev);
                close();
                if(result) toast.success('Foto atualizada!');
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
        <div className='WindowConfirm UpdateStorage'>
            <div className="photo">
                <img src={imgEmpty} className='hidden' alt="" />
                <img src={urlPhotoPreview} className='preview' alt="" />
            </div>   

            <div className="text_confirm">
                {/* icon */}
                <p>Deseja substituir com esta foto?</p>
            </div>

            <div className="btns_container">
                <button onClick={close} disabled={loadingSubmit}>Cancelar</button>
                <button onClick={handleSubmitUpdatePhoto} disabled={loadingSubmit}>Confirmar</button>
            </div>  
        </div>
    )        
}