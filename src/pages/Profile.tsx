import { useNavigate } from 'react-router';
import { logout } from '../utils/firebase_auth';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { useAuthStore } from '../utils/store';
import { getBookingsByEmail } from '../utils/firebase';
import { useEffect, useState } from 'react';
import { Bookings } from '../utils/types';
import PaginatedList from '../components/PaginatedList';

export default function Profile() {

  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.isAdmin? "admin" : "user");
  const ministry = useAuthStore((state) => state.ministry);
  const [userBookings, setUserBookings] = useState<Bookings[]>([]);
  
  const nav = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      if (user) {
        if (user.email) {
          const bookings = await getBookingsByEmail(user.email);
          console.log("User bookings fetched: ", bookings);
          setUserBookings(bookings);
        }
      }
    };
    fetchBookings();
  }, [user]);

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
      <div className="flex flex-col md:flex-row w-full p-6 border border-gray-300 rounded-lg">
        <div className='p-2'>
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <div className="flex flex-col mb-4">
            <label htmlFor="name" className="label text-sm font-medium text-gray-700">
              Ministry:
              <p className="my-1 text-sm text-gray-900">{ministry || "No name provided"}</p>
            </label>
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
            <button className="btn" onClick={handleResetPassword}>Reset Password</button>
            <button className="btn" onClick={handleSignOut}>Sign Out</button>
          </div>
        </div>
        
        
        <div className='p-2'>
          <h2 className="text-2xl font-bold mb-4">Your Bookings</h2>
          {userBookings.length > 0 ? (
            <div className='w-full'>
              <PaginatedList bookings={userBookings} />
            </div>
          ) : (
            <p>No bookings found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

