// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useState } from 'react';
// import Cookies from "js-cookie";

// Config JSON:
import imagesServer from '../../../public/configApi.json'

// Components:

// Utils:

// Assets:
import imgEmpty from '../../assets/photo-empty.jpg';

// Estilo:
import './infouser.css';



InfoUser.propTypes = {
    userSelect: PropTypes.object
}
export function InfoUser({ userSelect }) {
    console.log(userSelect)
    const [userData, setUserData] = useState(userSelect || {});

    // Logica da UI:
    const [startInteration, setStartInteration] = useState(false);
    const [step, setStep] = useState(0);
    const [animateMode, setAnimateMode] = useState('');
   
    return (
        <div className="InfoUser">
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
                    <div className={`photo ${animateMode}`}>
                        <img src={`${imagesServer.images_url}${userData.photos[step]?.thumb_photo}`} alt="" />
                    </div>
                    )}
        

                    {/* Controls */}
                    <div className="controls">
                        <div className='back'>
                            {/* {step > 0 && ( */}
                                <button>
                                    <i className="bi bi-chevron-compact-left"></i>
                                </button>
                            {/* )} */}
                        </div>

                        <div className='next'>
                            {step < userData.photos.length && (
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