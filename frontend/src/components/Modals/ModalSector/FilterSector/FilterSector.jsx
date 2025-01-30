// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useState, useEffect } from 'react';

// Components:
// import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
// import './filtersector.css';


FilterSector.propTypes = {
    close: PropTypes.func,
    sectorFilter: PropTypes.string,
    setSectorFilter: PropTypes.func
}
export function FilterSector({ close, sectorFilter, setSectorFilter }) {
    // const [loading, setLoading] = useState(false);

    const [sectorFilterModal, setSectorFilterModal] = useState(sectorFilter);

    const optionsFilter = [
        {title: 'Ativados', value: 'active=true'},
        {title: 'Deletados', value: 'active=false'},
        {title: 'Ambos', value: ''}
    ];


    useEffect(()=> {
        // function initialComponent() {
            console.log('Effect Window FilterSector');

        // }
        // initialComponent();
    }, []);



    // FILTER/READ:
    async function handleConfirmFilterSector() {
        setSectorFilter(sectorFilterModal);
        close();
    }

    

    return (
        <div className='Window FilterSector grid WindowFilterUser'>
            <h3>Filtrar Setores</h3>

            <div className="content-window">
                <div className="radios-group">
                    {optionsFilter.map((item, idx)=> (
                    <label className='btn-filter' key={idx}>
                        <input 
                        type="radio" 
                        value={item.value}
                        onChange={()=> setSectorFilterModal(item.value)}
                        checked={item.value == sectorFilterModal}
                        />
                        {item.title}
                    </label>
                    ))}
                </div>

                <div className="btns">
                    <button className="btn primary" onClick={handleConfirmFilterSector} disabled={sectorFilterModal == sectorFilter}>
                        Aplicar filtro
                    </button>

                    <button className="btn cancel" type="button" onClick={close}>
                        Cancelar
                    </button>
                </div>
            </div>           
        </div>
    )        
}