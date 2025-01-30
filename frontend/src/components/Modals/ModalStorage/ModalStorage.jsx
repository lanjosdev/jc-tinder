// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useEffect } from 'react';
// import Cookies from "js-cookie";

// Components:
import { CreateStorage } from "./CreateStorage/CreateStorage";
import { UpdateStorage } from "./UpdateStorage/UpdateStorage";
import { DeleteStorage } from "./DeleteStorage/DeleteStorage";
// import { SearchProduct } from "./SearchProduct/SearchProduct";
// import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
// import './modalstorage.css';


ModalStorage.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func,
    optionModal: PropTypes.any,
    storageSelect: PropTypes.object
    // storageSearchState: PropTypes.any,
    // setStorageSearchState: PropTypes.func,
    // setStorageFilterState: PropTypes.func
}
export function ModalStorage({ 
    close, 
    setReflashState, 
    optionModal, 
    storageSelect, 
    // storageSearchState, 
    // setStorageSearchState, 
    // setStorageFilterState 
}) {
    // const [loading, setLoading] = useState(false);

    // const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        // function initialComponent() {

            const handleKeyDown = (event)=> {
                if(event.key === 'Escape') {
                  close();
                }
            };
          
            document.addEventListener('keydown', handleKeyDown);
          
            // Remove o event listener ao desmontar o componente ou fechar o modal
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        // }
        // initialComponent();
    }, [close]);



    // Função que retorna JSX baseado no switch
    const renderWindowModal = ()=> {
        switch(optionModal) {
            case 'create':
                return <CreateStorage close={close} setReflashState={setReflashState} />;
            case 'update':
                return <UpdateStorage close={close} setReflashState={setReflashState} storageSelect={storageSelect} />;
            case 'delete':
                return <DeleteStorage close={close} setReflashState={setReflashState} storageSelect={storageSelect} />;
            // case 'search':
            //     return <SearchProduct close={close} searchState={storageSearchState} setSearchState={setStorageSearchState} setFilterState={setStorageFilterState} />;
            default:
                return <div style={{color: 'red'}}>Modal indefinido</div>;
        }
    };


    return (
        <div className="Modal ModalProduct">
            <div className='bg-modal' onClick={close}></div>

            {renderWindowModal()}
        </div>
    )        
}