// Funcionalidades / Libs:
import Cookies from "js-cookie";
import { useState, useEffect } from "react";

// API:
import { USER_GET_ALL } from "../../API/userApi";
import { MATCH_POST } from "../../API/matchApi";

// Contexts:
// import UserContext from "../../contexts/userContext";

// Config JSON:
import imagesServer from '../../../public/configApi.json'

// Components:
import { NavBar } from "../../components/NavBar/NavBar";
import { FeedbackPersons } from "../../components/FeedbackPersons/FeedbackPersons";
import { ActionsBottom } from "../../components/ActionsBottom/ActionsBottom";
import { InfoUser } from "../../components/InfoUser/InfoUser";
import { Match } from "../../components/Match/Match";

// Utils
// import { primeiraPalavra } from "../../utils/formatStrings";

// Assets:
import imgEmpty from '../../assets/photo-empty.jpg';

// Estilo:
import './style.css';




export default function Home() {
    // Status do componente:
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    
    // Dados pré-carregados:
    const [persons, setPersons] = useState([]);
    const [totalPersons, setTotalPersons] = useState(0);

    // Logica da UI:
    const [startInteration, setStartInteration] = useState(false);
    const [step, setStep] = useState(0);
    const [animateMode, setAnimateMode] = useState('');
    const [showInfoUser, setShowInfoUser] = useState(false);
    const [arrayMatches, setArrayMatches] = useState([]);
    const [refreshPage, setRefreshPage] = useState(false);

    
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
                    console.error('Houve algum erro.');
                }

                console.error('DETALHES DO ERRO:', error);
            }

            setLoading(false);
        } 
        getAllUsers();
    }, [tokenCookie, refreshPage]);
    




    async function submitPostLikeOrDeslike(idUser, status) {
        try {
            const response = await MATCH_POST(JSON.parse(tokenCookie), idUser, status);
            console.log(response);

            if(response.data.response_for_match) {
                // console.log('DEU MATCH');
                setArrayMatches(prev => [...prev, response.data.info_user_match]);
            }
        }
        catch(error) {
            if(error?.response?.data?.message == 'Unauthenticated.') {
                console.error('Requisição não autenticada.');
            }
            else {
                console.error('Houve algum erro.');
            }

            console.error('DETALHES DO ERRO:', error);
        }
    }

    function handleClickNopeOrLike(action) {
        setLoadingSubmit(true);
        setShowInfoUser(false);
        setAnimateMode(action == 'like' ? 'animate__fadeOutBottomRight' : 'animate__fadeOutBottomLeft');

        if(!startInteration) {
            setStartInteration(true);
            // console.log('Inicio interação!');
        }


        // Dados enviados p/ async func de post API:
        const idUser = persons[step].id;
        const status = action == 'like' ? 1 : 0;
        submitPostLikeOrDeslike(idUser, status);


        // Logica local UI:
        // setAnimateMode(action == 'like' ? 'animate__fadeOutBottomRight' : 'animate__fadeOutBottomLeft');
        
        if(step < totalPersons) {
            // limpa a animação depos de 500ms
            setTimeout(()=> {
                setAnimateMode('');
                setStep(step + 1);
                setLoadingSubmit(false);
            }, 500);   
        }
    }

    function handleClickToBack() {
        setLoadingSubmit(true);
        setShowInfoUser(false);
        setStep(step - 1);
        setAnimateMode('animate__animated animate__fadeInBack');
        
        
        // if(step < totalPersons) {
            // limpa a animação depos de 600ms
            setTimeout(()=> {
                setAnimateMode('');
                setLoadingSubmit(false);
            }, 400);   
        // }
    }



    function handleShowInfoUser() {
        setShowInfoUser(true);
    }

    function handleBackGetAllUsers() {
        setShowInfoUser(false);
    }

    function RefreshPage() {
        setStep(0);
        setStartInteration(false);
        setPersons([]);
        setRefreshPage(prev => !prev);
    }
  
    
    return (
        <div className="Page Home">
            
            <NavBar showBtnBack={showInfoUser} functionBack={handleBackGetAllUsers} />

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
                        {persons.length > 0 ? (
                            showInfoUser ? (

                            <InfoUser userData={persons[step]} />

                            ) : (
                            
                            step >= totalPersons ? (
                                <FeedbackPersons refreshPage={RefreshPage} />
                            ) : (
                                <div className="limit_card">
                                    {/* //=// talvez nem use o fixed */}
                                    <article className="card_person fixed hidden">
                                        <div className="photo">
                                            <img src={imgEmpty} alt="" />
                                        </div>
                                    </article>

                                    {/* Pessoa seguinte */}
                                    {persons[step+1] && (
                                    <article className={`card_person ${!startInteration ? 'hidden' : ''}`}>
                                        <div className="photo">
                                            <img src={imgEmpty} className='hidden' alt="" />
                                            <img 
                                            src={`${imagesServer.images_url}${persons[step+1]?.photos[0]?.thumb_photo}`} className='preview'
                                            alt="" 
                                            />
                                        </div>
                                        
                                        <div className="details">
                                            <p className="name_age">
                                                <span className="name_profile">{persons[step+1].name}</span>, {persons[step+1].age}
                                            </p>

                                            <p className="txt_link">mais...</p>
                                        </div>
                                    </article>
                                    )}
        
                                    {/* Pessoa a mostra */}
                                    {step < totalPersons && (
                                    <article 
                                    className={`card_person ${animateMode}`} 
                                    onClick={handleShowInfoUser}
                                    >
                                        <div className="photo">
                                            <img src={imgEmpty} className='hidden' alt="" />
                                            <img 
                                            src={`${imagesServer.images_url}${persons[step]?.photos[0]?.thumb_photo}`} className='preview'
                                            alt="" 
                                            />
                                        </div>
                                        
                                        <div className="details">
                                            <p className="name_age">
                                                <span className="name_profile">{persons[step].name}</span>, {persons[step].age}
                                            </p>
                                            <p className="txt_link">mais...</p>
                                        </div>
                                    </article>
                                    )}
                                </div>
                            )

                            )
                        ) : (

                        <FeedbackPersons refreshPage={RefreshPage} title="Nenhuma pessoa encontrada." />

                        )}
                    </div>

                    )                    
                )}


                <ActionsBottom 
                loading={loading} 
                loadingSubmit={loadingSubmit} 
                handleClickNopeOrLike={handleClickNopeOrLike} 
                handleClickToBack={handleClickToBack} 
                step={step}
                totalPersons={totalPersons}
                />

            </main>
            

            {/* Tela de Match */}
            {arrayMatches.length > 0 && (
            <Match 
            arrayMatches={arrayMatches} 
            setArrayMatches={setArrayMatches} 
            />
            )}
        </div>
    );
}