import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useTheme } from '../../contexts/ThemeContext';
import { useUserContext } from '../../contexts/UserContext';
import { saveToLocalStorage } from '../../utils/helpers';
import apiService from '../api/apiService';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { setUserDetails } = useUserContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            const payload = Object.fromEntries(formData.entries());
            // const response = await apiService.post("/auth/login", {
            //     username: payload.userName,
            //     password: payload.password,
            //     expiresInMins: 30,
            // });
            // const userData = response.data;
            const shortNameBase = payload.userName;
            const sessionData = {
                userName: payload.userName,
                shortName: shortNameBase[0].toUpperCase(),
            };

            setUserDetails(sessionData);
            saveToLocalStorage("user", sessionData)
            navigate("/dashboard", { replace: true });
        } catch (error) {
            console.log(error);
        }
    };

    const GoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                if (!tokenResponse?.access_token) {
                    throw new Error("No access token found in response.");
                }
                const response = await apiService.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    {
                        headers: {
                            Authorization: `Bearer ${tokenResponse.access_token}`
                        }
                    }
                );
                const userData = response.data;
                const sessionData = {
                    ...userData,
                    authType: 'google',
                    loginAt: new Date().toISOString()
                };
                let shortNameArray = userData.name.split(" ");
                let shortName = shortNameArray[0][0] + shortNameArray[1][0];
                sessionData.shortName = shortName.toUpperCase();
                saveToLocalStorage('user', sessionData);
                setUserDetails(sessionData);
                navigate('/dashboard');
            } catch (error) {
                console.error("Profile Fetch Error:", error.response?.data || error.message);
            }
        },
        onError: (errorResponse) => {
            console.error("Login Failed:", errorResponse);
            if (errorResponse.error === 'popup_closed_by_user') {
                console.warn("User closed the login window.");
            } else {
                alert("Google Sign-In was unsuccessful.");
            }
        },
        flow: 'implicit'
    });

    return (
        <div className='loginBg' data-bs-theme={theme}>
            <div className='container d-flex justify-content-center align-items-center h-100'>
                <div className='card loginCard border-0 rounded-4'>
                    <div className='row'>
                        <div className='col-md-6 d-none d-md-block loginBannerBg'>
                            <img className='img-fluid mt-5' src="/Login_Banner.png" alt='Logo image' />
                        </div>
                        <div className='col-md-6 d-flex flex-column justify-content-center'>
                            <div className='card shadow-sm p-5 rounded-4 border-0'>
                                <img className='img-fluid w-75 m-auto' src="/LogoColor.svg" alt='Logo image' />
                                <p className='text-center text-secondary'>Sign in to continue to your workspace</p>
                                <form className='w-100 my-3' onSubmit={handleSubmit}>
                                    <div className="input-group input-group shadow-sm mb-3">
                                        <span className="input-group-text border-0" id="basic-addon1"><i className="bi bi-person"></i></span>
                                        <input type="text" className="form-control border-0" id='userName' name='userName' placeholder="Example@gmail.com" aria-label="UserName" aria-describedby="basic-addon1" autoComplete='userName' required />
                                    </div>
                                    <div className="input-group input-group shadow-sm mb-3">
                                        <span className="input-group-text border-0" id="basic-addon1"><i className="bi bi-lock"></i></span>
                                        <input type={showPassword ? "text" : "password"} id='password' className="form-control border-0" name='password' placeholder="Password" aria-label="Password" aria-describedby="basic-addon1" autoComplete='current_password' required />
                                        <span className="input-group-text border-0" role="button" id="basic-addon1" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <i className="bi bi-eye"></i> : <i className="bi bi-eye-slash"></i>}</span>
                                    </div>
                                    <div className='d-flex justify-content-between mb-3'>
                                        <div className="form-check mt-2">
                                            <input className="form-check-input" type="checkbox" name='rememberme' id="checkChecked" />
                                            <label className="form-check-label" htmlFor="checkChecked">
                                                Remember me
                                            </label>
                                        </div>
                                        <button className='btn text-primary'>Forgot password?</button>
                                    </div>
                                    <div className='text-end'>
                                        <button type="submit" className="button-primary w-100 fw-bold">Login <i className="bi bi-arrow-right"></i></button>
                                    </div>
                                </form>
                                <div className='text-center w-100'>
                                    <p>Don't have an account? <Link className='text-primary' to="#">Start a free trail</Link></p>
                                    <p className='text-secondary'>Or</p>
                                    <button className='btn w-100 button-primary-outline' onClick={GoogleLogin} ><img className='img-fluid me-3 googleIcon' src="/GoogleIcon.svg" /> Sign in with Google</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
