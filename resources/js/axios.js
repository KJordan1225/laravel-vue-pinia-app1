import axios from 'axios'

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
    },
})

export async function ensureCsrfCookie() {
    await api.get('/sanctum/csrf-cookie')
}

api.interceptors.response.use(
    response => response,
    error => {
        return Promise.reject(error)
    }
)

export default api