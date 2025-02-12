// Config JSON:
import api from '../../public/configApi.json';
// Funcionalidades / Libs:
import axios from "axios";

// Variaveis:
// Base URL: http://10.10.0.210:8000/api
export const API_URL = api.api_url;


// End-Points/Rotas da API:
// Create de foto (POST):
export async function PHOTO_CREATE(token, filePhoto) {
   console.log('CALL FUNCTION API');
   console.log(filePhoto);

   const response = await axios({
      method: "post",
      url: `${API_URL}/photos`,
      data: {
         "name_photo[]": [filePhoto] 
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

// Delete de foto (POST):
export async function PHOTO_DELETE(token, idPhoto) {
   console.log('CALL FUNCTION API');

   const response = await axios.delete(`${API_URL}/photo-delete/${idPhoto}`, {
      headers: { "Accept": "application/json", "Authorization": "Bearer " + token } 
   });
   
   // console.log(response.data);
   return response.data;
}

// Update de foto (POST):
export async function PHOTO_UPDATE(token, idPhoto, filePhoto) {
   console.log('CALL FUNCTION API');
   console.log(filePhoto);

   const response = await axios({
      method: "post",
      url: `${API_URL}/photo-update/${idPhoto}`,
      data: {
         "name_photo[]": [filePhoto] 
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

// Update sequence fotos (POST):
export async function PHOTO_UPDATE_SEQUENCE(token, sequence) {
   console.log('CALL FUNCTION API');
   console.log(sequence);

   const response = await axios({
      method: "post",
      url: `${API_URL}/update-sequence-photo`,
      data: {
         "sequence": sequence 
      },
      headers: {
         "Accept": "application/json",
         "Authorization": "Bearer " + token,
      }
   });
   
   // console.log(response.data);
   return response.data;
}