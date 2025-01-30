// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useState, useEffect } from 'react';
// import Cookies from "js-cookie";
// import { Navigate } from 'react-router-dom';

// Components:
// import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
import './filteruser.css';


FilterUser.propTypes = {
    close: PropTypes.func,
    userFilter: PropTypes.string,
    setUserFilter: PropTypes.func
}
export function FilterUser({ close, userFilter, setUserFilter }) {
    // const [loading, setLoading] = useState(false);

    const [userFilterModal, setUserFilterModal] = useState(userFilter);
    const optionsFilter = [
        {title: 'Ativados', value: 'active=true'},
        {title: 'Deletados', value: 'active=false'},
        {title: 'Ambos', value: ''}
    ];


    useEffect(()=> {
        // function initialComponent() {
            console.log('Effect Modal FilterUser');

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


    // FILTER:
    async function handleConfirmFilterUser() {
        setUserFilter(userFilterModal);
        // toast.success('Filtro aplicado');
        close();
    }


    return (
        <div className="Modal FilterUser">
            <div className='bg-modal' onClick={close}></div>

            <div className='WindowCreateUser WindowFilterUser grid'>
                <h3>Filtrar Usuários</h3>

                <div className="content-window">
                    <div className="radios-group">
                        {optionsFilter.map((item, idx)=> (
                        <label className='btn-filter' key={idx}>
                            <input 
                            type="radio" 
                            name="userStatus" 
                            value={item.value}
                            onChange={()=> setUserFilterModal(item.value)}
                            checked={item.value == userFilterModal}
                            />
                            {item.title}
                        </label>
                        ))}
                    </div>

                    <div className="btns">
                        <button className="btn primary" onClick={handleConfirmFilterUser} disabled={userFilterModal == userFilter}>
                            Aplicar filtro
                        </button>

                        <button className="btn cancel" type="button" onClick={close}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )        
}