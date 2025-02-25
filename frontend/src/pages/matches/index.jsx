// Funcionalidades / Libs:
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";

// API:
// import { MATCH_GET_ALL } from "../../API/matchApi";

// Contexts:
// import UserContext from "../../contexts/userContext";

// Config JSON:
// import imagesServer from '../../../public/configApi.json'

// Components:
// import { toast } from "react-toastify";
// import { NavBar } from "../../components/NavBar/NavBar";

// Utils

// Assets:

// Estilo:
// import './style.css';



export default function Matches() {
    // Estados do componente:
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Dados pré-carregados:
    const [matches, setMatches] = useState([]);

    // Logica da UI:
    
    const tokenCookie = Cookies.get('token_jc');
    const navigate = useNavigate();
    
   
        
    useEffect(()=> {
        async function getAllMatches() {
            console.log('Effect /Matches');
            setLoading(true);
            
            try {
                setError(true);
                // const response = await MATCH_GET_ALL(JSON.parse(tokenCookie));
                // console.log(response);
                const response = {
                    success: true,
                    data: [
                        {
                          id: 1,
                          name: 'Carlos Silva',
                          age: 30,
                          phone: '11987654321'
                        },
                        {
                          id: 2,
                          name: 'Mariana Santos',
                          age: 25,
                          phone: '21987654321'
                        },
                        {
                          id: 3,
                          name: 'João Oliveira',
                          age: 45,
                          phone: '31987654321'
                        },
                        {
                          id: 4,
                          name: 'Ana Costa',
                          age: 35,
                          phone: '41987654321'
                        }
                      ]
                };

                if(response.success) {
                    setMatches(response.data);

                    setError(false);
                }
                else if(response.success == false) {
                    console.error(response.message);
                }
                else {
                    console.error('Erro inesperado.');
                }
            }
            catch(error) {
                if(error?.response?.data?.message == 'Unauthenticated.') {
                    console.error('Requisição não autenticada.');
                }
                else {
                    console.error('Houve algum erro.');
                }

                console.error('DETALHES DO ERRO:', error);
            }

            setLoading(false);
        } 
        getAllMatches();
    }, [tokenCookie]);
    


    function handleClickOpenChat(selectUser) {
        // console.log(selectUser);

        let phone = `55${selectUser.phone}`;
        let message = `Ol%C3%A1%20${selectUser.name}`;

        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    }

  
    
    return (
        <div className="Page Matches">
            
            {/* <NavBar functionBack={()=> navigate(-1)} /> */}

            <main className='PageContent MatchesContent grid animate__animated animate__fadeIn'>
                <div className="title_page">
                    <h1>
                        <span>Matches</span>
                    </h1>
                </div>

                {loading ? (
                    <div className="feedback_content">
                        <span className="loader_content"></span>
                        {/* <p>Encontrando pessoas para você...</p> */}
                    </div>
                ) : (
                    error ? (

                    <div className="feedback_content">
                        <h2>Ops, algo deu errado!</h2>
                        <p>Tente novamente recarregando a página.</p>

                        <a href="/matches" className="btn primary">Recarregar</a>
                    </div>

                    ) : (

                    <ul className="container_matches">
                        {matches.length > 0 ? (

                            matches.map((item)=> (
                            <li key={item.id}>
                                <p>
                                    Você e <b>{item.name}</b>, {item.age} <br />
                                    deram match!
                                </p>

                                <div className="btns">
                                    <Link to={`/user/${item.id}`}>
                                        <span>Ver perfil</span>
                                    </Link>

                                    <button onClick={()=> handleClickOpenChat(item)}>
                                        <span>Conversar</span>
                                    </button>
                                </div>
                            </li>
                            ))

                        ) : (

                            <li>
                                <h1>NENHUMA MATCH NO MOMENTO</h1>
                            </li>

                        )}
                    </ul>

                    )                    
                )}
            </main>
        </div>
    );
}