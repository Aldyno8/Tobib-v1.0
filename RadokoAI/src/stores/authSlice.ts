
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    isAuthenticated: boolean;
    user: Record<string, unknown> | null;
    token: string | null;
}

const initialState: AuthState = {
    isAuthenticated: !!localStorage.getItem('token'),
    user: null,
    token: localStorage.getItem('token'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess(state, action: PayloadAction<{ user: Record<string, unknown>; token: string }>) {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
        },
        registerSuccess(state, action: PayloadAction<{ user: Record<string, unknown>; token: string }>) {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
    },
});

export const { loginSuccess, logout, registerSuccess } = authSlice.actions;
export default authSlice.reducer;