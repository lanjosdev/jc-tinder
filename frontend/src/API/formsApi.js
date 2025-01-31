// Config JSON:
import api from '../../public/configApi.json';
// Funcionalidades / Libs:
import axios from "axios";

// Variaveis:
// Base URL: http://10.10.0.210:8000/api
export const API_URL = api.api_url;


// End-Points/Rotas da API:
// Registra dados do perfil (POST):
export async function FORMS_CREATE_PROFILE(token, idGender, idGenderOptional, idSexuality, aboutMe) {
   console.log('CALL FUNCTION APIIII');

   const response = await axios.post(`${API_URL}/attribution-gender-sexuality`, {
      "fk_gender_user_id": idGender,
      "fk_sub_gender_user_id": idGenderOptional,
      "fk_sexuality_user_id": idSexuality,
      "about_me": aboutMe
   },
   { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token }
   });
   
   // console.log(response.data);
   return response.data;
}