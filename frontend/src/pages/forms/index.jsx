// Funcionalidades / Libs:
// import Cookies from "js-cookie";
import { useState, useEffect } from "react";
// import { Link } from "react-router";
// import { USER_REGISTER } from "../../API/userApi";

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


    const [showOptinalGender, setShowOptinalGender] = useState(false);
    
    // Dados a submeter
    const [genderSelect, setGenderSelect] = useState(null);
    const [genderOptionalSelect, setGenderOptionalSelect] = useState(null);
    const [sexualitySelect, setsexualitySelect] = useState(null);
    const [aboutMe, setAboutMe] = useState('');



    useEffect(()=> {
        function initializePage() {
            console.log('Effect /Forms');
            // console.log(error);
        } 
        initializePage();
    }, []);
    


    // SUBMIT API
    // async function handleSubmitRegister(e) {
    //     e.preventDefault();
    //     setLoading(true);

    //     // Validações
    //     if(passwordConfirm != password) {
    //         setError((prev) => ({
    //             ...prev, 
    //             password: 'Confirme a senha corretamente'
    //         }));
    //         toast.error('Confirme a senha corretamente');

    //         setLoading(false);
    //         return;
    //     }


    //     // SUBMIT
    //     console.log(name)
    //     console.log(phone)
    //     console.log(dateBirth)
    //     console.log(password)
    //     console.log(passwordConfirm)

    //     try {
    //         const response = await USER_REGISTER(name, phone, dateBirth, password);
    //         console.log(response);
    //         toast.info(response?.errors?.password[0]);
    //     }
    //     catch(error) {
    //         console.error(error);
    //     }


    //     setLoading(false);
    // }

    
  
    return (
        <div className="Page Forms">

            {/* //=// <Progress Bar /> */}

            <main className='PageContent FormsContent grid'>
                <div className="title_page">
                    {/* < back??? */}
                    <h1>Agora, o que seu Perfil diz sobre você?</h1>
                </div>

                <div className="content_main">
                    <form className="form" onSubmit={()=> console.log('submitttt')} autoComplete="off">
                        <div className="label--input" 
                        // onBlur={()=> {setShowOptinalGender(false); console.warn('FORA');}}
                        >
                            <label htmlFor="name">Qual seu gênero?</label>
                            
                            <div className="btns_radio_container">
                                {/* //=// fazer map */}
                                <label className="btn_radio">
                                    <input
                                    type="radio"
                                    name="gender"
                                    value={'Homem'}
                                    onChange={(e)=> {setGenderSelect(e.target.value); setShowOptinalGender(true)}}
                                    checked={'Homem' == genderSelect}
                                    required
                                    />
                                    Homem
                                </label>

                                <label className="btn_radio">
                                    <input
                                    type="radio"
                                    name="gender"
                                    value={'Mulher'}
                                    onChange={(e)=> {setGenderSelect(e.target.value); setShowOptinalGender(true)}}
                                    checked={'Mulher' == genderSelect}
                                    required
                                    />
                                    Mulher
                                </label>

                                <label className="btn_radio">
                                    <input
                                    type="radio"
                                    name="gender"
                                    value={'not-binary'}
                                    onChange={(e)=> {setGenderSelect(e.target.value); setShowOptinalGender(true)}}
                                    checked={'not-binary' == genderSelect}
                                    required
                                    />
                                    Não binário
                                </label>
                            </div>

                            {genderSelect && (
                            //=// get genders optinal na API
                            <div className="gender_optional">
                                <p onClick={()=> setShowOptinalGender(prev => !prev)}>
                                    Selecione mais informações sobre seu gênero (opcional)
                                    <i className="bi bi-chevron-down"></i> 
                                </p> 

                                <ul className={`list_gender_optional ${showOptinalGender ? '' : 'hide'}`}>
                                    <li>
                                        <p><b>{genderSelect} cisgênero</b></p>
                                        <small>Lorem ipsum dolor sit amet consectetur adipisicing elit.</small>
                                    </li>
                                    <li>
                                        <p><b>{genderSelect} transgênero</b></p>
                                        <small>Lorem ipsum dolor sit amet consectetur adipisicing elit.</small>
                                    </li>
                                </ul>
                            </div>
                            )}
                        </div>

                        <div className="label--nput">
                            <label htmlFor="">Seila</label>
                            <input type="text" />
                        </div>

                        <div className="long">
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur, incidunt? Deserunt tenetur molestias dolores dignissimos perspiciatis ad placeat assumenda voluptatem consequatur labore eos veniam, impedit, quas repellendus aspernatur obcaecati quasi!</p>
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur, incidunt? Deserunt tenetur molestias dolores dignissimos perspiciatis ad placeat assumenda voluptatem consequatur labore eos veniam, impedit, quas repellendus aspernatur obcaecati quasi!</p>
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur, incidunt? Deserunt tenetur molestias dolores dignissimos perspiciatis ad placeat assumenda voluptatem consequatur labore eos veniam, impedit, quas repellendus aspernatur obcaecati quasi!</p>
                            <p className="p">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur, incidunt? Deserunt tenetur molestias dolores dignissimos perspiciatis ad placeat assumenda voluptatem consequatur labore eos veniam, impedit, quas repellendus aspernatur obcaecati quasi!</p>
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur, incidunt? Deserunt tenetur molestias dolores dignissimos perspiciatis ad placeat assumenda voluptatem consequatur labore eos veniam, impedit, quas repellendus aspernatur obcaecati quasi!</p>
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur, incidunt? Deserunt tenetur molestias dolores dignissimos perspiciatis ad placeat assumenda voluptatem consequatur labore eos veniam, impedit, quas repellendus aspernatur obcaecati quasi!</p>
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur, incidunt? Deserunt tenetur molestias dolores dignissimos perspiciatis ad placeat assumenda voluptatem consequatur labore eos veniam, impedit, quas repellendus aspernatur obcaecati quasi!</p>
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur, incidunt? Deserunt tenetur molestias dolores dignissimos perspiciatis ad placeat assumenda voluptatem consequatur labore eos veniam, impedit, quas repellendus aspernatur obcaecati quasi!</p>
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur, incidunt? Deserunt tenetur molestias dolores dignissimos perspiciatis ad placeat assumenda voluptatem consequatur labore eos veniam, impedit, quas repellendus aspernatur obcaecati quasi!</p>
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur, incidunt? Deserunt tenetur molestias dolores dignissimos perspiciatis ad placeat assumenda voluptatem consequatur labore eos veniam, impedit, quas repellendus aspernatur obcaecati quasi!</p>
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur, incidunt? Deserunt tenetur molestias dolores dignissimos perspiciatis ad placeat assumenda voluptatem consequatur labore eos veniam, impedit, quas repellendus aspernatur obcaecati quasi!</p>
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur, incidunt? Deserunt tenetur molestias dolores dignissimos perspiciatis ad placeat assumenda voluptatem consequatur labore eos veniam, impedit, quas repellendus aspernatur obcaecati quasi!</p>
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur, incidunt? Deserunt tenetur molestias dolores dignissimos perspiciatis ad placeat assumenda voluptatem consequatur labore eos veniam, impedit, quas repellendus aspernatur obcaecati quasi!</p>
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur, incidunt? Deserunt tenetur molestias dolores dignissimos perspiciatis ad placeat assumenda voluptatem consequatur labore eos veniam, impedit, quas repellendus aspernatur obcaecati quasi!</p>
                        </div>

                        {/* Butão submit fixed Bottom */}
                        <div className="btns_container">
                            <button className="btn primary" disabled={loading}>Cadastrar com Telefone</button>
                        </div>
                    </form>
                </div>
            </main>

        </div>
    );
}