import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { login } from '../../utils/firebase_auth';
// import GoogleLoginButton from '../../components/icons/GoogleLoginSVG';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const nav = useNavigate();

    const handleEmailLogin = (e: React.FormEvent) => {
        e.preventDefault();
        login(email, password)
        nav('/');
    };

    // const handleGoogleLogin = () => {
    //     signupWithGoogle().then(() => {
    //         nav('/');
    //     }).catch((error) => {
    //         console.error("Error signing in with Google: ", error);
    //     });
    // };

    return (
        <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg">
            <h2 className="text-center font-semibold text-2xl mb-5">Login</h2>
            <form onSubmit={handleEmailLogin}>
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-1 text-sm font-medium">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="input input-bordered w-full p-2 border border-gray-300 rounded-md"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block mb-1 text-sm font-medium">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="input input-bordered w-full p-2 border border-gray-300 rounded-md"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="btn w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                    Login
                </button>
            </form>

            {/* <button
                onClick={handleGoogleLogin}
                className="btn w-full border-0 py-2 mt-4 bg-[#F2F2F2] text-[#1F1F1F] rounded-md hover:pointer-coarse:"
            >
                <GoogleLoginButton />
                
            </button>
            <div className="divider my-4">or</div>
            <p className="text-center mb-2">Don't have an account?</p>
            <Link to="/auth/signup">
                <button className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
                    Sign Up
                </button>
            </Link> */}
            
        </div>
    );
};

export default LoginPage;