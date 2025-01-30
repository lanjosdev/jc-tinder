// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useEffect } from 'react';
// import { USER_CREATE } from "../../../../API/userApi";
// import Cookies from "js-cookie";
// import { Navigate } from 'react-router-dom';

// Components:
import { CreateSector } from "./CreateSector/CreateSector";
import { DeleteSector } from "./DeleteSector/DeleteSector";
import { UpdateSector } from "./UpdateSector/UpdateSector";
import { FilterSector } from "./FilterSector/FilterSector";
import { RestoreSector } from "./RestoreSector/RestoreSector";
// import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
import './modalsector.css';


ModalSector.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func,
    optionModal: PropTypes.any,
    sectorSelect: PropTypes.object,
    sectorFilter: PropTypes.string,
    setSectorFilter: PropTypes.func
}
export function ModalSector({ close, setReflashState, optionModal, sectorSelect, sectorFilter, setSectorFilter }) {
    // const [loading, setLoading] = useState(false);

    // const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        // function initialComponent() {
            console.log('Effect Modal Sector');

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
                return <CreateSector close={close} setReflashState={setReflashState} />;
            case 'delete':
                return <DeleteSector close={close} setReflashState={setReflashState} sectorSelect={sectorSelect} />;
            case 'update':
                return <UpdateSector close={close} setReflashState={setReflashState} sectorSelect={sectorSelect} />;
            case 'filter':
                return <FilterSector close={close} sectorFilter={sectorFilter} setSectorFilter={setSectorFilter} />;
            case 'restore':
                return <RestoreSector close={close} setReflashState={setReflashState} sectorSelect={sectorSelect} />;
                // return <DeleteSector close={close} setReflashState={setReflashState} sectorSelect={sectorSelect} />;
            default:
                return <div style={{color: 'red'}}>Status desconhecido</div>;
        }
    };


    return (
        <div className="Modal Sector">
            <div className='bg-modal' onClick={close}></div>

            {renderWindowModal()}
        </div>
    )        
}