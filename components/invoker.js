//https://stackabuse.com/making-asynchronous-http-requests-in-javascript-with-axios/
import axios from 'axios';

function getAPIData(name) {

  axios.get('https://raw.githubusercontent.com/skalena/embrapa-mvp/main/sample-call-api.json')
 .then(function (response) {
   // handle success
   return (response);
 })
 .catch(function (error) {
   // handle error
   console.log(error);
 })

}

function getVai(callback) {

  axios.get('https://raw.githubusercontent.com/skalena/embrapa-mvp/main/sample-call-api.json')
 .then(function (response) {
   // handle success
   //return (response.data);
   callback(response.data)
 })
 .catch(function (error) {
   // handle error
   console.log(error);
 })

}

const api = axios.create({
  baseURL: "https://raw.githubusercontent.com/skalena/embrapa-mvp/main/sample-call-api.json",
});

function soAceitaPares(){
  const promise = new Promise( (resolve, reject) => { 

    axios.get('https://raw.githubusercontent.com/skalena/embrapa-mvp/main/sample-call-api.json')
    .then(function (response) {
      // handle success
      //return (response.data);
      resolve(response.data);
    })
    .catch(function (error) {
      // handle error
      reject(new Error("Deu merda!"));
      console.log(error);
    })
 
                  });
  return promise;
}




export {getAPIData, getVai, api, soAceitaPares};