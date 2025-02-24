// Funcionalidades / Libs:
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

// API:
// import { MATCH_GET_ALL } from "../../API/matchApi";

// Contexts:
// import UserContext from "../../contexts/userContext";

// Config JSON:
// import imagesServer from '../../../public/configApi.json'

// Components:
// import { toast } from "react-toastify";
// import { NavBar } from "../../components/NavBar/NavBar";
import { InfoUser } from "../../components/InfoUser/InfoUser";

// Utils

// Assets:

// Estilo:
// import './style.css';



export default function User() {
    const { id } = useParams();
    // console.log(id);
    // Estados do componente:
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Dados pré-carregados:
    const [userData, setUserData] = useState(null);

    // Logica da UI:
    
    const tokenCookie = Cookies.get('token_jc');
    const navigate = useNavigate();
    
   
        
    useEffect(()=> {
        async function getByIdUser() {
            console.log('Effect /User');
            setLoading(true);
            
            try {
                setError(true);
                // const response = await MATCH_GET_ALL(JSON.parse(tokenCookie));
                // console.log(response);
                const response = {
                    success: true,
                    data: {
                        id: 1,
                        name: 'Carlos Silva',
                        age: 30,
                        phone: '11987654321',
                        gender: 'Homem',
                        sexuality: 'Bissexual'
                    }
                };

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
    }, [tokenCookie]);
    


    

  
    
    return (
        <div className="Page User">
            
            {/* <NavBar functionBack={()=> navigate(-1)} /> */}

            <main className='PageContent UserContent grid animate__animated animate__fadeIn'>
                {loading ? (
                    <div className="feedback_content">
                        <span className="loader"></span>
                    </div>
                ) : (
                    error ? (

                    <div className="feedback_content">
                        <h2>Ops, algo deu errado!</h2>
                        <p>Tente novamente recarregando a página.</p>

                        <a href="/user" className="btn primary">Recarregar</a>
                    </div>

                    ) : (

                    // <InfoUser userData={userData} />
                    <div>Componente</div>

                    )                    
                )}
            </main>
        </div>
    );
}