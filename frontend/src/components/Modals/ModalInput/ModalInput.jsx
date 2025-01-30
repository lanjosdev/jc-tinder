// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useEffect } from 'react';
// import { USER_CREATE } from "../../../../API/userApi";
// import Cookies from "js-cookie";
// import { Navigate } from 'react-router-dom';

// Components:
import { CreateInput } from "./CreateInput/CreateInput";
import { DeleteInput } from "./DeleteInput/DeleteInput";
import { UpdateInput } from "./UpdateInput/UpdateInput";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
import './modalinput.css';


ModalInput.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func,
    optionModal: PropTypes.any,
    inputSelect: PropTypes.object
}
export function ModalInput({ close, setReflashState, optionModal, inputSelect }) {
    // const [loading, setLoading] = useState(false);

    // const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        // function initialComponent() {
            console.log('Effect Modal Input');

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
                return <CreateInput close={close} setReflashState={setReflashState} />;
            case 'delete':
                return <DeleteInput close={close} setReflashState={setReflashState} inputSelect={inputSelect} />;
            case 'update':
                return <UpdateInput close={close} setReflashState={setReflashState} inputSelect={inputSelect} />;
            default:
                return <div style={{color: 'red'}}>Status desconhecido</div>;
        }
    };


    return (
        <div className="Modal ModalInput">
            <div className='bg-modal' onClick={close}></div>

            {renderWindowModal()}
        </div>
    )        
}