// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useState } from 'react';
// import Cookies from "js-cookie";

// Components:
import { toast } from "react-toastify";
import { DeletePhoto } from "./DeletePhoto/DeletePhoto";
import { CreatePhoto } from "./CreatePhoto/CreatePhoto";
import { UpdatePhoto } from "./UpdatePhoto/UpdatePhoto";

// Utils:
// import { byteToMegabyte } from "../../../utils/convertUnit";

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
import './modalphoto.css';


ModalPhoto.propTypes = {
    close: PropTypes.func,
    inputSelect: PropTypes.object,
}
export function ModalPhoto({ close, inputSelect }) {
    const [loadingModal, setLoadingModal] = useState(false);

    const [optionWindow, setOptionWindow] = useState(null);
    const [filePhoto, setFilePhoto] = useState(null);
    // const [urlPhoto, setUrlPhoto] = useState(null);


    // const tokenCookie = Cookies.get('tokenEstoque');


    // Função que retorna JSX baseado no switch
    const renderWindowModal = ()=> {
        switch(optionWindow) {
            case 'delete':
                return <DeletePhoto close={close} setLoadingModal={setLoadingModal} inputSelect={inputSelect} />;
            case 'create':
                return <CreatePhoto close={close} setLoadingModal={setLoadingModal} file={filePhoto} />;
            case 'update':
                return <UpdatePhoto close={close} setLoadingModal={setLoadingModal} inputSelect={inputSelect} file={filePhoto} />;
            default:
                return <div style={{color: 'red'}}><h1>Modal indefinido</h1></div>;
        }
    };


    

    function handleChangeFile(e) {
        const file = e.target.files[0] || undefined;
        console.log(file);
        const optWindow = inputSelect.id ? 'update' : 'create';

        // VALIDAÇÕES:
        if(!file) {
            console.error('Algum erro no input file.');
            // toast.error('Algum erro no input file.');
            return;
        }

        if(file.type !== 'image/png' && file.type !== 'image/jpeg') {
            console.warn('Arquivo não aceito.');
            toast.warn('Arquivo não aceito.');
            return;
        }

        // if(file.size > 20000000) {
        //     console.warn('Arquivo muito grande! Tamanho máximo de 20MB.');
        //     toast.warn('Arquivo muito grande! Tamanho máximo de 20MB.');
        //     return;
        // }   


        // CHANGE FILE:
        console.log('ARQUIVO OK');                                               
        console.log(optWindow);
        setFilePhoto(file);   
        // alert('Tamanho do arquivo: ' + byteToMegabyte(file.size) + 'MB');
        setOptionWindow(optWindow);
    }

    function handleOptionDel() {
        console.log('delete');
        setOptionWindow('delete');
    }




    return (
        <div className="Modal ModalPhoto">
            <div className='bg-modal' onClick={()=> !loadingModal && close()}></div>

            {!optionWindow ? (

            <div className='Window WindowPhoto'>
                <div className="label--input">
                    <label>
                        <i className="bi bi-image-fill"></i>
                        <span>
                            {inputSelect.id ? 'Substituir foto' : 'Adicionar foto da galeria'}
                        </span>

                        <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleChangeFile}
                        />
                    </label>
                </div>
                
                <div className="separator"></div>

                <div className="label--input">
                    <label>
                        <i className="bi bi-camera-fill"></i>
                        <span>Tirar foto nova</span>

                        <input 
                        type="file" 
                        accept="image/*"
                        capture="user"
                        onChange={handleChangeFile}
                        />
                    </label>
                </div>


                {(inputSelect.id && inputSelect.index != 0) && (
                <>
                <div className="separator"></div>

                <div className="label--input">
                    <label onClick={handleOptionDel}>
                        <ion-icon name="close"></ion-icon>
                        {/* <i className="bi bi-trash3"></i> */}
                        <span>Deletar foto</span>
                    </label>
                </div>
                </>
                )}
            </div>

            ) : (

            <>{renderWindowModal()}</>

            )}
            

        </div>
    )        
}