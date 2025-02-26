import PropTypes from "prop-types";

// Assets:
import iconNope from '../../assets/iconBt-Dislike.svg';
import iconBack from '../../assets/iconBt-Recarregar.svg';
import iconLike from '../../assets/iconBt-like.svg';

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
            className="btn nope" 
            onClick={()=> handleClickNopeOrLike('nope')} 
            disabled={loading || loadingSubmit || step == totalPersons}
            >
                <img src={iconNope} alt="" />
            </button>

            <button 
            className="btn" 
            onClick={handleClickToBack}
            disabled={loading || loadingSubmit || step == 0}
            >
                <img src={iconBack} alt="" />
            </button>

            <button 
            className="btn like" 
            onClick={()=> handleClickNopeOrLike('like')} 
            disabled={loading || loadingSubmit || step == totalPersons}
            >
                <img src={iconLike} alt="" />
            </button>
        </div>
	);
};