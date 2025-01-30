// Funcionalidades / Libs:
import PropTypes from 'prop-types';
import Cookies from "js-cookie";
import { useContext, useState, useEffect, useRef } from 'react';
import { Link, NavLink } from "react-router-dom";
import { PRODUCT_GET_ALERT } from '../../API/productApi';

// Contexts:
import UserContext from '../../contexts/userContext';

// Componets:


// Utils:
import { primeiraPalavra } from '../../utils/formatStrings';
//import { formatarHora } from '../../../utils/formatarNumbers';

// Assets:
import imgLogo from '../../assets/LOGO-BIZSYS_preto.png';

// Estilo:
import './navmenu.css';


NavMenu.propTypes = {
    onPageAlert: PropTypes.bool,
}
export function NavMenu({ onPageAlert=false }) {
    const [loadingAlert, setLoadingAlert] = useState(true);
    const [hasError, setHasError] = useState(true);

    const [isOpen, setIsOpen] = useState(false);
    const [isOpenAlert, setIsOpenAlert] = useState(false);

    const [productsAlert, setProductsAlert] = useState([]);

    const navMenuRef = useRef(null);
    const conteinerAlertRef = useRef(null);

    const {
        loading,
        profileDetails,
        logoutUser
    } = useContext(UserContext);

    const tokenCookie = Cookies.get('tokenEstoque');


    useEffect(()=> {     
        async function getProductsAlert() {
            console.log('Effect Component NavMenu');

            try {
                const response = await PRODUCT_GET_ALERT(JSON.parse(tokenCookie), 1);
                // console.log(response);

                if(response.success) {
                    const arrayProcessed = response.data.data.slice(0, 5);
                    // console.log(arrayProcessed)
                    setProductsAlert(arrayProcessed);                    
                    setHasError(false);
                }
                else if(response.success == false) {
                    console.error(response.message);
                }
                else {
                    console.error('Erro inesperado.');
                }
            }
            catch(error) {
                console.error('DEU ERRO:', error);

                if(error?.response?.data?.message == 'Unauthenticated.') {
                    console.error('Requisição não autenticada.');
                }
                else {
                    console.error('Houve algum erro.');
                }
            }
            
            setLoadingAlert(false)
        }
        getProductsAlert();
    }, [tokenCookie]);

    useEffect(()=> {        
        const handleClickOutside = (event) => { 
            if(navMenuRef.current && !navMenuRef.current.contains(event.target)) { 
                if(isOpen) {
                    console.warn('Clique fora do NavMenu!');
                    setIsOpen(false);
                }
            } 

            if(conteinerAlertRef.current && !conteinerAlertRef.current.contains(event.target)) { 
                if(isOpenAlert) {
                    console.warn('Clique fora do conteinerAlert!');
                    setIsOpenAlert(false);
                }
            } 
        }; 
        
        // Adiciona o listener
        document.addEventListener('mousedown', handleClickOutside); 
        
        // Cleanup: remove os listeners quando o componente for desmontado
        return ()=> { 
            document.removeEventListener('mousedown', handleClickOutside); 
        };
    }, [isOpen, isOpenAlert]);

    
    

    return (
        <header className={'NavMenu ' + profileDetails?.level}>

            <nav ref={navMenuRef} className="NavMenuContent grid">
                <Link className='logo' to='/home' onClick={()=> setIsOpen(false)}>
                    <img src={imgLogo} alt="Logotipo" />
                    {/* <img src={LogoP} className="imgP" alt="Logotipo" /> */}
                </Link>

                <ul className={`menu ${isOpen ? 'show' : ''}`}>
                    <li className='mobile'>
                        {loading ? (
                            <p>Carregando...</p>
                        ) : (
                            <NavLink to='/profile' className='btn profile'>
                                {profileDetails?.level === "admin" ? 
                                <i className="bi bi-shield-fill-check"></i> 
                                : 
                                <i className="bi bi-person-circle"></i>
                                }
                                
                                <span className='name-profile'>{primeiraPalavra(profileDetails?.name)}</span>
                            </NavLink>
                        )}
                    </li>
                    <div className="separator mobile"></div>

                    <li>
                        <NavLink to='/home'>Início</NavLink>
                    </li>
                    
                    {/* nivel admin */}
                    {profileDetails?.level == "admin" && (
                    <>
                    <li>
                        <NavLink to='/users'>Usuários</NavLink>
                    </li>
                    <li>
                        <NavLink to='/sectors'>Setores</NavLink>
                    </li>
                    </>
                    )}
                    {/* nivel admin */}
                    
                    {(profileDetails?.categories?.length > 0 || profileDetails?.level == "admin") && (
                    <>
                    <li>
                        <NavLink to='/storages'>Depósitos</NavLink>
                    </li>
                    <li>
                        <NavLink to='/products'>Produtos</NavLink>
                    </li>
                    <li>
                        <NavLink to='/inputs'>Entradas</NavLink>
                    </li>
                    <li>
                        <NavLink to='/exits'>Saídas</NavLink>
                    </li>

                    {/* {profileDetails?.reservation_enabled == 1 && (
                    <li>
                        <NavLink to='/reservations'>Reservas</NavLink>
                    </li>
                    )} */}
                    </>
                    )}
                    
                    <div className="separator mobile"></div>
                    <li className='mobile'>
                        <button onClick={logoutUser} disabled={loading}>
                            Sair
                        </button>
                    </li>
                </ul>
                
                <div className="menu-right">

                    <div ref={conteinerAlertRef} className="conteiner-alert">
                        {onPageAlert ? (
                        <NavLink to='/alerts' className='btn notification'>
                            <i className="bi bi-bell-fill"></i>
                        </NavLink>
                        ) : (
                        <button
                        className='btn notification'
                        onClick={()=> {setIsOpen(false); setIsOpenAlert(prev => !prev)}}
                        disabled={loadingAlert || hasError}
                        >
                            <i className="bi bi-bell-fill"></i>

                            {productsAlert.length > 0 && (
                            <div className="indicator"></div>
                            )}
                        </button>
                        )}

                        {isOpenAlert && (
                        <div className="list-alert animate__animated animate__fadeInDown animate__faster">
                            <div className="top">
                                <h3>Alertas</h3>
                            </div>

                            <ul className="alerts">
                                {productsAlert.map(item => (
                                <li key={item.id}>
                                    <div className="icon">
                                        <i className="bi bi-box-seam-fill"></i>
                                    </div>
                                    <div className="info">
                                        <span>Produto: <b>{item.name}</b></span>
                                        <span>Quantidade em estoque: <b>{item.quantity_stock}</b></span>
                                        <span>Setor: <b>{item['name-category']}</b></span>
                                    </div>
                                </li>
                                ))}
                            </ul>

                            <div className="bottom">
                                {productsAlert.length == 0 ? (
                                <span className='content-bottom empty'>Nenhum alerta</span>
                                ) : (
                                <Link to='/alerts' className='content-bottom'>Ver todos os alertas</Link>
                                )}
                            </div>
                        </div>
                        )}
                    </div>
                    
                    {loading ? (
                        <small className='desktop'>Carregando...</small>
                    ) : (
                        <NavLink className='btn desktop' to='/profile'>
                            {profileDetails?.level === "admin" ? 
                            <i className="bi bi-shield-fill-check"></i> 
                            : 
                            <i className="bi bi-person-circle"></i>
                            }
                            
                            <span className='name-profile'>{primeiraPalavra(profileDetails?.name)}</span>
                        </NavLink>
                    )}
                    
                    <button className='btn desktop' onClick={logoutUser} disabled={loading}>
                        Sair
                    </button>
                    
                    <button className={`btn mobile ${isOpen ? 'open' : ''}`} onClick={()=> setIsOpen(prev => !prev)}>
                    {/* <div className="mobile-menu"> */}
                        <div className="line1"></div>
                        <div className="line2"></div>
                        <div className="line3"></div>
                    {/* </div> */}
                    </button>
                </div>
            </nav>

        </header>
    )        
}