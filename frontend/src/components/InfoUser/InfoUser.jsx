// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useState } from 'react';
// import Cookies from "js-cookie";

// Config JSON:
import imagesServer from '../../../public/configApi.json'

// Components:

// Utils:

// Assets:
import imgEmpty from '../../assets/photo-empty.webp';

// Estilo:
import './infouser.css';



InfoUser.propTypes = {
    userData: PropTypes.object
}
export function InfoUser({ userData }) {
    // console.log(userData)
    // const [userData, setUserData] = useState(userData || {});

    // Logica da UI:
    const [startInteration, setStartInteration] = useState(false);
    const [step, setStep] = useState(0);
    const [animateMode, setAnimateMode] = useState('');




    function handleClickBack() {
        if(step > 0) {
            setStep(step - 1);
            setAnimateMode('animate__fadeInLeft');
            
            // limpa a animação depos de 600ms
            setTimeout(()=> {
                setAnimateMode('');
            }, 400);   
        }
    }

    function handleClickNext() {
        if(!startInteration) {
            setStartInteration(true);
            console.log('Inicio interação!');
        }

        if(step < userData.photos.length-1) {
            setAnimateMode('animate__fadeOutLeft');
            
            // limpa a animação depos de 600ms
            setTimeout(()=> {
                setStep(step + 1);
                setAnimateMode('');
            }, 300);   
        }
    }


   
    return (
        <div className="InfoUser animate__animated animate__zoomIn">
            <div className="title">
                <h1>
                    <span className="name_profile">{userData?.name}, </span>
                    <span className="age">{userData?.age}</span>
                </h1>
            </div>

            <div className="main">
                <div className="slider_photos">
                    <div className="photo fixed">
                        <img src={imgEmpty} className="hidden" alt="" />
                    </div>
                    
                    {/* Foto seguinte */}
                    {userData.photos[step+1] && (
                    <div className={`photo ${!startInteration ? 'hidden' : ''}`}>
                        <img src={`${imagesServer.images_url}${userData.photos[step+1]?.thumb_photo}`} alt="" />
                    </div>
                    )}
                    
                    {/* Foto a mostra */}
                    {step < userData.photos.length && (
                    <div className={`photo animate__animated ${animateMode}`}>
                        <img src={`${imagesServer.images_url}${userData.photos[step]?.thumb_photo}`} alt="" />
                    </div>
                    )}

    

                    {/* Paginate dots */}
                    <div className="paginate">
                        {userData.photos.map((item, idx)=> (
                        <div className={`dot ${step == idx ? 'active' : ''}`} key={idx}></div>
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="controls">
                        <div className='back' onClick={handleClickBack}>
                            {step > 0 && (
                                <button>
                                    <i className="bi bi-chevron-compact-left"></i>
                                </button>
                            )}
                        </div>

                        <div className='next' onClick={handleClickNext}>
                            {step < userData.photos.length - 1 && (
                                <button>
                                    <i className="bi bi-chevron-compact-right"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="infos">
                    <div className="label--input">
                        <label>Gênero</label>
                        <p>{userData?.gender}</p>
                    </div>
                    <div className="label--input">
                        <label>Orientação sexual</label>
                        <p>{userData?.sexuality}</p>
                    </div>
                    <div className="label--input">
                        <label>Sobre mim</label>
                        <p>{userData?.about_me ?? 'Não informado.'}</p>
                    </div>
                    <div className="label--input">
                        <label>Meu tipo de bloquinho (interesses)</label>
                        {userData?.habits.length > 0 ? (
                            <ul className="habits">
                                {userData?.habits.map((item)=> (
                                <li key={item.id} className="btn_radio">{item.name}</li>   
                                ))}
                            </ul>
                        ) : (
                            <p>Não informado.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )        
}