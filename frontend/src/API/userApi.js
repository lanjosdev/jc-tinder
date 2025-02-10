// Config JSON:
import api from '../../public/configApi.json';
// Funcionalidades / Libs:
import axios from "axios";

// Variaveis:
// Base URL: http://10.10.0.210:8000/api
export const API_URL = api.api_url;


// End-Points/Rotas da API:
// Logar usuario (POST):
export async function USER_REGISTER(name, phone, birthData, password) {
   console.log('CALL FUNCTION APIIII');

   const response = await axios.post(`${API_URL}/register`, {
      "adult": 1,
      "name": name,
      "phone": phone,
      "birth_data": birthData,
      "password": password,
   },
   { 
      headers: { "Accept": "application/json" } 
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

// Pega detalhes do perfil logado:
export async function USER_PROFILE_DETAILS(token) {
   console.log('CALL FUNCTION API');

   const response = await axios.get(`${API_URL}/my-profile`, {
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}

// // Pega todos os usuarios (GET):
// export async function USER_GET_ALL(token, params) {
//    console.log('CALL FUNCTION API');

//    const response = await axios.get(`${API_URL}/get-all-user?${params}`, { 
//       headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
//    });

//    // console.log(response.data);
//    return response.data;
// }

// // Cria novo usuario (POST):
// export async function USER_CREATE(token, email, password, name) {
//    console.log('CALL FUNCTION API');

//    const response = await axios.post(API_URL + '/register-user', {
//       "email": email,
//       "password": password,
//       "name": name
//    },
//    { 
//       headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
//    });

//    // console.log(response.data);
//    return response.data;
// }





// // Deleta usuario (DELETE):
// export async function USER_DELETE(token, idUser) {
//    console.log('CALL FUNCTION API');

//    const response = await axios.delete(API_URL + '/delete-user/' + idUser, { 
//       headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
//    });

//    // console.log(response.data);
//    return response.data;
// }

// // Atualiza senha do usuário (ADMIN) (POST):
// export async function USER_UPDATE_PASSWORD(token, password, idUser) {
//    console.log('CALL FUNCTION API');

//    const response = await axios.post(API_URL + '/reset-password/' + idUser, {
//       "password": password
//    },
//    { 
//       headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
//    });

//    // console.log(response.data);
//    return response.data;
// }


// // Atualiza dados (email e/ou nome) do usuário (ADMIN) (POST):
// export async function USER_UPDATE_PERFIL(token, idUser, email, name) {
//    console.log('CALL FUNCTION API');

//    const response = await axios.post(API_URL + '/update-user/' + idUser, {
//       "email": email,
//       "name": name
//    }, 
//    { 
//       headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
//    });

//    // console.log(response.data);
//    return response.data;
// }

// // Restaurar usuario (POST):
// export async function USER_RESTORE(token, idUser) {
//    console.log('CALL FUNCTION API');

//    // const response = await axios.post(`${API_URL}/reverse-deleted-user/${idUser}`, { 
//    //    headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
//    // });
//    const res = await fetch(`${API_URL}/reverse-deleted-user/${idUser}`, {
//       method: 'POST',
//       headers: { "Accept": "application/json", Authorization: 'Bearer ' + token }
//    });
//    const response = await res.json();

//    // console.log(response.data);
//    return response;
// }