//https://stackabuse.com/making-asynchronous-http-requests-in-javascript-with-axios/
import axios from 'axios';

function getAPIData(name,name2) {

  console.log(`info: ${name} and ${name2} `)

  console.log("API ${name} " + name );

  axios.get('https://raw.githubusercontent.com/skalena/embrapa-mvp/main/sample-call-api.json')
 .then(function (response) {
   // handle success
   return (response);
 })
 .catch(function (error) {
   // handle error
   console.error(error);
 })

}

const api = axios.create({
  baseURL: "https://raw.githubusercontent.com/skalena/embrapa-mvp/main/sample-call-api.json",
});



export {getAPIData, api  };