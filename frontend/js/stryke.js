const appName = 'myreceipts'; // alphanumeric only...
const authTokenName = 'gstoken-' + appName;

function isUserLoggedIn () {
  const token = localStorage.getItem(authTokenName);
  
  return (token !== null && token !== undefined);
}

async function strykeLogin(username, password) {
  const API_ROOT = "https://api.stryke.io/v0/";
  const APP_ROOT = API_ROOT + appName + "/";
  
  let loginResult = 'done';

  const settings = {
    method: "post",
    url: APP_ROOT + "auth/login",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Basic " + btoa(username + ":" + password)
    }
  };
  try {
    const response = await axios(settings);
    if (response && response.headers && response.headers.authorization) {
      const token = response.headers.authorization;
      console.log("Stryke token: " + token);
      localStorage.setItem(authTokenName, token); 
      loginDone = true;
    }
  } catch (e) {         
    handleError(e);
  }
  
  console.error("login result: " + loginResult);
  return loginResult; 
}

async function strykeLogout() {
    const API_ROOT = "https://api.stryke.io/v0/";
    const APP_ROOT = API_ROOT + appName + "/";
  
    const token = localStorage.getItem(authTokenName);        
  
    const settings = {
      method: "post",
      url: APP_ROOT + "auth/logout",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token
      }
    };
    try {
      const response = await axios(settings);
      if (response) {        
        console.log('Logged out!');
        localStorage.removeItem('gstoken');        
      }     
    } catch (e) {
      handleError(e);
    }
  }

async function getAppName() {
  return 'myreceipts';
}


async function strykePost(endpointPath, data) {  
  const fullUrl = "https://api.stryke.io/v0/" + appName+ "/" + endpointPath;    
  const strykeToken = localStorage.getItem(authTokenName);
  
  let response;
  
  const requestOptions = {    
    method: "post",
    url: fullUrl,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: strykeToken
    },
    data
  };
  try {
    response = await axios(requestOptions);             
  } catch (e) {    
    handleError(e);
  }
  
  return response;
}

async function strykeGet(endpointPath) {  
  const fullUrl = "https://api.stryke.io/v0/" + appName+ "/" + endpointPath;    
  const strykeToken = localStorage.getItem(authTokenName);
  
  let response;
  
  const requestOptions = {    
    method: "get",
    url: fullUrl,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: strykeToken
    }
  };
  try {
    response = await axios(requestOptions);          
  } catch (e) {    
    handleError(e);
  }
  
  return response;
}

function handleError(e) {  
  
  let message = "Request to Stryke failed!";

  console.error("Request to Stryke failed: " + e.message);    
  if (e.response) {
    if (e.response.status === 401) {
      console.error("Auth failed will remove token");    
      localStorage.removeItem(authTokenName);
      message = 'Authentication failed';
    }  

    if (e.response.data && e.response.data.message) {      
      console.error("Request to Stryke failed with message: " + e.response.data.message); 
      message = e.response.data.message;
    }    
  }
  
  e.message = message;
  throw e;
}