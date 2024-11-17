import { createContext, useReducer, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { login, register, logout } from '@/services/api';
import { loginSuccess, logout as logoutAction, registerSuccess } from '@/stores/authSlice';

// Updated state interface
interface AuthState {
    isAuthenticated: boolean;
    user: Record<string, unknown> | null;
    token: string | null;
}

// Updated action types
interface AuthAction {
    type: 'LOGIN_SUCCESS' | 'LOGOUT' | 'REGISTER_SUCCESS' | 'SET_USER';
    payload?: {
        user?: Record<string, unknown>;
        token?: string;
    };
}

// Updated context interface
interface AuthContextType {
    state: AuthState;
    loginUser: (credentials: Record<string, unknown>) => Promise<void>;
    registerUser: (userData: Record<string, unknown>) => Promise<void>;
    logoutUser: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial state
const initialState: AuthState = {
    isAuthenticated: !!localStorage.getItem('token'), // Check token in localStorage
    user: null,
    token: localStorage.getItem('token'), // Load token from localStorage
};

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
        case 'REGISTER_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload?.user || null,
                token: action.payload?.token || null,
            };
        case 'LOGOUT':
            localStorage.removeItem('token'); // Remove token on logout
            return initialState; // Reset to initial state on logout
        default:
            return state;
    }
};

// AuthProvider props interface
interface AuthProviderProps {
    children: ReactNode;
}

// AuthProvider component
const AuthProvider = ({ children }: AuthProviderProps) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const reduxDispatch = useDispatch();

    const loginUser = async (credentials: Record<string, unknown>): Promise<{ token?: string; user?: Record<string, unknown>; error?: string } | null> => {
        try {
            const data = await login(credentials);
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.user_id);
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: data
                });
                reduxDispatch(loginSuccess({ user: { id: data.user_id }, token: data.token }));

                return { token: data.token, user: { id: data.user_i } };
            } else {
                return { error: 'Invalid credentials' }; // Exemple d'erreur
            }
        } catch (error: any) {
            console.error('Login failed:', error);
            return { error: error.response?.data?.error || 'Unknown error' };
        }
    };

    // Register function
    const registerUser = async (userData: Record<string, unknown>) => {
        try {
            const data = await register(userData);
            if (data.token) {
                localStorage.setItem('token', data.token); // Store token in localStorage
                localStorage.setItem('userId', data.user.id);
                dispatch({ type: 'REGISTER_SUCCESS', payload: data });
                reduxDispatch(registerSuccess({ user: { id: data.user.id }, token: data.token }));
            }
            return { token: data.token, user: { id: data.user.id } };
        } catch (error: any) {
            console.error('Registration failed:', error.response?.data || error);
            return { error: error.response?.data || { message: 'An unknown error occurred.' } };
        }
    };

    // Logout function
    const logoutUser = async () => {
        try {
            await logout(state.token!);
            dispatch({ type: 'LOGOUT' });
            reduxDispatch(logoutAction());
            return true;
        } catch (error) {
            console.error('Logout failed:', error);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ state, loginUser, registerUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export { AuthContext, AuthProvider };