// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useState } from 'react';
// import { Navigate } from 'react-router-dom';

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:


// Estilo:
import './inputpassword.css';


InputPassword.propTypes = {
    value: PropTypes.string,
    funcSetValue: PropTypes.func,
    dataError: PropTypes.any,
    funcOnBlur: PropTypes.func
}
export function InputPassword({ value, funcSetValue, dataError=null, funcOnBlur }) {
    const [showPassword, setShowPassword] = useState(false);
    

    return (
        <div className="InputPassword">
            <input className="input" 
            type={showPassword ? 'text' : 'password'}
            placeholder="*********"
            value={value}
            onChange={funcSetValue} 
            onBlur={funcOnBlur}
            data-error={`${dataError}`}
            required 
            />

            <div className="eye">
                <label>
                    <input
                    type="checkbox"
                    onClick={()=> setShowPassword(!showPassword)}
                    />

                    {showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                </label>
            </div>
        </div>
    )        
}