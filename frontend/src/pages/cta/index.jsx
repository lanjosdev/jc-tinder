// Funcionalidades / Libs:
// import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { Link } from "react-router";

// Contexts:
// import UserContext from "../../contexts/userContext";

// Components:
// import { InputPassword } from "../../components/InputPassword/InputPassword";

// Utils

// Assets:
// import imgLogo from '../../assets/LOGO-BIZSYS_preto.png';

// Estilo:
// import './style.css';



export default function Cta() {
    // const navigate = useNavigate();
    // const [error, setError] = useState(null);
    

    // Logica da UI



    useEffect(()=> {
        function initializePage() {
            console.log('Effect /cta');
            
        } 
        initializePage();
    }, []);
    

    
  

  
    return (
        <div className="Page">
            
            <main className='PageContent grid'>
                <div className="title_page">
                    <h1>LOGO</h1>
                </div>

                <div>
                    CTA
                </div>
            </main>

        </div>
    );
}