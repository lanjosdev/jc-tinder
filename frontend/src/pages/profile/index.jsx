// Funcionalidades / Libs:
import Cookies from "js-cookie";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";

// API:
import { GENDER_GET_ALL, GENDER_OPTIONAL_GET_ALL } from "../../API/genderApi";
import { SEXUALITY_GET_ALL } from "../../API/sexualityApi";
import { FORMS_UPDATE_PROFILE } from "../../API/formsApi";

// Contexts:
import UserContext from "../../contexts/userContext";

// Components:
import { toast } from "react-toastify";
import { NavBar } from "../../components/NavBar/NavBar";

// Utils

// Assets:
// import imgLogo from '../../assets/LOGO-BIZSYS_preto.png';

// Estilo:
// import './style.css';



export default function Profile() {
    const {
        setRefreshContext,
        profileDetails
    } = useContext(UserContext);
    // Estados do componente:
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    // Modal
    // const [showModal, setShowModal] = useState(false);

    // Dados pré-carregados:
    const [genders, setGenders] = useState([]);
    const [gendersOptionals, setGendersOptionals] = useState([]);
    const [sexualities, setSexualities] = useState([]);

    // Logica da UI:
    const [showOptinalGender, setShowOptinalGender] = useState(false);
    const [showSexualities, setShowSexualities] = useState(false);


    // Dados a submiter
    const [name, setName] = useState(profileDetails.name || '');
    const [dateBirth, setDateBirth] = useState(profileDetails.birth_data || '');
    const [phone, setPhone] = useState(profileDetails.phone || '');
    const [genderSelect, setGenderSelect] = useState({
        id: profileDetails.gender_id,
        name: profileDetails.gender
    });
    const [genderOptionalSelect, setGenderOptionalSelect] = useState(profileDetails.id ? 
        {
            id: profileDetails.sub_gender_id,
            name: profileDetails.sub_gender,
            gender_main: profileDetails.gender_main
        }
        : null
    );

    const [sexualitySelect, setSexualitySelect] = useState({
        id: profileDetails.sexuality_id,
        name: profileDetails.sexuality
    });

    const [aboutMe, setAboutMe] = useState(profileDetails.about_me || '');
    

    const tokenCookie = Cookies.get('token_jc');
    const navigate = useNavigate();




    //=// refatorar esses effects para virar useCallback e try em dupla com genders + gendersOptional (acho q um promises all)
    useEffect(()=> {
        async function getAllGenders() {
            console.log('Effect /Profile');
            setLoading(true);
            
            try {
                setError(true);
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
    }, [tokenCookie, profileDetails]);


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
    }, [tokenCookie, profileDetails]);

    
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
    }, [tokenCookie, profileDetails]);





    function handleChangeGender(selectGender) {
        setGenderSelect(selectGender); 
        if(selectGender.id == profileDetails.gender_id && profileDetails.sub_gender) {
            setGenderOptionalSelect({
                id: profileDetails.sub_gender_id,
                name: profileDetails.sub_gender,
                gender_main: profileDetails.gender_main
            });
        }
        else {
            setGenderOptionalSelect(null);
        }
        setShowOptinalGender(true);
    }
    function handleClickGenderOptional(selectGenderOpt) {
        setGenderOptionalSelect(selectGenderOpt); 
    }

    function handleClickSelectSexuality(selectItem) {
        setSexualitySelect(selectItem);
    }



    // SUBMIT API (UPDATE)
    async function handleSubmitProfileUpdate(e) {
        e.preventDefault();
        setLoadingSubmit(true);
        setError(null);
        console.log(name);
        console.log(dateBirth);
        console.log(phone);
        console.log(genderSelect?.id);
        const idOptinalGender = genderOptionalSelect?.id || null;      
        console.log(idOptinalGender);
        console.log(sexualitySelect?.id);
        console.log(aboutMe); 
        
        // VALIDAÇÕES
        
        
        // SUBMIT
        try {
            // const response = await FORMS_CREATE_PROFILE(JSON.parse(tokenCookie), genderSelect?.id, genderOptionalSelect?.id, sexualitySelect?.id, aboutMe);
            const response = await FORMS_UPDATE_PROFILE(JSON.parse(tokenCookie), name, phone, dateBirth, genderSelect.id, idOptinalGender, sexualitySelect.id, aboutMe);
            console.log(response);

            if(response.success) {
                setRefreshContext(prev => !prev);
                toast.success('Alterações salvas!');

                navigate('/settings');
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
        <div className="Page Forms Profile">
            <NavBar />
            
            <main className='PageContent FormsContent ProfileContent grid'>
                <div className="title_page">
                    <h1>
                        <span>Editar Perfil</span>
                    </h1>
                </div>

                <div className="content_main">
                    {loading ? (

                    <div>CARREGANDO PAGE...</div>

                    ) : (
                    error ? (

                    <div>!ERRO AO CARREGAR A PÁGINA!</div>

                    ) : (
                    
                    <form className="form" onSubmit={handleSubmitProfileUpdate} autoComplete="off">
                        <div className="label--input">
                            <label htmlFor="name">Nome</label>

                            <input 
                            id="name" 
                            className="input" 
                            type="text" 
                            placeholder="Digite seu nome" 
                            value={name}
                            onChange={(e)=> setName(e.target.value)}
                            data-error={`${error?.name}`}
                            required 
                            />

                            {error?.name && (
                                <span className="txt-erro">{error?.name}</span>
                            )}
                        </div>

                        <div className="label--input">
                            <label htmlFor="nascimento">Data de nascimento</label>

                            <small className={error?.dateBirth ? 'txt-erro' : ''}>
                                É necessário ser maior de idade.
                            </small>

                            <input id="nascimento" className="input" 
                            type="date" 
                            value={dateBirth}
                            onChange={(e)=> setDateBirth(e.target.value)}
                            data-error={`${error?.dateBirth}`}
                            required 
                            />
                        </div>

                        <div className="label--input">
                            <label htmlFor="tel">Telefone</label>

                            <input id="tel"
                            className="input" 
                            type="tel" 
                            placeholder="WhatsApp (Ex: 11980556891)" 
                            minLength="11" maxLength="11"
                            value={phone}
                            onChange={(e)=> setPhone(e.target.value)}
                            data-error={`${error?.phone}`}
                            required 
                            />

                            {error?.phone && (
                                <span className="txt-erro">{error?.phone}</span>
                            )}
                        </div>

                        <div className="label--input" >
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


                        {/* {((name !== profileDetails.name || dateBirth !== profileDetails.birth_data || phone !== profileDetails.phone || genderSelect?.name !== profileDetails.gender || genderOptionalSelect?.name !== profileDetails.sub_gender || sexualitySelect?.name !== profileDetails.sexuality || aboutMe !== profileDetails.about_me) && (phone.length == 11 && name !== '' && aboutMe != '')) && ( */}
                        <div className="btns_container animate__animated animate__fadeInUp">
                            <button className="btn primary" disabled={loadingSubmit}>
                                Confirmar Alterações
                            </button>
                        </div>
                        {/* )} */}
                    </form>

                    ))}
                </div>
            </main>

        </div>
    );
}