// Funcionalidades / Libs:
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
// import { Link } from "react-router";

// API:
import { GENDER_GET_ALL, GENDER_OPTIONAL_GET_ALL } from "../../API/genderApi";
import { SEXUALITY_GET_ALL } from "../../API/sexualityApi";
import { FORMS_CREATE_PROFILE } from "../../API/formsApi";

// Contexts:
// import UserContext from "../../contexts/userContext";

// Components:
import { toast } from "react-toastify";

// Utils
// import { primeiraPalavra } from "../../utils/formatStrings";

// Assets:
// import imgLogo from '../../assets/LOGO-BIZSYS_preto.png';

// Estilo:
import './style.css';



export default function Forms() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    // Dados pré-carregados:
    const [genders, setGenders] = useState([]);
    const [gendersOptionals, setGendersOptionals] = useState([]);
    const [sexualities, setSexualities] = useState([]);

    // Logica da UI:
    const [showOptinalGender, setShowOptinalGender] = useState(false);
    const [showSexualities, setShowSexualities] = useState(false);
    //const totalSteps = 3;
    //const [step, setStep] = useState(1);
    // const [animateMode, setAnimateMode] = useState('');
    
    // Dados a submeter
    const [genderSelect, setGenderSelect] = useState(null);
    const [genderOptionalSelect, setGenderOptionalSelect] = useState(null);
    const [sexualitySelect, setSexualitySelect] = useState(null);
    const [aboutMe, setAboutMe] = useState('');

    const tokenCookie = Cookies.get('token_jc');



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
    
    



    function handleChangeGender(selectGender) {
        setGenderSelect(selectGender); 
        setShowOptinalGender(true);
    }

    function handleClickSelectSexuality(selectItem) {
        // console.log(selectItem);
        setSexualitySelect(selectItem);
    }

    
    // SUBMIT API
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
                toast.success('FORM 1 OK!');
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
    

    
  
    return (
        <div className="Page Forms">

            {/* //=// <Progress Bar /> */}

            <main className='PageContent FormsContent grid'>
                <div className="title_page">
                    {/* < back??? */}
                    <h1>Agora, o que seu Perfil diz sobre você?</h1>
                </div>

                <div className="content_main">
                    {loading ? (

                    <div>CARREGANDO PAGE...</div>

                    ) : (
                    error ? (

                    <div>!ERRO PAGE!</div>

                    ) : (

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
                                    .map((genderOpt, idx)=> (
                                    <li className="item" key={idx}>
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

                    ))}
                    
                </div>
            </main>

        </div>
    );
}