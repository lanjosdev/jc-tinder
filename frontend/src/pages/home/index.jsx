// Funcionalidades / Libs:
import Cookies from "js-cookie";
import { useState, useEffect } from "react";

// API:
import { USER_GET_ALL } from "../../API/userApi";

// Contexts:
// import UserContext from "../../contexts/userContext";

// Config JSON:
import imagesServer from '../../../public/configApi.json'

// Components:
import { NavBar } from "../../components/NavBar/NavBar";
import { ActionsBottom } from "../../components/ActionsBottom/ActionsBottom";

// Utils
// import { primeiraPalavra } from "../../utils/formatStrings";

// Assets:
import imgEmpty from '../../assets/photo-empty.jpg';

// Estilo:
import './style.css';



export default function Home() {
    // Estados do componente:
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [loadingSubmit, setLoadingSubmit] = useState(false);
    
    // Dados pré-carregados:
    const [persons, setPersons] = useState([]);
    const [totalPersons, setTotalPersons] = useState(0);

    // Logica da UI:
    const [step, setStep] = useState(0);
    const [animateMode, setAnimateMode] = useState('');
    // const [action, setAction] = useState('');


    // Submit (Like or Dislike)
    // const [userSelect, setUserSelect] = useState(null);
    // const [statusPost, setStatusPost] = useState(0); // 1 = Like OR 0 = Dislike
    
    const tokenCookie = Cookies.get('token_jc');

    
   
        
    useEffect(()=> {
        async function getAllUsers() {
            console.log('Effect /Home');
            setLoading(true);
            
            try {
                setError(true);
                const response = await USER_GET_ALL(JSON.parse(tokenCookie));
                console.log(response);

                if(response.success) {
                    setPersons(response.data);
                    setTotalPersons(response.data.length);

                    setError(false);
                }
                else if(response.success == false) {
                    console.error(response.message);
                }
                else {
                    console.error('Erro inesperado.');
                }
            }
            catch(error) {
                if(error?.response?.data?.message == 'Unauthenticated.') {
                    console.error('Requisição não autenticada.');
                }
                else {
                    toast.error('Houve algum erro.');
                }

                console.error('DETALHES DO ERRO:', error);
            }

            setLoading(false);
        } 
        getAllUsers();
    }, [tokenCookie]);
    



    // function handleClickNopeOrLike(action) {
    //     setLoadingSubmit(true);
    //     // if(animateMode == '') {
    //     setAnimateMode(action == 'like' ? 'animate__fadeOutBottomRight' : 'animate__fadeOutBottomLeft');
    //     // }
        
    //     if(step < totalPersons) {
    //         // limpa a animação depos de 600ms
    //         setTimeout(()=> {
    //             setAnimateMode('');
    //             setStep(step + 1);
    //             setLoadingSubmit(false);
    //         }, 600);   
    //     }
    // }

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
            
            <NavBar showBtnBack={false} />

            <main className='PageContent HomeContent grid animate__animated animate__fadeIn'>

                {loading ? (
                    <div className="feedback_content">
                        <span className="loader_home"></span>
                        <p>Encontrando pessoas para você...</p>
                    </div>
                ) : (
                    error ? (

                    <div className="feedback_content">
                        <h2>Ops, algo deu errado!</h2>
                        <p>Tente novamente recarregando a página.</p>

                        <a href="/home" className="btn primary">Recarregar</a>
                    </div>

                    ) : (

                    <div className="container_persons">

                        <div className="limit_card">
                            {/* //=// talvez nem use o fixed */}
                            <article className="card_person fixed hidden">
                                <div className="photo">
                                    <img src={imgEmpty} alt="" />
                                </div>
                            </article>

                            <article className="card_person">
                                <div className="photo">
                                    <img src={imgEmpty} className='hidden' alt="" />
                                    <img src="https://euphoriatest.bizsys.com.br/v1/images/thumbnails/thumb_6-2025-02-14_16-02-03-67af932b6e6fa.jpg" className='preview'
                                    alt="" />
                                </div>
                                {/* <div className="details">
                                    <p><span className="name_profile">{item.name}</span>, {item.age}</p>
                                    <p className="txt_link">mais...</p>
                                </div> */}
                            </article>
                        </div>

                        

                    </div>

                    )                    
                )}


                {/* <ActionsBottom /> */}

            </main>

        </div>
    );
}