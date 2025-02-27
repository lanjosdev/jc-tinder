// Funcionalidades / Libs:
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

// API:
import { USER_GET_BY_ID } from "../../API/userApi";

// Contexts:
// import UserContext from "../../contexts/userContext";

// Components:
import { NavBar } from "../../components/NavBar/NavBar";
import { InfoUser } from "../../components/InfoUser/InfoUser";

// Utils

// Assets:

// Estilo:
import './style.css';



export default function User() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Status do componente:
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Dados pré-carregados:
    const [userData, setUserData] = useState(null);

    // Logica da UI:

    
    const tokenCookie = Cookies.get('token_jc');
    
   
        
    useEffect(()=> {
        async function getByIdUser() {
            console.log('Effect /User');
            setLoading(true);
            
            try {
                setError(true);
                const response = await USER_GET_BY_ID(JSON.parse(tokenCookie), id);
                console.log(response);
                // const response = {
                //     success: true,
                //     data: {
                //         id: 1,
                //         name: 'Carlos Silva',
                //         age: 30,
                //         phone: '11987654321',
                //         gender: 'Homem',
                //         sexuality: 'Bissexual'
                //     }
                // };

                if(response.success) {
                    setUserData(response.data);

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
        getByIdUser();
    }, [tokenCookie, id]);
    


    
    function handleOpenChat() {
        // console.log(userData);

        const phone = `55${userData.phone}`;
        const message = `Ol%C3%A1%20${userData.name}`;
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    }
    
    
    return (
        <div className="Page User Home">
            
            <NavBar pathBack="/matches" />

            <main className='PageContent UserContent grid animate__animated animate__fadeIn'>
                {loading ? (
                    <div className="feedback_content">
                        <span className="loader_content"></span>
                    </div>
                ) : (
                    error ? (

                    <div className="feedback_content">
                        <h2>Ops, algo deu errado!</h2>
                        <p>Tente novamente recarregando a página.</p>

                        <a href={`/user/${id}`} className="btn primary">Recarregar</a>
                    </div>

                    ) : (

                    <>
                    <InfoUser userData={userData} />

                    <div className="action">
                        <button className="btn" onClick={handleOpenChat}>
                            <i className="bi bi-whatsapp"></i>
                            <span>Conversar</span>
                        </button>
                    </div>
                    </>

                    )                    
                )}
            </main>
        </div>
    );
}