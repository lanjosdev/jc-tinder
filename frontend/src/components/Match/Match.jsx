// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
// import Cookies from "js-cookie";

// Config JSON:
import imagesServer from '../../../public/configApi.json';

// Contexts:
import UserContext from "../../contexts/userContext";

// Components:


// Utils:


// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
import './match.css';


Match.propTypes = {
    arrayMatches: PropTypes.array,
    setArrayMatches: PropTypes.func
}
export function Match({ arrayMatches, setArrayMatches }) {
    const {
        profileDetails
    } = useContext(UserContext);

    const [animateMode, setAnimateMode] = useState('animate__bounceIn');

    // const tokenCookie = Cookies.get('tokenEstoque');
    const navigate = useNavigate();


    useEffect(()=> {
        console.log('Effect Component Match');
        
        // console.log(arrayMatches);
    }, [arrayMatches]);




    function openChat() {
        let phone = `55${arrayMatches[0].phone}`;
        let message = `Ol%C3%A1%20${arrayMatches[0].name}`;
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');        
    }
    function handleActionCallMessage() {
        openChat();

        //=> Fecha tela de match e direciona para page /matches:
        setTimeout(()=> {
            setArrayMatches([]);
            navigate('/matches');
        }, 700);
    }


    function handleActionNotCallMessage() {
        setAnimateMode('');

        let newArrayMatches = [...arrayMatches];
        newArrayMatches.shift();
        
        setTimeout(()=> {
            setArrayMatches(newArrayMatches)
            setAnimateMode('animate__bounceIn');
        }, 100);
    }


    return (
        <div className="Match animate__animated animate__fadeIn">

            <div className={`main animate__animated ${animateMode}`}>
                <div className="top">
                    <button onClick={handleActionNotCallMessage}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="content">
                    <div className="title">
                        <h1>
                            Deu Match!
                        </h1>
                    </div>

                    <div className="pair_photos">
                        <div className="photo">
                            <img
                            src={`${imagesServer.images_url}${profileDetails.photos[0]?.thumb_photo}`} alt="Foto do perfil"
                            />
                        </div>

                        <div className="photo your_match">
                            <img
                            src={`${imagesServer.images_url}${arrayMatches[0]?.photo.thumb_photo}`} alt="Foto do perfil"
                            />
                        </div>
                    </div>

                    <div className="sub_title">
                        <p>
                            Você e <span className="name_profile">{arrayMatches[0].name}</span> deram match!
                        </p>
                    </div>
                </div>

                <div className="actions">
                    <button className="btn message" onClick={handleActionCallMessage}>
                        <i className="bi bi-whatsapp"></i>
                        <span>Mandar mensagem</span>
                    </button>

                    <button className="btn" onClick={handleActionNotCallMessage}>
                        Conversar depois
                    </button>
                </div>
            </div>

        </div>
    )        
}