import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Provider} from 'react-redux';
import {store} from './stores';
import {AuthProvider} from './context/AuthContext';
import MainLayout from "./layout/MainLayout.tsx";
import Symptoms from "./pages/Symptoms.tsx";
import Chats from "./pages/Chats.tsx";
import Advices from "./pages/Advices.tsx";
import AuthLayout from "@/layout/AuthLayout.tsx";
import Home from '@/pages/auth/Home.tsx';
import Login from "@/pages/auth/Login.tsx"
import Register from "@/pages/auth/Register.tsx";
import UserProfile from "@/pages/UserProfile";
import {ThemeProvider} from "@/context/ThemeContext";
import WeeklyExercises from './pages/Exercises.tsx';

function App() {
    return (
        <Provider store={store}>
            <ThemeProvider>
                <AuthProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route element={<AuthLayout />}>
                                <Route path={"/"} element={<Home />} />
                                <Route path={"/login"} element={<Login />} />
                                <Route path={"/register"} element={<Register />} />
                            </Route>
                            <Route element={<MainLayout />}>
                               
                        
                                <Route path="/advices" element={<Advices />} /> 
                          
                                <Route path="/symptoms" element={<Symptoms />}/>
                                <Route path="/exercices" element={<WeeklyExercises/>} />
                                <Route path="/chats" element={<Chats />} />
                                <Route path={"/profile"} element={<UserProfile />} />
                          
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </AuthProvider>
            </ThemeProvider>
        </Provider>
    );
}

export default App;