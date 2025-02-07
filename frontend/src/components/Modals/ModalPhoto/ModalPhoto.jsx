// Funcionalidades / Libs:
import PropTypes from "prop-types";
// import { useEffect } from 'react';
// import Cookies from "js-cookie";

// Components:
import { toast } from "react-toastify";
// import { CreateStorage } from "./CreateStorage/CreateStorage";
// import { UpdateStorage } from "./UpdateStorage/UpdateStorage";
// import { DeleteStorage } from "./DeleteStorage/DeleteStorage";
// import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
import './modalphoto.css';


ModalPhoto.propTypes = {
    close: PropTypes.func,
    filesPhotos: PropTypes.array,
    setFilesPhotos: PropTypes.func,
    urlsPhotos: PropTypes.array,
    setUrlsPhotos: PropTypes.func,
    inputSelect: PropTypes.object
    // storageSearchState: PropTypes.any,
    // setStorageSearchState: PropTypes.func,
    // setStorageFilterState: PropTypes.func
}
export function ModalPhoto({ 
    close, 
    filesPhotos,
    setFilesPhotos,
    urlsPhotos,
    setUrlsPhotos,
    inputSelect
    // storageSearchState, 
    // setStorageSearchState, 
    // setStorageFilterState 
}) {
    // const [loading, setLoading] = useState(false);

    // const tokenCookie = Cookies.get('tokenEstoque');


    // useEffect(()=> {
    //     // function initialComponent() {

    //         const handleKeyDown = (event)=> {
    //             if(event.key === 'Escape') {
    //               close();
    //             }
    //         };
          
    //         document.addEventListener('keydown', handleKeyDown);
          
    //         // Remove o event listener ao desmontar o componente ou fechar o modal
    //         return () => {
    //             document.removeEventListener('keydown', handleKeyDown);
    //         };
    //     // }
    //     // initialComponent();
    // }, [close]);


    // Função que retorna JSX baseado no switch
    // const renderWindowModal = ()=> {
    //     switch(optionModal) {
    //         case 'create':
    //             return <h1>OIIIII</h1>;
    //             // return <CreateStorage close={close} setReflashState={setReflashState} />;
    //         // case 'update':
    //         //     return <UpdateStorage close={close} setReflashState={setReflashState} storageSelect={storageSelect} />;
    //         // case 'delete':
    //         //     return <DeleteStorage close={close} setReflashState={setReflashState} storageSelect={storageSelect} />;
    //         default:
    //             return <div style={{color: 'red'}}>Modal indefinido</div>;
    //     }
    // };



    function handleChangeFile(e) 
    {
        const file = e.target.files[0] || undefined;
        //// console.log(file);

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

        if(file.size > 20000000) {
            console.warn('Arquivo muito grande! Tamanho máximo de 20MB.');
            toast.warn('Arquivo muito grande! Tamanho máximo de 20MB.');
            return;
        }


        // CHANGE FILE:
        console.log('ARQUIVO OK');                                               
        const newFilesPhotos = [...filesPhotos];
        const newUrlsPhotos = [...urlsPhotos];
        newFilesPhotos[inputSelect.index] = file;
        newUrlsPhotos[inputSelect.index] = URL.createObjectURL(file);
        // console.log(newFilesPhotos);  
        // console.log(newUrlsPhotos);  
        setFilesPhotos(newFilesPhotos);   
        setUrlsPhotos(newUrlsPhotos);   

        close();
    }

    function handleDelFile() 
    {
        console.log(inputSelect);

        const newFilesPhotos = filesPhotos.filter((item, idx)=> idx !== inputSelect.index);
        const newUrlsPhotos = urlsPhotos.filter((item, idx)=> idx !== inputSelect.index);
        // console.log(newFilesPhotos);  
        // console.log(newUrlsPhotos);  
        setFilesPhotos(newFilesPhotos);   
        setUrlsPhotos(newUrlsPhotos);  

        close();
    }
    




    return (
        <div className="Modal ModalPhoto">
            <div className='bg-modal' onClick={close}></div>

            {/* ??? pode ser q use o renderWindowModal aqui */}
            <div className='Window WindowPhoto'>
                <div className="label--input">
                    <label>
                        <i className="bi bi-image-fill"></i>
                        <span>
                            {filesPhotos[inputSelect.index] ? 'Substituir foto' : 'Adicionar foto da galeria'}
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
                        <span>Adicionar foto nova</span>

                        <input 
                        type="file" 
                        accept="image/*"
                        capture="user"
                        onChange={handleChangeFile}
                        />
                    </label>
                </div>


                {inputSelect.index !== 0 && filesPhotos[inputSelect.index] && (
                <>
                <div className="separator"></div>

                <div className="label--input">
                    <label onClick={handleDelFile}>
                        <ion-icon name="close"></ion-icon>
                        {/* <i className="bi bi-trash3"></i> */}
                        <span>Deletar foto</span>
                    </label>
                </div>
                </>
                )}
            </div>

            {/* {renderWindowModal()} */}
        </div>
    )        
}