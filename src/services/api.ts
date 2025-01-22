import axios, {AxiosHeaders} from 'axios'

// Define headers that prevent caching for security-sensitive requests
const NO_CACHE_HEADERS = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
} as const;

// Helper function to identify authentication-related endpoints
const isAuthEndpoint = (url: string | undefined): boolean => {
    if (!url) return false;

    const authPaths = [
        '/api/auth/login',
        '/api/auth/register',
        '/api/auth/me',
        '/api/auth/refresh',
        '/api/auth/logout'
    ];
    return authPaths.some(path => url.includes(path));
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor handles both authentication tokens and cache headers
api.interceptors.request.use((config) => {
    // Add authentication token if available
    const token = localStorage.getItem('accessToken');

    // Create new headers instance
    const headers = new AxiosHeaders(config.headers);

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    // Add no-cache headers for authentication endpoints
    if (isAuthEndpoint(config.url)) {
        Object.entries(NO_CACHE_HEADERS).forEach(([key, value]) => {
            headers.set(key, value);
        });
    }

    config.headers = headers;

    return config;
});

// Add response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if error is 401 and it's not already a retry attempt
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Get refresh token
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Try to get new access token
                const response = await api.post('/api/auth/refresh',
                    { refreshToken },
                    { headers: NO_CACHE_HEADERS }
                );
                const { accessToken } = response.data;

                // Save new token
                localStorage.setItem('accessToken', accessToken);

                if (originalRequest.headers){
                    // Update the failed request's authorization header
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    if (isAuthEndpoint(originalRequest.url)) {
                        originalRequest.headers = {
                            ...originalRequest.headers,
                            ...NO_CACHE_HEADERS
                        };
                    }
                }

                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, clear tokens and redirect to login
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;