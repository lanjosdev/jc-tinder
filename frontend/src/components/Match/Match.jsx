// Funcionalidades / Libs:
import PropTypes from "prop-types";
// import { useState } from 'react';
// import Cookies from "js-cookie";

// Components:


// Utils:


// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
import './match.css';


Match.propTypes = {
    close: PropTypes.func,
    // inputSelect: PropTypes.object,
}
export function Match({ close }) {
    
    // const [urlPhoto, setUrlPhoto] = useState(null);


    // const tokenCookie = Cookies.get('tokenEstoque');





    return (
        <div className="Match">
            <div className="main">
                <div className="top" onClick={close}>X</div>
                <div className="content">
                    <div className="title">
                        <h2>Deu Match</h2>
                    </div>
                    <div className="pair_photos">
                    </div>
                </div>
                <div className="actions">
                    <button>Mandar mensagem</button>
                    <button onClick={close}>Conversar depois</button>
                </div>
            </div>
        </div>
    )        
}