// Hooks / Libs:
// import Cookies from "js-cookie";
import { useContext, useState, useEffect } from "react";
import { useImagesPreloader } from "../../hooks/useImagesPreloader";

// Config JSON:
import imagesServer from '../../../public/configApi.json';

// API:

// Contexts:
import UserContext from "../../contexts/userContext";

// Components:
import { NavBar } from "../../components/NavBar/NavBar";
import { ModalPhoto } from "../../components/Modals/ModalPhoto/ModalPhoto";
import { LoaderFeedback } from "../../components/LoadingScreen/LoaderFeedback/LoaderFeedback";

// Utils

// Assets:
// import imgEmpty from '../../assets/photo-empty.jpg';

// Estilo:
// import './style.css';



export default function Photos() {
    const { profileDetails } = useContext(UserContext);
    const srcImgsToLoad  = profileDetails.photos.map((item)=> `${imagesServer.images_url}${item.thumb_photo}`);
    const { imagesPreloaded, hasError } = useImagesPreloader(srcImgsToLoad);
    // Status do componente:
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    // const [refreshComponent, setRefreshComponent] = useState(false); //(vai precisar do GET my-profile???)

    // Modal
    const [showModal, setShowModal] = useState(false);

    // Logica da UI (pré-carregamento de dados):
    const [imgEmpty, setImgEmpty] = useState('/photo-empty.webp');
    const [urlsPhotos, setUrlsPhotos] = useState([]);
    const [inputSelect, setInputSelect] = useState(null);
    

    // const tokenCookie = Cookies.get('token_jc');
    // const navigate = useNavigate();



    useEffect(()=> {
        async function initializeComponent() {
            console.log('Effect /Photos');
            setLoading(true);
            setError(false);


            if(!imgEmpty) {    
                const preloadImageDefault = ()=> {
                    const img = new Image();
                    img.src = '/photo-empty.webp';
                    
                    img.onload = ()=> {
                        setImgEmpty(img.src);
                    };
                    img.onerror = ()=> {
                        setError(true);
                        console.error('Erro ao carregar imagem default');
                    };
                }
                preloadImageDefault();
            }


            // console.log('Carregou: ', imagesPreloaded);
            // console.log('Deu erro: ', hasError);

            if(imagesPreloaded && profileDetails.photos.length > 0) {
                setUrlsPhotos(profileDetails.photos);
                setLoading(false);       
            }

            if(hasError) {
                setError(true);
                setLoading(false);
            }
        } 
        initializeComponent();
    }, [imgEmpty, imagesPreloaded, hasError, profileDetails]);






    function handleOpenModal(inputSelect) {
        
        if(inputSelect.id || urlsPhotos.length > inputSelect.index-1) {
            console.log(inputSelect);
            setInputSelect(inputSelect);
            setShowModal(true);
        }

        // if(inputSelect.index == 0 || filesPhotos.length > inputSelect.index-1) {
        //     setInputSelect(inputSelect);
        //     setShowModal(true);
        //     return;
        // }
    }


  
    return (
        <div className="Page Forms Profile">
            <NavBar pathBack="/settings" />
            
            <main className='PageContent FormsContent ProfileContent grid'>
                <div className="title_page">
                    <h1>
                        <span>Organizar Fotos</span>
                    </h1>
                </div>

                <div className="content_main">
                    {loading ? (

                    <LoaderFeedback heightStretch={true} />

                    ) : (
                        error ? (

                        <div className="feedback_content">
                            <h2>Ops, algo deu errado!</h2>
                            <p>Tente novamente recarregando a página.</p>
        
                            <a href="/photos" className="btn primary">Recarregar</a>
                        </div>

                        ) : (

                        <div className="form">

                            <div className="photo">
                                <p>Esta é sua foto principal:</p>

                                <div 
                                className="input_photo" 
                                onClick={()=> handleOpenModal({...urlsPhotos[0], index: 0})}
                                >
                                    <img src={imgEmpty} className={urlsPhotos[0] ? 'hidden' : ''} alt="" />

                                    {urlsPhotos[0] && (
                                    <img 
                                    src={`${imagesServer.images_url}${urlsPhotos[0].thumb_photo}`}
                                    className="preview animate__animated animate__fadeIn" alt="" />
                                    )}

                                    <i className="bi bi-plus-circle-fill"></i>
                                </div>
                            </div>


                            <div className="photo optionals">
                                <p>Adicione até mais <span>3 fotos</span> para sua galeria:</p>

                                <div className="inputs_container">
                                    <div 
                                    className="input_photo" 
                                    onClick={()=> handleOpenModal({...urlsPhotos[1], index: 1})}
                                    disabled={urlsPhotos.length < 1}
                                    >
                                        <img src={imgEmpty} className={urlsPhotos[1] ? 'hidden' : ''} alt="" />

                                        {urlsPhotos[1] && (
                                        <img 
                                        src={`${imagesServer.images_url}${urlsPhotos[1].thumb_photo}`}
                                        className="preview animate__animated animate__fadeIn" alt="" />
                                        )}

                                        <i className="bi bi-plus-circle-fill"></i>
                                    </div>

                                    <div 
                                    className="input_photo" 
                                    onClick={()=> handleOpenModal({...urlsPhotos[2], index: 2})}
                                    disabled={urlsPhotos.length < 2}
                                    >
                                        <img src={imgEmpty} className={urlsPhotos[2] ? 'hidden' : ''} alt="" />

                                        {urlsPhotos[2] && (
                                        <img 
                                        src={`${imagesServer.images_url}${urlsPhotos[2].thumb_photo}`}
                                        className="preview animate__animated animate__fadeIn" alt="" />
                                        )}

                                        <i className="bi bi-plus-circle-fill"></i>
                                    </div>

                                    <div 
                                    className="input_photo" 
                                    onClick={()=> handleOpenModal({...urlsPhotos[3], index: 3})}
                                    disabled={urlsPhotos.length < 3}
                                    >
                                        <img src={imgEmpty} className={urlsPhotos[3] ? 'hidden' : ''} alt="" />

                                        {urlsPhotos[3] && (
                                        <img 
                                        src={`${imagesServer.images_url}${urlsPhotos[3].thumb_photo}`}
                                        className="preview animate__animated animate__fadeIn" alt="" />
                                        )}

                                        <i className="bi bi-plus-circle-fill"></i>
                                    </div>
                                </div>
                            </div>

                        </div>

                        )
                    )}
                </div>
            </main>


            {showModal && (
                <ModalPhoto 
                close={()=> setShowModal(false)}
                inputSelect={inputSelect}
                />
            )}
        </div>
    );
}