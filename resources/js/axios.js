import axios from 'axios'

const api = axios.create({
    baseURL: '/',
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
})

export async function ensureCsrfCookie() {
    await api.get('/sanctum/csrf-cookie')
}

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            console.error('Unauthorized request.')
        }

        return Promise.reject(error)
    }
)

export default api
