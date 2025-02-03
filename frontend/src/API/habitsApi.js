// Config JSON:
import api from '../../public/configApi.json';
// Funcionalidades / Libs:
import axios from "axios";

// Variaveis:
// Base URL: http://10.10.0.210:8000/api
export const API_URL = api.api_url;


// End-Points/Rotas da API:
// Pega todos os habitos (GET):
export async function HABIT_GET_ALL(token, params='') {
   console.log('CALL FUNCTION API');

   const response = await axios.get(`${API_URL}/get-all-habits?${params}`, { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}