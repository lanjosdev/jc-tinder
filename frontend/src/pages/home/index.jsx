// Funcionalidades / Libs:
// import Cookies from "js-cookie";
import { useState, useEffect } from "react";

// Contexts:
// import UserContext from "../../contexts/userContext";

// Components:
// import { toast } from "react-toastify";
// import { NavMenu } from "../../components/NavMenu/NavMenu";

// Utils
// import { primeiraPalavra } from "../../utils/formatStrings";

// Assets:
// import imgLogo from '../../assets/LOGO-BIZSYS_preto.png';

// Estilo:
import './style.css';



export default function Home() {
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    

    const [persons, setPersons] = useState([]);
    const [totalPersons, setTotalPersons] = useState(0);

    const [step, setStep] = useState(0);
    const [animateMode, setAnimateMode] = useState('');
    // const [action, setAction] = useState('');
    


    useEffect(()=> {
        function initializePage() {
            console.log('Effect /Home');
            
            setLoading(true);
            setHasError(true);

            const pessoas = [
                { nome: 'Ana Silva', idade: 30, urlImagem: 'https://randomuser.me/api/portraits/women/1.jpg' },
                { nome: 'João Almeida', idade: 25, urlImagem: 'https://randomuser.me/api/portraits/men/2.jpg' },
                { nome: 'Maria Santos', idade: 35, urlImagem: 'https://randomuser.me/api/portraits/women/3.jpg' },
                { nome: 'Pedro Gomes', idade: 28, urlImagem: 'https://randomuser.me/api/portraits/men/4.jpg' },
                { nome: 'Laura Pereira', idade: 22, urlImagem: 'https://randomuser.me/api/portraits/women/5.jpg' },
                { nome: 'Lucas Oliveira', idade: 29, urlImagem: 'https://randomuser.me/api/portraits/men/6.jpg' },
                { nome: 'Bruno Costa', idade: 27, urlImagem: 'https://randomuser.me/api/portraits/men/8.jpg' },
                { nome: 'Camila Souza', idade: 24, urlImagem: 'https://randomuser.me/api/portraits/women/9.jpg' },
                { nome: 'Rafael Martins', idade: 33, urlImagem: 'https://randomuser.me/api/portraits/men/10.jpg' }
            ];
            setPersons(pessoas);
            setTotalPersons(pessoas.length);
            setHasError(false);

            setLoading(false);
        } 
        initializePage();
    }, []);
    



    function handleClickNopeOrLike(action) {
        setLoadingSubmit(true);
        // if(animateMode == '') {
        setAnimateMode(action == 'like' ? 'animate__fadeOutBottomRight' : 'animate__fadeOutBottomLeft');
        // }
        
        if(step < totalPersons) {
            // limpa a animação depos de 600ms
            setTimeout(()=> {
                setAnimateMode('');
                setStep(step + 1);
                setLoadingSubmit(false);
            }, 600);   
        }
    }

    // function handleClickToBack() {
    //     setLoadingSubmit(true);
    //     setAnimateMode('animate__devoltar');

        
    //     if(step < totalPersons) {
    //         // limpa a animação depos de 600ms
    //         setTimeout(()=> {
    //             setAnimateMode('');
    //             setStep(step + 1);
    //             setLoadingSubmit(false);
    //         }, 600);   
    //     }
    // }
    
  
    return (
        <div className="Page Home">
            
            {/* <NavMenu /> */}

            <main className='PageContent HomeContent grid'>
                <div className="persons">
                    {loading ? (
                        <h1>CARREGANDO...</h1>
                    ) : (
                        hasError ? (
                            <h1>Houver algum erro!</h1>
                        ) : (
                            persons.length > 0 ? (
                            <>
                            <article className="card fixed"> {/* //=// */}
                                <img src={persons[0].urlImagem} alt="" />
                                <div>
                                    <p>{persons[0].nome}</p>
                                    <p>{persons[0].idade}</p>
                                </div>
                            </article>
                            <h1 className="msg">ACABOU</h1>
                            
                            {/* Foto abaixo */}
                            {persons[step+1] && (
                            <article className="card person">
                                <img src={persons[step+1].urlImagem} alt="" />
                                <div>
                                    <p>{persons[step+1].nome}</p>
                                    <p>{persons[step+1].idade}</p>
                                </div>
                            </article>
                            )}
                            
                            {/* Foto a mostra */}
                            {step < totalPersons && (
                            <article className={`card person ${animateMode}`}>
                                <img src={persons[step].urlImagem} alt="" />
                                
                                <div>
                                    <p>{persons[step].nome}</p>
                                    <p>{persons[step].idade}</p>
                                </div>
                            </article>
                            )}
                            </>
                            ) : (
                            <>
                            <article className="card fixed">
                                <img src='https://randomuser.me/api/portraits/women/1.jpg' alt="" />
                                <div>
                                    <p>NOME</p>
                                    <p>00</p>
                                </div>
                            </article>
                            <h1 className="msg">NADA A MOSTRAR</h1>
                            </>
                            )
                        )
                    )}
                </div>

                <div className="btns_container">
                    <button className="btn danger" onClick={()=> handleClickNopeOrLike('nope')} disabled={loading || loadingSubmit || step == totalPersons}>Nope</button>
                    <button className="btn primary" onClick={()=> handleClickNopeOrLike('like')} disabled={loading || loadingSubmit || step == totalPersons}>Like</button>
                    {/* <button className="btn" disabled={loading}>Volta</button> */}
                </div>
            </main>

        </div>
    );
}