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
   console.log('CALL FUNCTION API');

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

// Registra dados de preferenciua (POST):
export async function FORMS_CREATE_PREFERENCES(token, idsGenders, idsHabits) {
   console.log('CALL FUNCTION API');

   const response = await axios.post(`${API_URL}/preferences-habits`, {
      "fk_gender_preferences_id": idsGenders,
      "habits": idsHabits
   },
   { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token }
   });
   
   // console.log(response.data);
   return response.data;
}

// Upload de fotos (POST):
export async function FORMS_CREATE_PHOTOS(token, filesPhotos) {
   console.log('CALL FUNCTION API');
   console.log(filesPhotos);


   // const formData = new FormData();
   // formData.append('name_photo', filesPhotos);

   // const response = await axios.post(`${API_URL}/photos`, formData,
   // { 
   //    headers: { 
   //       "Accept": "application/json", 
   //       "Content-Type": "multipart/form-data",
   //       "Authorization": "Bearer " + token ,
   //       'Access-Control-Allow-Origin': '*'
   //    }
   // });

   // const response = await axios({
   //    method: "post",
   //    url: `${API_URL}/photos`,
   //    crossDomain: true,        
   //    data: {
   //       "name_photo": filesPhotos 
   //    },
   //    headers: {
   //       "Accept": "application/json",
   //       "Content-Type": "multipart/form-data",
   //       "Authorization": "Bearer " + token,
   //       'Access-Control-Allow-Origin': '*'
   //    }
   // });


   const response = await axios({
      method: "post",
      url: `${API_URL}/photos`,
      data: {
         "name_photo[]": filesPhotos 
      },
      headers: {
         "Accept": "application/json",
         "Content-Type": "multipart/form-data",
         "Authorization": "Bearer " + token,
      }
   });
   
   // console.log(response.data);
   return response.data;
}


// Update dados do perfil (POST):
export async function FORMS_UPDATE_PROFILE(token, name, phone, birthDate, idGender, idGenderOptional, idSexuality, aboutMe) {
   console.log('CALL FUNCTION API');

   const response = await axios.post(`${API_URL}/update-info-user`, {
      "name": name,
      "phone": phone,
      "birth_data": birthDate,
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

// Registra dados de preferenciua (POST):
export async function FORMS_UPDATE_PREFERENCES(token, idsGenders, minAge, maxAge, idsHabits) {
   console.log('CALL FUNCTION API');

   const response = await axios.post(`${API_URL}/update-preferences`, {
      "fk_gender_preferences_id": idsGenders,
      "minimum_age": minAge,
      "maximum_age": maxAge,
      "habits": idsHabits
   },
   { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token }
   });
   
   // console.log(response.data);
   return response.data;
}