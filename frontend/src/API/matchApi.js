// Config JSON:
import api from '../../public/configApi.json';
// Funcionalidades / Libs:
import axios from "axios";

// Variaveis:
// Base URL: http://10.10.0.210:8000/api
export const API_URL = api.api_url;


// End-Points/Rotas da API:
// Envia Like OU Deslike:
export async function MATCH_POST(token, idUser, status) {
   console.log('CALL FUNCTION API');
   console.log(idUser, status);

   const response = await axios.post(`${API_URL}/match`, {
      "fk_target_user_matches_id": idUser,
      "status": status
   }, 
   {
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}





// Logar usuario (POST):
export async function USER_LOGIN(phone, password) {
   console.log('CALL FUNCTION API');

   const response = await axios.post(`${API_URL}/login`, {
      "phone": phone,
      "password": password
   },
   { 
      headers: { "Accept": "application/json" } 
   });

   // console.log(response.data);
   return response.data;
}

// Logout usuario (POST):
export async function USER_LOGOUT(token) {
   console.log('CALL FUNCTION API');

   const res = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: { "Accept": "application/json", Authorization: 'Bearer ' + token }
   });
   const response = await res.json();

   // console.log(response);
   return response;
}



