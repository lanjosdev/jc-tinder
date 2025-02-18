// import PropTypes from "prop-types";

// Estilo:
import "./actionsbottom.css";


// ActionsBottom.propTypes = {
//     min: PropTypes.number,
//     max: PropTypes.number,
//     ageRange: PropTypes.array,
//     setAgeRange: PropTypes.func
// }
export function ActionsBottom() {
	

	return (
		<div className="ActionsBottom">
            <button 
            className="btn danger" 
            // onClick={()=> handleClickNopeOrLike('nope')} 
            // disabled={loading || loadingSubmit || step == totalPersons}
            >
                Nope
            </button>

            {/* <button className="btn" disabled={loading}>Volta</button> */}

            <button 
            className="btn primary" 
            // onClick={()=> handleClickNopeOrLike('like')} 
            // disabled={loading || loadingSubmit || step == totalPersons}
            >
                Like
            </button>
        </div>
	);
};