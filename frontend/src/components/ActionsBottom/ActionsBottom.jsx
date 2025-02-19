import PropTypes from "prop-types";

// Estilo:
import "./actionsbottom.css";


ActionsBottom.propTypes = {
    loading: PropTypes.bool,
    loadingSubmit: PropTypes.bool,
    handleClickNopeOrLike: PropTypes.func,
    handleClickToBack: PropTypes.func,
    step: PropTypes.number,
    totalPersons: PropTypes.number
}
export function ActionsBottom({ loading, loadingSubmit, handleClickNopeOrLike, handleClickToBack, step, totalPersons }) {
	

	return (
		<div className="ActionsBottom">
            <button 
            className="btn" 
            onClick={()=> handleClickNopeOrLike('nope')} 
            disabled={loading || loadingSubmit || step == totalPersons}
            >
                Nope
            </button>

            <button 
            className="btn" 
            onClick={handleClickToBack}
            disabled={loading || loadingSubmit || step == 0}
            >
                Volta
            </button>

            <button 
            className="btn primary" 
            onClick={()=> handleClickNopeOrLike('like')} 
            disabled={loading || loadingSubmit || step == totalPersons}
            >
                Like
            </button>
        </div>
	);
};