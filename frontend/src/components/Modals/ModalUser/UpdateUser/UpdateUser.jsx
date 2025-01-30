// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useState, useEffect, useRef } from 'react';
import { USER_UPDATE_PASSWORD, USER_UPDATE_LEVEL, USER_UPDATE_PERFIL } from "../../../../API/userApi";
import Cookies from "js-cookie";
// import { Navigate } from 'react-router-dom';

// Components:
import { InputPassword } from "../../../InputPassword/InputPassword";
import { UpdateCategory } from "./UpdateCategory/UpdateCategory";
import { toast } from "react-toastify";
// import { UserCreate } from './UserCreate/UserCreate';

// Utils:
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
import './updateuser.css';


UpdateUser.propTypes = {
    close: PropTypes.func,
    setReflashState: PropTypes.func,
    userSelect: PropTypes.object,
    optionUpdate: PropTypes.string,
}
export function UpdateUser({ close, setReflashState, userSelect, optionUpdate }) {
    const [loading, setLoading] = useState(false);
    
    const newPasswordRef = useRef('');
    
    const nameUserRef = useRef('');
    const emailUserRef = useRef('');
    const [updatePerfil, setUpdatePerfil] = useState(false);

    const levels = [
        {value: "admin", title: "Administrador"}, 
        {value: "manager", title: "Gerente"}, 
        {value: "user", title: "Usuário comum"}
    ];
    const [levelUser, setLevelUser] = useState(userSelect.level);

    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {
        function initialComponent() {
            console.log('Effect Modal UpdateUser');
            
            if(nameUserRef.current && emailUserRef.current) {
                nameUserRef.current.value = userSelect.name;
                emailUserRef.current.value = userSelect.email;
            }
        }
        initialComponent();
    }, [userSelect]);


    // UPDATE:
    async function handleSubmitUpdatePassword(e) 
    {
        e.preventDefault();
        setLoading(true);

        const password = newPasswordRef.current?.value;
        console.log(password);
        console.log(userSelect.id);

        if(password !== '' && userSelect.id) {
            try {
                const response = await USER_UPDATE_PASSWORD(JSON.parse(tokenCookie), password, userSelect.id);
                console.log(response);  
    
                if(response.success) {
                    close();
                    // setReflashState(prev => !prev);
                    toast.success('Senha alterada!');
                }
                else if(response.success == false) {
                    toast.error(response.message);
                }
                else {
                    toast.error('Erro inesperado.');
                }
            }
            catch(error) {
                console.error('Deu erro: ', error);
    
                if(error?.response?.data?.message == 'Unauthenticated.') {
                    toast.error('Requisição não autenticada.');
                }
                else {
                    toast.error('Houve algum erro.');
                }
            }
        }
        else {
            console.warn('Algum erro com a condicional!');
        }

        setLoading(false);       
    }

    async function handleSubmitUpdateLevel() 
    {
        setLoading(true);

        if(levelUser == "admin" || levelUser == "user" || levelUser == "manager") {
            try {
                const response = await USER_UPDATE_LEVEL(JSON.parse(tokenCookie), userSelect.id, levelUser);
                console.log(response);  
    
                if(response.success) {
                    close();
                    setReflashState(prev => !prev);
                    toast.success('Alteração concluída!');
                }
                else if(response.success == false) {
                    toast.error(response.message);
                }
                else {
                    toast.error('Erro inesperado.');
                }
            }
            catch(error) {
                console.error('Deu erro: ', error);
    
                if(error?.response?.data?.message == 'Unauthenticated.') {
                    toast.error('Requisição não autenticada.');
                }
                else {
                    toast.error('Houve algum erro.');
                }
            }
        }
        else {
            console.warn('Algum erro com a condicional!');
        }

        setLoading(false);
    }

    async function handleSubmitUpdatePerfil(e) 
    {
        e.preventDefault();
        setLoading(true);

        const name = nameUserRef.current?.value;
        const email = emailUserRef.current?.value;
        console.log(name);
        console.log(email);
        console.log(userSelect.id);

        if(name !== '' && email !== '' && userSelect?.id) {
            try {
                const response = await USER_UPDATE_PERFIL(JSON.parse(tokenCookie), userSelect.id, email, name);
                console.log(response);  
    
                if(response.success) {
                    close();
                    setReflashState(prev => !prev);
                    toast.success('Alteração salva!');
                }
                else if(response.success == false) {
                    toast.error(response.message);
                }
                else {
                    toast.error('Erro inesperado.');
                }
            }
            catch(error) {
                console.error('Deu erro: ', error);
    
                if(error?.response?.data?.message == 'Unauthenticated.') {
                    toast.error('Requisição não autenticada.');
                }
                else {
                    toast.error('Houve algum erro.');
                }
            }
        }
        else {
            console.warn('Algum erro com a condicional!');
        }

        setLoading(false);       
    }



    return (
        <div className="Modal UpdateUser">
            <div className='bg-modal' onClick={close}></div>

            <div className='WindowUpdateUser WindowCreateUser grid'>
                {optionUpdate == 'password' ? (
                    <>
                    <h3>
                        <span>Mudar Senha</span>
                    </h3>
    
                    <form className="content-window" onSubmit={handleSubmitUpdatePassword} autoComplete="off">
                        <p>Adicione uma nova senha para <b>{userSelect.name}</b>.</p>          
                        
                        <div className="label--input">
                            <label htmlFor="senha">Nova senha</label>
    
                            <InputPassword passwordRef={newPasswordRef} />
                        </div>
    
                        <div className="btns">
                            <button className="btn primary" disabled={loading}>
                                {loading ? <span className="loader"></span> : 'Salvar alteração'}
                            </button>
    
                            <button className="btn cancel" onClick={close} type="button" disabled={loading}>Cancelar</button>
                        </div>
                    </form>
                    </>
                ) : (
                optionUpdate == 'category' ? (
                    <UpdateCategory close={close} userSelect={userSelect} setReflashState={setReflashState}  />
                ) : (
                optionUpdate == 'level' ? (
                    <>
                    <h3>
                        <span>Alterar nível de acesso</span>
                    </h3>
    
                    <div className="content-window">
                        <p>Defina o nível de acesso do usuário de nome <b>{userSelect.name}</b>.</p>          
                        
                        <div className="label--input">
                            <label>Nível:</label>

                            {/* <div> */}
                            {levels.map(item=> (
                            <label key={item.value}>
                                <input type="radio" name="level" value={item.value} checked={item.value == levelUser} onChange={()=> setLevelUser(item.value)} />
                                {item.title}
                            </label>
                            ))}
                            {/* </div> */}
                        </div>
    
                        <div className="btns">
                            <button className="btn primary" onClick={handleSubmitUpdateLevel} disabled={loading || userSelect.level == levelUser}>
                                {loading ? 'Salvando...' : 'Salvar alteração'}
                            </button>
    
                            <button className="btn cancel" onClick={close} disabled={loading}>Cancelar</button>
                        </div>
                    </div>
                    </>
                ) : (
                optionUpdate == 'perfil' ? (
                    <>
                    <h3>
                        <span>Mudar dados do usuário</span>
                    </h3>
    
                    <form className="content-window" onSubmit={handleSubmitUpdatePerfil} autoComplete="off">
                        <p>Abaixo você irá mudar os dados do usuário de nome <b>{userSelect.name}</b>.</p>          
                        
                        <div className="label--input">
                            <label htmlFor="nome">Nome</label>
                            <input ref={nameUserRef} className="input" onFocus={()=> setUpdatePerfil(true)} id='nome' type="text" required />
                        </div>
                        <div className="label--input">
                            <label htmlFor="email">E-mail</label>
                            <input ref={emailUserRef} className="input" onFocus={()=> setUpdatePerfil(true)} id='email' type="email" required />
                        </div>
    
                        <div className="btns">
                            <button className="btn primary" disabled={loading || !updatePerfil}>
                                {loading ? 'Salvando...' : 'Salvar alteração'}
                            </button>
    
                            <button className="btn cancel" onClick={close} type="button" disabled={loading}>Cancelar</button>
                        </div>
                    </form>
                    </>
                ) : (
                    <p>DEFAULT</p>
                )
                )
                )
                )}
            </div>
        </div>
    )        
}