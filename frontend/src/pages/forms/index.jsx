// Funcionalidades / Libs:
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

// API:
import { GENDER_GET_ALL, GENDER_OPTIONAL_GET_ALL } from "../../API/genderApi";
import { SEXUALITY_GET_ALL } from "../../API/sexualityApi";
import { FORMS_CREATE_PROFILE, FORMS_CREATE_PREFERENCES, FORMS_CREATE_PHOTOS } from "../../API/formsApi";
import { HABIT_GET_ALL } from "../../API/habitsApi";

// Contexts:
// import UserContext from "../../contexts/userContext";

// Components:
import { toast } from "react-toastify";
import { ModalPhoto } from "../../components/Modals/ModalPhoto/ModalPhoto";

// Utils
// import { primeiraPalavra } from "../../utils/formatStrings";

// Assets:
import imgEmpty from '../../assets/photo-empty.jpg';

// Estilo:
import './style.css';



export default function Forms() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    //Modal
    const [showModal, setShowModal] = useState(false);
    const [inputSelect, setInputSelect] = useState(null);

    // Dados pré-carregados:
    const [genders, setGenders] = useState([]);
    const [gendersOptionals, setGendersOptionals] = useState([]);
    const [sexualities, setSexualities] = useState([]);
    const [habits, setHabits] = useState([]);

    // Logica da UI:
    //const totalSteps = 3;
    const [step, setStep] = useState(3);
    // const [animateMode, setAnimateMode] = useState('');
    const [showOptinalGender, setShowOptinalGender] = useState(false);
    const [showSexualities, setShowSexualities] = useState(false);
    //step 2
    const [qtdPreview, setQtdPreview] = useState(30);
    const [habitsPreview, setHabitsPreview] = useState([]);

    
    // Dados a submeter
    // step 1
    const [genderSelect, setGenderSelect] = useState(null);
    const [genderOptionalSelect, setGenderOptionalSelect] = useState(null);
    const [sexualitySelect, setSexualitySelect] = useState(null);
    const [aboutMe, setAboutMe] = useState('');
    // step 2
    const [gendersIdsPreference, setGendersIdsPreference] = useState([]);
    const [habitsIdsPreferences, setHabitsIdsPreferences] = useState([]);
    // step 3
    const [filesPhotos, setFilesPhotos] = useState([]);
    const [urlsPhotos, setUrlsPhotos] = useState([]);


    const navigate = useNavigate();
    const tokenCookie = Cookies.get('token_jc');
    // console.log(tokenCookie)



    //=// refatorar esses effects para virar useCallback e try em dupla com genders + gendersOptional
    useEffect(()=> {
        async function getAllGenders() {
            console.log('Effect /Forms');
            setLoading(true);
            
            try {
                setError(true);
                // const response = await CATEGORY_GET_ALL(JSON.parse(tokenCookie), 'active=true');
                const response = await GENDER_GET_ALL(JSON.parse(tokenCookie));
                console.log(response);

                if(response.success) {
                    setGenders(response.data);
                    setError(false);
                }
                else if(response.success == false) {
                    toast.error(response.message);
                }
                else {
                    toast.error('Erro inesperado.');
                }
            }
            catch(error) {
                if(error?.response?.data?.message == 'Unauthenticated.') {
                    console.error('Requisição não autenticada.');
                }
                else {
                    toast.error('Houve algum erro.');
                }

                console.error('DETALHES ERRO:', error);
            }

            setLoading(false);
        } 
        getAllGenders();
    }, [tokenCookie]);


    useEffect(()=> {
        async function getAllGendersOptionals() {
            setLoading(true);
            
            try {
                setError(true);
                const response = await GENDER_OPTIONAL_GET_ALL(JSON.parse(tokenCookie));
                console.log(response);

                if(response.success) {
                    setGendersOptionals(response.data);
                    setError(false);
                }
                else if(response.success == false) {
                    toast.error(response.message);
                }
                else {
                    toast.error('Erro inesperado.');
                }
            }
            catch(error) {
                if(error?.response?.data?.message == 'Unauthenticated.') {
                    console.error('Requisição não autenticada.');
                }
                else {
                    toast.error('Houve algum erro.');
                }

                console.error('DETALHES ERRO:', error);
            }

            setLoading(false);
        } 
        getAllGendersOptionals();
    }, [tokenCookie]);

    
    useEffect(()=> {
        async function getAllSexualities() {
            setLoading(true);
            
            try {
                setError(true);
                const response = await SEXUALITY_GET_ALL(JSON.parse(tokenCookie));
                console.log(response);

                if(response.success) {
                    setSexualities(response.data);
                    setError(false);
                }
                else if(response.success == false) {
                    toast.error(response.message);
                }
                else {
                    toast.error('Erro inesperado.');
                }
            }
            catch(error) {
                if(error?.response?.data?.message == 'Unauthenticated.') {
                    console.error('Requisição não autenticada.');
                }
                else {
                    toast.error('Houve algum erro.');
                }

                console.error('DETALHES ERRO:', error);
            }

            setLoading(false);
        } 
        getAllSexualities();
    }, [tokenCookie]);


    useEffect(()=> {
        async function getAllHabits() {
            if(genders.length > 0 && step == 2 && habits.length == 0) {
                console.log('PEGA HABITOSSSS');
                setLoading(true);
            
                try {
                    setError(true);
                    const response = await HABIT_GET_ALL(JSON.parse(tokenCookie));
                    console.log(response);
        
                    if(response.success) {
                        setHabits(response.data);
                        setError(false);
                    }
                    else if(response.success == false) {
                        toast.error(response.message);
                    }
                    else {
                        toast.error('Erro inesperado.');
                    }
                }
                catch(error) {
                    if(error?.response?.data?.message == 'Unauthenticated.') {
                        console.error('Requisição não autenticada.');
                    }
                    else {
                        toast.error('Houve algum erro.');
                    }
        
                    console.error('DETALHES ERRO:', error);
                }
        
                setLoading(false);

            }
        } 
        getAllHabits();
    }, [genders, habits, step, tokenCookie]);
      


    // Step 3
    function handleOpenModal(inputSelect) {
        // console.log(filesPhotos);
        if(inputSelect.index == 0 || filesPhotos.length > inputSelect.index-1) {
            setInputSelect(inputSelect);
            setShowModal(true);
            return;
        }
    }

    // Step 2
    function handleChangeGenderPreference(selectGender) {
        const newGenderPreferences = gendersIdsPreference.includes(selectGender.id) 
            ? gendersIdsPreference.filter(item=> item !== selectGender.id) //Remove o item se já está marcado
            : [...gendersIdsPreference, selectGender.id]; //Adiciona o valor se não está marcado


        console.log('NEW genders:', newGenderPreferences);
        setGendersIdsPreference(newGenderPreferences);
    }

    function handleChangeHabitPreference(selectHabit) {
        // console.log(selectHabit);

        if(habitsIdsPreferences.includes(selectHabit.id)) {
            setHabitsIdsPreferences(habitsIdsPreferences.filter(item=> item != selectHabit.id));
            setHabitsPreview(habitsPreview.filter(item=> item.id != selectHabit.id));
        }
        else {
            if(habitsIdsPreferences.length >= 10) {
                toast.info('Selecione no máximo 10 interesses!');
                return;
            }
            
            setHabitsIdsPreferences(prev=> [...prev, selectHabit.id])
            setHabitsPreview(prev=> [...prev, selectHabit]);
        }
    
        // const newHabitsPreferences = habitsIdsPreferences.includes(selectHabit.id) 
        //     ? habitsIdsPreferences.filter(item=> item !== selectHabit.id) //Remove o item se já está marcado
        //     : [...habitsIdsPreferences, selectHabit.id]; //Adiciona o valor se não está marcado

        // console.log('NEW habits:', newHabitsPreferences);
        // setHabitsIdsPreferences(newHabitsPreferences)
    }

    // Step 1
    function handleChangeGender(selectGender) {
        setGenderSelect(selectGender); 
        setGenderOptionalSelect(null);
        setShowOptinalGender(true);
    }
    function handleClickGenderOptional(selectGenderOpt) {
        setGenderOptionalSelect(selectGenderOpt); 
    }

    function handleClickSelectSexuality(selectItem) {
        // console.log(selectItem);
        setSexualitySelect(selectItem);
    }

    
    // SUBMIT API (step 1)
    async function handleSubmitProfile(e) {
        e.preventDefault();
        setLoadingSubmit(true);
        setError(null);
        console.log(genderSelect?.id);
        console.log(genderOptionalSelect?.id);
        console.log(sexualitySelect?.id);
        console.log(aboutMe);        
        
        // VALIDAÇÕES
        
        
        // SUBMIT
        try {
            const response = await FORMS_CREATE_PROFILE(JSON.parse(tokenCookie), genderSelect?.id, genderOptionalSelect?.id, sexualitySelect?.id, aboutMe);
            console.log(response);

            if(response.success) {
                //toast.success('FORM 1 OK!');
                setStep(step + 1);
                // getAllHabits();
            }
            else if(response.success == false) {
                toast.error(response.message);
                
                // if(response.message == "Não é possível particpar do app sendo menor de idade.") {
                //     setError(prev => ({...prev, dateBirth: true}));
                // }
                // if(response.message == "Já existe um registro com esse número, por favor verifique.") {
                //     setError(prev => ({...prev, phone: true})); //=// Campo número celular deve conter no mínimo 11 digitos. > fazer nas validações
                // }
            }
            else {
                toast.error('Erro inesperado.');
            }
        }
        catch(error) {
            if(error?.response?.data?.message == 'Unauthenticated.') {
                console.error('Requisição não autenticada.');
            }
            else {
                toast.error('Houve algum erro.');
            }

            console.error('DETALHES ERRO:', error);
        }


        setLoadingSubmit(false);
    }

    // SUBMIT API (step 2)
    async function handleSubmitPreferences(e) {
        e.preventDefault();
        setLoadingSubmit(true);
        setError(null);
        console.log(gendersIdsPreference);
        console.log(habitsIdsPreferences);       
        
        // VALIDAÇÕES
        
        
        // SUBMIT
        try {
            const response = await FORMS_CREATE_PREFERENCES(JSON.parse(tokenCookie), gendersIdsPreference, habitsIdsPreferences);
            console.log(response);

            if(response.success) {
                //toast.success('FORM 1 OK!');
                setStep(step + 1);
                // getAllHabits();
            }
            else if(response.success == false) {
                toast.error(response.message);
            }
            else {
                toast.error('Erro inesperado.');
            }
        }
        catch(error) {
            if(error?.response?.data?.message == 'Unauthenticated.') {
                console.error('Requisição não autenticada.');
            }
            else {
                toast.error('Houve algum erro.');
            }

            console.error('DETALHES ERRO:', error);
        }


        setLoadingSubmit(false);
    }

    // SUBMIT API (step 3)
    async function handleSubmitUploadPhotos(e) {
        e.preventDefault();
        setLoadingSubmit(true);
        setError(null);
        ////console.log(filesPhotos);       
        
        // VALIDAÇÕES
        if(filesPhotos.length <= 0) {
            toast.warn('Envie ao menos uma foto para prosseguir.');
            setLoadingSubmit(false);
            return;
        }
        
        
        // SUBMIT
        try {
            const response = await FORMS_CREATE_PHOTOS(JSON.parse(tokenCookie), filesPhotos);
            console.log(response);

            if(response.success) {
                toast.success('FORM COMPLETO');

                setTimeout(()=> navigate('/home'), 700);
            }
            else if(response.success == false) {
                toast.error(response.message);
            }
            else {
                toast.error('Erro inesperado.');
            }
        }
        catch(error) {
            if(error?.response?.data?.message == 'Unauthenticated.') {
                console.error('Requisição não autenticada.');
            }
            else {
                toast.error('Houve algum erro.');
            }

            console.error('DETALHES ERRO:', error);
        }


        setLoadingSubmit(false);
    }
    

    
  
    return (
        <div className="Page Forms">

            {/* < back??? */}
            {/* //=// <Progress Bar /> */}

            <main className='PageContent FormsContent grid'>
                <div className="title_page">
                    {step == 1 ? (
                    <h1>Agora, o que seu Perfil diz sobre você?</h1>
                    ) : (
                    step == 2 ? (
                    <h1>Suas preferências são...</h1>
                    ) : (
                    <h1>Muito bem, agora escolha suas melhores Fotos:</h1>
                    )
                    )}
                </div>

                <div className="content_main">
                    {loading ? (

                    <div>CARREGANDO PAGE...</div>

                    ) : (
                    error ? (

                    <div>!ERRO PAGE!</div>

                    ) : (
                    
                    step == 1 ? (
                    <form className="form" onSubmit={handleSubmitProfile} autoComplete="off">
                        <div className="label--input" 
                        // onBlur={()=> {setShowOptinalGender(false); console.warn('FORA');}}
                        >
                            <label>Qual o seu gênero?</label>
                            
                            <div className="btns_radio_container">
                                {genders.map((gender) => (
                                <label className="btn_radio" key={gender.id} title={gender.id}>
                                    <input
                                    type="radio"
                                    name="gender"
                                    onChange={()=> handleChangeGender(gender)}
                                    checked={gender.id == genderSelect?.id}
                                    required
                                    />
                                    {gender.name}
                                </label>
                                ))}                                
                            </div>

                            {genderSelect && (
                            <div className="gender_optional">
                                <p className="top_select" onClick={()=> setShowOptinalGender(prev => !prev)}>
                                    <span>Selecione mais informações sobre seu gênero (opcional)</span>
                                    <i className="bi bi-chevron-down"></i> 
                                </p> 

                                <ul className={`list_gender_optional ${showOptinalGender ? '' : 'hide'}`}>
                                    {gendersOptionals
                                    .filter(genderOpt => genderOpt.gender_main == genderSelect.name)
                                    .map(genderOpt=> (
                                    <li 
                                    key={genderOpt.id} 
                                    className={`item ${genderOpt.id == genderOptionalSelect?.id ? 'checked' : ''}`} 
                                    onClick={()=> handleClickGenderOptional(genderOpt)}>
                                        <p><b>{genderOpt.name}</b></p>
                                        
                                        <small>{genderOpt.description}</small>
                                    </li>
                                    ))}
                                </ul>
                            </div>
                            )}
                        </div>

                        <div className="label--input">
                            <label>Qual sua orientação sexual?</label>

                            <div className="select">
                                <p className="top_select" onClick={()=> setShowSexualities(prev => !prev)}>
                                    <b>{sexualitySelect?.name || 'Selecione...'}</b>
                                    <i className="bi bi-chevron-down"></i> 
                                </p> 

                                <ul className={`list_select ${showSexualities ? 'show' : ''}`}>
                                    {sexualities.map(item => (
                                    <li 
                                    key={item.id}
                                    title={item.id}
                                    className={`item_select ${item.id == sexualitySelect?.id ? 'checked' : ''}`} 
                                    onClick={()=> handleClickSelectSexuality(item)}
                                    >
                                        <p><b>{item.name}</b></p>
                                        
                                        <small>{item.description}</small>
                                    </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="label--input">
                            <label htmlFor="about">Resumo (opcional)</label>
                            <textarea 
                            id="about" 
                            className="input" 
                            placeholder="Sobre mim..."
                            value={aboutMe} 
                            onChange={(e)=> setAboutMe(e.target.value)}
                            ></textarea>
                        </div>


                        {genderSelect && sexualitySelect && (
                        <div className="btns_container animate__animated animate__fadeInUp">
                            <button className="btn primary" disabled={loadingSubmit}>Confirmar</button>
                        </div>
                        )}
                    </form>
                    ) : (

                    step == 2 ? (
                    <form className="form" onSubmit={handleSubmitPreferences} autoComplete="off">
                        <div className="label--input">
                            <label>O que você quer ver?</label>
                            
                            <div className="btns_radio_container">
                                {genders.map((gender) => (
                                <label className="btn_radio" key={gender.id} title={gender.id}>
                                    <input
                                    type="checkbox"
                                    name="gender"
                                    onChange={()=> handleChangeGenderPreference(gender)}
                                    checked={gendersIdsPreference.includes(gender.id)}
                                    />
                                    {gender.name}
                                </label>
                                ))}                                
                            </div>
                        </div>

                        <div className="label--input">
                            <label>Qual seu tipo de bloquinho? (Interesses)</label>
                            
                            <div className="btns_radio_container habits">
                                {habits
                                .filter((item, idx)=> idx < qtdPreview)
                                .map(item => (
                                <label className="btn_radio" key={item.id} title={item.id}>
                                    <input
                                    type="checkbox"
                                    name="habits"
                                    onChange={()=> handleChangeHabitPreference(item)}
                                    checked={habitsIdsPreferences.includes(item.id)}
                                    />
                                    {item.name}
                                </label>
                                ))}                                
                            </div>

                            {qtdPreview != habits.length && (
                            <button className="show_more" onClick={()=> setQtdPreview(habits.length)}>
                                Mostrar todos
                            </button>
                            )}
                        </div>


                        {gendersIdsPreference?.length > 0 && (
                        <div className="btns_container animate__animated animate__fadeInUp">
                            <button className="btn primary" disabled={loadingSubmit}>Confirmar</button>
                        </div>
                        )}
                    </form>
                    ) : (
                    <form className="form" onSubmit={handleSubmitUploadPhotos} autoComplete="off">

                        <div className="photo">
                            <p>Esta será sua foto principal:</p>

                            <div 
                            className="input_photo" 
                            onClick={()=> handleOpenModal({index: 0})}
                            >
                                <img src={imgEmpty} className={urlsPhotos[0] ? 'hidden' : ''} alt="" />

                                {urlsPhotos[0] && (
                                <img src={urlsPhotos[0]} className="preview animate__animated animate__fadeIn" alt="" />
                                )}

                                <i className="bi bi-plus-circle-fill"></i>
                            </div>
                        </div>



                        <div className="photo optionals">
                            <p>Adicione até mais <span>3 fotos</span> para sua galeria:</p>

                            <div className="inputs_container">
                                <div 
                                className="input_photo" 
                                onClick={()=> handleOpenModal({index: 1})}
                                disabled={filesPhotos.length < 1}
                                >
                                    <img src={imgEmpty} className={urlsPhotos[1] ? 'hidden' : ''} alt="" />

                                    {urlsPhotos[1] && (
                                    <img 
                                    src={urlsPhotos[1]} 
                                    className="preview animate__animated animate__fadeIn" alt="" />
                                    )}

                                    <i className="bi bi-plus-circle-fill"></i>
                                </div>

                                <div 
                                className="input_photo" 
                                onClick={()=> handleOpenModal({index: 2})}
                                disabled={filesPhotos.length < 2}
                                >
                                    <img src={imgEmpty} className={urlsPhotos[2] ? 'hidden' : ''} alt="" />

                                    {urlsPhotos[2] && (
                                    <img 
                                    src={urlsPhotos[2]} 
                                    className="preview animate__animated animate__fadeIn" alt="" />
                                    )}

                                    <i className="bi bi-plus-circle-fill"></i>
                                </div>

                                <div 
                                className="input_photo" 
                                onClick={()=> handleOpenModal({index: 3})}
                                disabled={filesPhotos.length < 3}
                                >
                                    <img src={imgEmpty} className={urlsPhotos[3] ? 'hidden' : ''} alt="" />

                                    {urlsPhotos[3] && (
                                    <img 
                                    src={urlsPhotos[3]} 
                                    className="preview animate__animated animate__fadeIn" alt="" />
                                    )}

                                    <i className="bi bi-plus-circle-fill"></i>
                                </div>
                            </div>
                        </div>



                        {filesPhotos.length > 0 && (
                        <div className="btns_container animate__animated animate__fadeInUp">
                            <button className="btn primary" disabled={loadingSubmit}>Finalizar</button>
                        </div>
                        )}             
                    </form>
                    )

                    )                    

                    ))}
                    
                </div>
            </main>



            {showModal && (
                <ModalPhoto 
                close={()=> setShowModal(false)}
                filesPhotos={filesPhotos}
                setFilesPhotos={setFilesPhotos}
                urlsPhotos={urlsPhotos}
                setUrlsPhotos={setUrlsPhotos}
                inputSelect={inputSelect}
                />
            )}

        </div>
    );
}