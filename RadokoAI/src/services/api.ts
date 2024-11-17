import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL as string;


interface UserData {
    username: string;
    email: string;
    password: string;
    age: number;
    sex: string;
    weight: string;
    smoker: string;
    exercise_frequency: string;
    symptoms: string;
    medical_history: string;
    profile_picture: File | null;
}


interface Credentials {
    username_or_email: string;
    password: string;
}

// Interface pour le token
interface TokenResponse {
    user: any;
    user_id: number;
    token: string;
}



export const register = async (userData: Record<string, unknown>): Promise<TokenResponse> => {
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
        formData.append(key, userData[key] as string | Blob);
    });

    try {
        const response = await axios.post<TokenResponse>(`${API_URL}/api/auth/users/register/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        throw error;
    }
};



export const login = async (credentials: Record<string, unknown>): Promise<TokenResponse> => {
    try {
        const response = await axios.post<TokenResponse>(`${API_URL}/api/auth/users/login/`, credentials);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        throw error; // Relance l'erreur pour que le gestionnaire d'erreur puisse la traiter
    }
};



// Déconnexion de l'utilisateur
export const logout = async (token: string): Promise<void> => {
    try {
        await axios.post(`${API_URL}/api/auth/users/logout/`, {}, {
            headers: {
                'Authorization': `Token ${token}`
            }
        });
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        throw error; // Relance l'erreur pour que le gestionnaire d'erreur puisse la traiter
    }
};

