// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useEffect } from 'react';
// import Cookies from "js-cookie";

// Components:
import { CreateReservation } from "./CreateReservation/CreateReservation";
import { DeleteReservation } from "./DeleteReservation/DeleteReservation";
import { UpdateReservation } from "./UpdateReservation/UpdateReservation";
import { DetailReservation } from "./DetailReservation/DetailReservation";
import { FinishReservation } from "./FinishReservation/FinishReservation";
import { UndoFinishReservation } from "./UndoFinishReservation/UndoFinishReservation";

// Utils:

// Assets:

// Estilo:
// import './modalexit.css';


ModalReservation.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func,
    optionModal: PropTypes.any,
    reservationSelect: PropTypes.object
}
export function ModalReservation({ close, setReflashState, optionModal, reservationSelect }) {
    // const [loading, setLoading] = useState(false);

    // const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        // function initialComponent() {
            console.log('Effect Modal Reservation');

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
                return <CreateReservation close={close} setReflashState={setReflashState} />;
            case 'delete':
                return <DeleteReservation close={close} setReflashState={setReflashState} reservationSelect={reservationSelect} />;
            case 'update':
                return <UpdateReservation close={close} setReflashState={setReflashState} reservationSelect={reservationSelect} />;
            case 'finish':
                return <FinishReservation close={close} setReflashState={setReflashState} reservationSelect={reservationSelect} />;
            case 'undofinish':
                return <UndoFinishReservation close={close} setReflashState={setReflashState} reservationSelect={reservationSelect} />;
            case 'detail':
                return <DetailReservation close={close} reservationSelect={reservationSelect} />;
            default:
                return <div style={{color: 'red'}}>Status desconhecido</div>;
        }
    };


    return (
        <div className="Modal ModalReservation">
            <div className='bg-modal' onClick={close}></div>

            {renderWindowModal()}
        </div>
    )        
}