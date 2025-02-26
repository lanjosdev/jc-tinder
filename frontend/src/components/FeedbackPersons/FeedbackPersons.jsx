// Funcionalidades / Libs:
import PropTypes from "prop-types";
// import { useState } from 'react';
import { Link } from "react-router";
// import Cookies from "js-cookie";

// Utils:

// Assets:

// Estilo:
import './feedbackpersons.css';



FeedbackPersons.propTypes = {
    refreshPage: PropTypes.func,
    title: PropTypes.string
}
export function FeedbackPersons({ refreshPage, title='Não temos mais pessoas pra mostrar.' }) {
    // Logica da UI:
    

   
    return (
        <div className="FeedbackPersons">
            <h2>{title}</h2>
            <p>Recarregue a página para atualizar a busca por pessoas <br /> ou amplie suas preferências.</p>

            <div className="actions">
                <button className="btn primary" onClick={refreshPage}>Recarregar</button>
                <Link className="btn" to='/preferences'>Amplie suas preferências</Link>
            </div>
        </div>
    )        
}