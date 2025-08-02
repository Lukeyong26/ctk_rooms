import { useNavigate } from 'react-router';
import { logout } from '../utils/firebase_auth';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { useAuthStore } from '../utils/store';

export default function Profile() {

  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.isAdmin? "admin" : "user");
  
  const nav = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
      console.log("User signed out");
      nav("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleResetPassword = async () => {
    if (user) {
      const email = user.email;
      if (email) {
        await sendPasswordResetEmail(auth,email);
        alert("Password reset email sent!");
      } else {
        alert("No email found for the user.");
      }
    } else {
      alert("No user is currently signed in.");
    }
  }

  return (
    <div>
      <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <div className="flex flex-col mb-4">
          <label htmlFor="email" className="label text-sm font-medium text-gray-700">
            Email:
            <p className="my-1 text-sm text-gray-900">{user?.email}</p>
          </label>
          <label htmlFor="email" className="label text-sm font-medium text-gray-700">
            Role:
            <p className="my-1 text-sm text-gray-900">{role?.toUpperCase()}</p>
          </label>
        </div>
        <div className='flex flex-row gap-2'>
          <button className="btn" onClick={handleSignOut}>Sign Out</button>
          <button className="btn" onClick={handleResetPassword}>Reset Password</button>
        </div>
      </div>
    </div>
  )
}
