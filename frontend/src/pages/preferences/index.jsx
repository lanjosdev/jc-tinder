// Funcionalidades / Libs:
import Cookies from "js-cookie";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";

// API:
import { GENDER_GET_ALL } from "../../API/genderApi";
import { HABIT_GET_ALL } from "../../API/habitsApi";
import { FORMS_UPDATE_PREFERENCES } from "../../API/formsApi";

// Contexts:
import UserContext from "../../contexts/userContext";

// Components:
import { toast } from "react-toastify";
import { NavBar } from "../../components/NavBar/NavBar";
import { SliderRange } from "../../components/SliderRange/SliderRange";

// Utils
import { arraysHaveSameValues } from "../../utils/compareArrays";

// Assets:
// import imgLogo from '../../assets/LOGO-BIZSYS_preto.png';

// Estilo:
import './style.css';



export default function Preferences() {
    const { setRefreshContext, profileDetails } = useContext(UserContext);
    // Estados do componente:
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [validateSubmit, setValidateSubmit] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);


    // Dados pré-carregados:
    const [genders, setGenders] = useState([]);
    const [habits, setHabits] = useState([]);


    // Logica da UI:
    const [qtdPreview, setQtdPreview] = useState(30);
    const [habitsPreview, setHabitsPreview] = useState(profileDetails.habits);


    // Dados a submiter
    const [gendersIdsPreference, setGendersIdsPreference] = useState(profileDetails.preferences.map(item => item.id));
    const [ageRange, setAgeRange] = useState([
        profileDetails?.minimum_age_preference, 
        profileDetails?.maximum_age_preference
    ]); // Idade mínima e máxima
    const [habitsIdsPreference, setHabitsIdsPreference] = useState(profileDetails.habits.map(item => item.id));
    
    const tokenCookie = Cookies.get('token_jc');
    const navigate = useNavigate();



    //=// refatorar esses effects para virar useCallback e try em dupla com genders + habits (acho q um promises all)
    useEffect(()=> {
        async function getAllGenders() {
            console.log('Effect /Preferences');
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

                console.error('DETALHES DO ERRO:', error);
            }

            setLoading(false);
        } 
        getAllGenders();
    }, [tokenCookie]);

    useEffect(()=> {
        async function getAllHabits() {
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
    
                console.error('DETALHES DO ERRO:', error);
            }
    
            setLoading(false);
        } 
        getAllHabits();
    }, [tokenCookie]);

    useEffect(()=> {
        async function checkValidateSubmitDatas() {
            const requirements = gendersIdsPreference.length > 0 && ageRange[0] <= ageRange[1];
            const preferencesGendersHasChange = !arraysHaveSameValues(profileDetails.preferences.map((item)=> item.id), gendersIdsPreference);
            const minAgeHasChange = profileDetails.minimum_age_preference !== ageRange[0];
            const maxAgeHasChange = profileDetails.maximum_age_preference !== ageRange[1];
            const preferencesHabitsHasChange = !arraysHaveSameValues(profileDetails.habits.map((item)=> item.id), habitsIdsPreference);

            // if(requirements && (preferencesGendersHasChange || minAgeHasChange || maxAgeHasChange || preferencesHabitsHasChange)) {
            //     console.log('SUBMIT VALIDADO')
            // }
            // else {
            //     console.log('NÃO PODE ENVIAR')
            // }
            setValidateSubmit(requirements && (preferencesGendersHasChange || minAgeHasChange || maxAgeHasChange || preferencesHabitsHasChange));          
        }
        checkValidateSubmitDatas();
    }, [profileDetails, gendersIdsPreference, ageRange, habitsIdsPreference]);




    function handleChangeGenderPreference(selectGender) {
        const newGenderPreferences = gendersIdsPreference.includes(selectGender.id) 
            ? gendersIdsPreference.filter(item=> item !== selectGender.id) //Remove o item se já está marcado
            : [...gendersIdsPreference, selectGender.id]; //Adiciona o valor se não está marcado


        console.log('NEW genders:', newGenderPreferences);
        setGendersIdsPreference(newGenderPreferences);
    }

    // function handleChangeMinAge(e) {
    //     if(e.target.value >= maxAgePreference) {
    //         setMinAgePreference(parseInt(e.target.value));
    //         setMaxAgePreference(parseInt(e.target.value)+1);

    //         // if(e.target.value == 100) {
    //         //     setMaxAgePreference(100);
    //         // }

    //         return;
    //     }
    //     // else {
    //     setMinAgePreference(parseInt(e.target.value));
    //     // }
    // }
    
    // function handleChangeMaxAge(e) {
    //     if(e.target.value <= minAgePreference-1) {
    //         setMaxAgePreference(parseInt(e.target.value));
    //         setMinAgePreference(parseInt(e.target.value));
    //         return;
    //     }
    //     // else {
    //     setMaxAgePreference(parseInt(e.target.value));
    //     // }
    // }

    function handleChangeHabitPreference(selectHabit) {
        console.log(selectHabit);

        if(habitsIdsPreference.includes(selectHabit.id)) {
            setHabitsIdsPreference(habitsIdsPreference.filter(item=> item != selectHabit.id));
            setHabitsPreview(habitsPreview.filter(item=> item.id != selectHabit.id));
        }
        else {
            if(habitsIdsPreference.length >= 10) {
                // toast.info('Selecione no máximo 10 interesses!');
                return;
            }
            
            setHabitsIdsPreference(prev=> [...prev, selectHabit.id])
            setHabitsPreview(prev=> [...prev, selectHabit]);
        }
    }
    


    // SUBMIT API (UPDATE)
    async function handleSubmitPreferencesUpdate(e) {
        e.preventDefault();
        setLoadingSubmit(true);
        setError(null);
        console.log(gendersIdsPreference);
        console.log(ageRange);
        console.log(habitsIdsPreference);
                
        
        // SUBMIT
        try {
            const response = await FORMS_UPDATE_PREFERENCES(JSON.parse(tokenCookie), gendersIdsPreference, ageRange[0], ageRange[1], habitsIdsPreference);
            console.log(response);

            if(response.success) {
                setRefreshContext(prev => !prev);
                toast.success('Alterações salvas!');

                navigate('/settings');
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
        <div className="Page Forms Preference">
            <NavBar />
            
            <main className='PageContent FormsContent PreferencesContent grid'>
                <div className="title_page">
                    <h1>
                        <span>Alterar Preferências</span>
                    </h1>
                </div>

                <div className="content_main">
                    {loading ? (

                    <div>CARREGANDO PAGE...</div>

                    ) : (
                    error ? (

                    <div>!ERRO AO CARREGAR A PÁGINA!</div>

                    ) : (

                    <form className="form" onSubmit={handleSubmitPreferencesUpdate} autoComplete="off">
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

                        <div className="label--input agr_group">
                            <label>
                                <span>Quer alguém em qual faixa etária?</span> 
                                <span>{ageRange[0]} - {ageRange[1]}</span>
                            </label>
                            
                            <SliderRange min={18} max={100} ageRange={ageRange} setAgeRange={setAgeRange} />

                            <div className="range_extra">
                                <small>Mostrar pessoas um pouco fora da minha faixa de preferência se eu ficar sem perfis pra ver</small>

                                <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>

                        <div className="label--input habits">
                            <label>
                                <span>Qual seu tipo de bloquinho? (Interesses)</span>

                                {habitsPreview.length > 0 && (
                                <span>{habitsPreview.length} de 10</span>
                                )}
                            </label>

                            {habitsPreview.length > 0 && (
                            <div className="habits_preview">
                            {habitsPreview.map((item)=> (
                                <label className="btn_radio" key={item.id} title={item.id}>
                                    <input
                                    type="checkbox"
                                    name="habits"
                                    onChange={()=> handleChangeHabitPreference(item)}
                                    checked={habitsIdsPreference.includes(item.id)}
                                    />
                                    <span>{item.name}</span>
                            
                                    <i className="bi bi-x"></i>
                                </label>
                                ))}
                            </div>
                            )}
                            
                            <div className="btns_radio_container habits">
                                {habits
                                .filter((item, idx)=> idx < qtdPreview)
                                .map(item => (
                                <label className="btn_radio" key={item.id}>
                                    <input
                                    type="checkbox"
                                    name="habits"
                                    onChange={()=> handleChangeHabitPreference(item)}
                                    checked={habitsIdsPreference.includes(item.id)}
                                    />
                                    {item.name}
                                </label>
                                ))}                                
                            </div>

                            {qtdPreview != habits.length && (
                            <button className="show_more" onClick={()=> setQtdPreview(habits.length)}>
                                Ver todos
                            </button>
                            )}
                        </div>


                        {validateSubmit && (
                        <div className="btns_container animate__animated animate__fadeInUp">
                            <button className="btn primary" disabled={loadingSubmit}>
                                Confirmar Alterações
                            </button>
                        </div>
                        )}
                    </form>

                    ))}
                </div>
            </main>

        </div>
    );
}