import axios from "axios";

const apicall = axios.create({
    baseURL: '/api/v1/'
});

apicall.interceptors.request.use(function (config) {
    if (window.localStorage.getItem('auth-token')) {
        config.headers['Authorization'] = 'Bearer ' + window.localStorage.getItem('auth-token');
    } else {
        if (config.headers.hasOwnProperty('Authorization')){
            delete config.headers['Authorization']
        }
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});


function setAuth(IDToken) {
    window.localStorage.setItem('auth-token', IDToken);
    apicall.defaults.headers.common['Authorization'] = 'Bearer ' + IDToken;
}
function clearAuth() {
    window.localStorage.removeItem('auth-token');
    delete apicall.defaults.headers.common['Authorization'];
}

export { apicall as axios, setAuth, clearAuth };