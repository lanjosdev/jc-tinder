// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useEffect } from 'react';
// import Cookies from "js-cookie";

// Components:
import { CreateExit } from "./CreateExit/CreateExit";
import { DeleteExit } from "./DeleteExit/DeleteExit";
import { UpdateExit } from "./UpdateExit/UpdateExit";

// Utils:

// Assets:

// Estilo:
// import './modalexit.css';


ModalExit.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func,
    optionModal: PropTypes.any,
    exitSelect: PropTypes.object
}
export function ModalExit({ close, setReflashState, optionModal, exitSelect }) {
    // const [loading, setLoading] = useState(false);

    // const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        // function initialComponent() {
            console.log('Effect Modal Exit');

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
                return <CreateExit close={close} setReflashState={setReflashState} />;
            case 'delete':
                return <DeleteExit close={close} setReflashState={setReflashState} exitSelect={exitSelect} />;
            case 'update':
                return <UpdateExit close={close} setReflashState={setReflashState} exitSelect={exitSelect} />;
            default:
                return <div style={{color: 'red'}}>Status desconhecido</div>;
        }
    };


    return (
        <div className="Modal ModalExit">
            <div className='bg-modal' onClick={close}></div>

            {renderWindowModal()}
        </div>
    )        
}