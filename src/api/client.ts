import axios from 'axios'
import router from '@/router'
import {useAuthStore} from '@/stores/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true,
  headers: { 'ngrok-skip-browser-warning': 'true' },
})


api.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem('access_token')
    if (access_token) {
      config.headers['Authorization'] = `Bearer ${access_token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore()
    const originalRequest = error.config

    if (!error.response){
      return Promise.reject(error)
    }
    const isUnauthorized = error.response.status === 401
    const isRefreshRequest = originalRequest.url?.includes('/account/refresh/')
    const isLoginRequest = originalRequest.url?.includes('/account/login/')

    if (isUnauthorized &&
        !originalRequest._retry &&
        !isRefreshRequest &&
        !isLoginRequest
    ){
      originalRequest._retry = true

      try{
        const newAccessToken = await authStore.refreshAccessToken()

        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return api(originalRequest)
      }catch(err){
        localStorage.removeItem('access_token')

        delete api.defaults.headers.common.Authorization

        const currentPath = window.location.pathname
        if(currentPath !== '/signin'){
          router.push('/signin')
        }
        return Promise.reject(err)
      }
    }
    return Promise.reject(error)
  },
)

export default api
