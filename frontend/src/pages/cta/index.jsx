// Funcionalidades / Libs:
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

// Contexts:
// import UserContext from "../../contexts/userContext";

// Components:
// import { InputPassword } from "../../components/InputPassword/InputPassword";

// Utils

// Assets:
import imgLogo from '../../assets/Logo.png'

// Estilo:
import './style.css';



export default function Cta() {
    // const navigate = useNavigate();
    // const [error, setError] = useState(null);
    

    // Logica da UI
    const instructions = [
        '1',
        '2',
        '3',
        '4'
    ];
    const [step, setStep] = useState(0);
    const [animateMode, setAnimateMode] = useState('');


    const navigate = useNavigate();
    const termosCookie = Cookies.get('termos_jc');


    useEffect(()=> {
        function initializePage() {
            console.log('Effect /cta');
            
        } 
        initializePage();
    }, []);
    

    
    
    function handleNextStep() {
        setAnimateMode('');

        setTimeout(()=> {
            setAnimateMode('animate__fadeInRight animate__fast');
            setStep(step + 1);
        }, 100);
    }
    function handleBackStep() {
        setAnimateMode('');

        setTimeout(()=> {
            setAnimateMode('animate__fadeInLeft animate__fast');
            setStep(step - 1);
        }, 100);
    }

    function handleDirectingRoute() {
        if(termosCookie) {
            navigate('/login');
        }
        else {
            //=// navigate('/terms');
            navigate('/login');
        }
    }


  
    return (
        <div className="Page">
            
            <main className='PageContent CtaContent grid'>
                <div className="title_page">
                    <img src={imgLogo} alt="" />
                </div>

                <div className="content_main">
                    <h3>Breve explicação do web app:</h3>

                    <div className="slider">
                        <div className="instructions">
                            <h2 className={`animate__animated ${animateMode}`}>STEP {instructions[step]}</h2>
                        </div>

                        <div className="control">
                            <button className={`btn ${step == 0 ? 'hidden' : ''}`} onClick={handleBackStep}>
                                <i className="bi bi-caret-left-fill"></i>
                                <span>Anterior</span>
                            </button>                        

                            {step < instructions.length-1 ? (
                            <button className="btn" onClick={handleNextStep}>
                                <span>Próximo</span>
                                <i className="bi bi-caret-right-fill"></i>
                            </button>
                            ) : (
                            <button className="btn" onClick={handleDirectingRoute}>
                                Bora começar!
                            </button>
                            )}
                        </div>
                    </div>

                    <div className="skip">
                        <button className="btn" onClick={handleDirectingRoute}>
                            <span>Pular</span>
                            <i className="bi bi-arrow-right-short"></i>
                        </button>
                    </div>
                </div>
            </main>

        </div>
    );
}