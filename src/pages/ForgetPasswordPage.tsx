import React, { useState } from 'react';
import {sendPasswordResetEmail} from 'firebase/auth';
import { auth } from '../utils/firebase';

const ForgetPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendPasswordResetEmail(auth, email);
        setMessage(`A reset link will be sent to ${email}`);
        setEmail('');
    };

    return (
        <div className='max-w-md mx-auto p-6 border rounded-2xl'>
            <h2 className='font-bold text-2xl'>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <div className='my-4'>
                    <label className='input' htmlFor="email">
                        <span className='label'>Email:</span>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button className='btn' type="submit">Send Reset Link</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ForgetPasswordPage;