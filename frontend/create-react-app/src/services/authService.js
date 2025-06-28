import api from './api';

console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
const API_URL = `${import.meta.env.VITE_API_URL}/auth`;


const register = async (username, email, password, role = 'student') => {
    try {
        const response = await api.post(`/auth/register`,{ username, email, password, role});

        if (response.data.token) {
            localStorage.setItem('token',response.data.token);
              // 🔥 Extract role from JWT and save it
            localStorage.setItem('role', role);  // modify kiye kyunki create course ka option ny aa ra tha
        }
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || 'Registration failed';
    }
    
};

const login = async (email, password) => {
    try{
        const response = await api.post(`/auth/login`, {email, password});
        if (response.data.token) {
            localStorage.setItem ('token', response.data.token);
            // 🔥 Extract role from JWT and save it
            const base64Payload = response.data.token.split('.')[1];
            const payload = JSON.parse(atob(base64Payload));
            const role = payload.user?.role || payload.role;
            localStorage.setItem('role', role); // yaha v modify
             

        }
       return response.data;
    }  catch( error) {
        console.error("Login error (frontend):", error);
        throw error.response.data.msg || 'Login failed';

    }
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // 🔥 Also remove the role
};

const getToken = () => localStorage.getItem('token');

const getCurrentUser = async () => {
    const token = getToken();
    if (!token)  return null;
        try {
            const base64Payload = token.split('.')[1];
        const payload = JSON.parse(atob(base64Payload));
        const user=payload.user || payload;
        return {
            ...user,
            _id: user._id || user.id
        };
        } catch {
        
    return null;
        }
};

const fetchUserProfile = async () => {
    const token = getToken();
    if (!token) return null;
    try {
        const response = await api.get(`/auth/profile`, {
            headers: { 'x-auth-token': token }
        });
        return response.data;
    } catch (error) {
        logout();
        throw error.response?.data?.msg || 'Failed to fetch user profile';
    }
};
const isLoggedIn = () => 
    getToken() !== null;

const authService = {
    register,
    login,
    logout,
    getCurrentUser,
     fetchUserProfile,
    isLoggedIn,
     getToken
};
export default authService;