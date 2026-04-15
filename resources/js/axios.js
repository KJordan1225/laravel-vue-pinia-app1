import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8000'
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.withCredentials = true
axios.defaults.withXSRFToken = true

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            console.error('Unauthorized request.')
        }

        return Promise.reject(error)
    }
)

export default axios
