// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useEffect, useRef } from 'react';

// Context:
// import UserContext from "../../../../contexts/userContext";

// Components:
// import { toast } from "react-toastify";

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
import './searchproduct.css';


SearchProduct.propTypes = {
    close: PropTypes.func,
    searchState: PropTypes.any,
    setSearchState: PropTypes.func,
    setFilterState: PropTypes.func
}
export function SearchProduct({ close, searchState, setSearchState, setFilterState }) {
    // const [loading, setLoading] = useState(true);
    // const [hasError, setHasError] = useState(true);
    // const elementFocusRef = useRef(null);

    const inputSearchRef = useRef(null);



    useEffect(()=> {
        async function initializeComponent() {
            console.log('Effect Window SearchProduct');

            // Inicia dando foco em um elemento do WindowModal
            if(inputSearchRef?.current) {
                setTimeout(() => { 
                    inputSearchRef?.current.focus(); 
                    inputSearchRef.current.value = searchState || '';
                }, 100);
            }
        }
        initializeComponent();
    }, [searchState]);



    function handleSubmitInputSearch(e) 
    {
        e.preventDefault();
        const inputSearch = inputSearchRef?.current?.value;
        
        if(inputSearch != '') {
            console.log('Faz pesquisa de: ' + inputSearch);
            setSearchState(inputSearch);
            setFilterState(`name=${inputSearch}&active=true`);
        } 
        else {
            console.log('ZERA STATE');
            setSearchState(null);
            setFilterState('active=true');
        }

        close();
    }

    

    return (
        <div className='Window SearchProduct grid'>
            <div className="top-window">
                <h3>Pesquisa</h3>

                <i className="bi bi-x-lg" onClick={close}></i>
            </div>

            <form className="content-window" onSubmit={handleSubmitInputSearch} autoComplete="off">
                <input
                type="text"
                placeholder="Digite sua pesquisa"
                // value={inputBUSCA}
                // onChange={handleChangeInputSearch}
                ref={inputSearchRef}
                />

                <button type='submit'>
                    <i className="bi bi-search"></i>
                </button>
            </form>                
        </div>
    )        
}