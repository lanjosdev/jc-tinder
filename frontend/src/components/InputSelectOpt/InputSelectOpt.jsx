// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useEffect, useRef } from 'react';
// import { Navigate } from 'react-router-dom';

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:


// Estilo:
import './inputselectopt.css';


InputSelectOpt.propTypes = {
    titleSelect: PropTypes.string,    
    showListOpt: PropTypes.bool,    
    setShowListOpt: PropTypes.any,    
    arrayOpts: PropTypes.array,    
    targetSelect: PropTypes.object,    
    optSelect: PropTypes.object,  
    handleSelectOpt: PropTypes.func  
}
export function InputSelectOpt({ titleSelect='', showListOpt, setShowListOpt, arrayOpts, targetSelect=null, optSelect, handleSelectOpt }) {
    const thisComponentRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event)=> {
            if(thisComponentRef.current && !thisComponentRef.current.contains(event.target)) {
                setShowListOpt(false);
            }
        };
    
        document.addEventListener('mousedown', handleClickOutside);

        return ()=> {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setShowListOpt]);



    return (
        <div ref={thisComponentRef} className={`InputSelectOpt ${titleSelect ? 'not_margin' : ''}`}>
            <p className="top_select" onClick={()=> setShowListOpt(prev => !prev)}>
                {titleSelect == '' ? (
                    <span>Acrescente mais informações sobre seu gênero (opcional)</span>
                ) : (
                    <span>
                    {optSelect?.name ? (
                        <b>{optSelect?.name}</b>
                    ) : (
                        titleSelect
                    )}
                    </span>
                )}

                <i className={`bi bi-chevron-down ${showListOpt ? 'invert' : ''}`}></i> 
            </p> 

            <ul className={`list_opt ${showListOpt ? '' : 'hide'}`}>
                {targetSelect ? (
                    arrayOpts
                    .filter(itemOpt => itemOpt.gender_main == targetSelect.name)
                    .map(itemOpt=> (
                    <li 
                    key={itemOpt.id} 
                    className={`item ${itemOpt.id == optSelect?.id ? 'checked' : ''}`} 
                    onClick={()=> handleSelectOpt(itemOpt)}>
                        <p><b>{itemOpt.name}</b></p>
                        
                        <small>{itemOpt.description}</small>
                    </li>
                    ))
                ) : (
                    arrayOpts
                    .map(itemOpt=> (
                    <li 
                    key={itemOpt.id} 
                    className={`item ${itemOpt.id == optSelect?.id ? 'checked' : ''}`} 
                    onClick={()=> handleSelectOpt(itemOpt)}>
                        <p><b>{itemOpt.name}</b></p>
                        
                        <small>{itemOpt.description}</small>
                    </li>
                    // <li 
                    // key={item.id}
                    // title={item.id}
                    // className={`item_select ${item.id == sexualitySelect?.id ? 'checked' : ''}`} 
                    // onClick={()=> handleClickSelectSexuality(item)}
                    // >
                    //     <p><b>{item.name}</b></p>
                        
                    //     <small>{item.description}</small>
                    // </li>
                    ))
                )}
                {}
            </ul>
        </div>
    )        
}