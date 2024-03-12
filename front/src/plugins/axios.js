import axios from 'axios'

const setAuthHeaderToken = (token) => {
    axios.defaults.headers.common["Authorization"] = token
}

const clearAuthHeaderToken = () => axios.defaults.headers.common["Authorization"] = ''

export {setAuthHeaderToken, clearAuthHeaderToken}