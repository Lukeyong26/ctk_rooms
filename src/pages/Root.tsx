import MainFooter from '../components/MainFooter'
import MainNavbar from '../components/Navbar'
import { Outlet } from 'react-router'
import { auth, getUserMinistry } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUserRole, getMinistries, getRoomsList } from "../utils/firebase";
import { useAuthStore, useGeneralStore } from '../utils/store';
import { useEffect } from 'react';

export default function Root() {

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      useAuthStore.getState().setUser(user);
      const userRole = await getUserRole(user.uid);
      if (userRole === "admin") {
        useAuthStore.getState().setIsAdmin(true);
      }
      const userMinistry = await getUserMinistry(user.email? user.email : "");
      useAuthStore.getState().setMinistry(userMinistry);
    } else {
      useAuthStore.getState().setIsAdmin(false);
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const rooms = await getRoomsList();
      useGeneralStore.getState().setRooms(rooms);
      const ministries = await getMinistries();
      useGeneralStore.getState().setMinistries(ministries);
    };
    fetchData();
  }, []);

  return (
    <div className='grid grid-rows-[auto_1fr_auto] h-screen w-full'>
      <MainNavbar/>
      <div className='flex w-full justify-center bg-surface dark:bg-surfaceDark'>
        <div className='p-4 md:p-10 max-w-[1200px] w-full'>
          <Outlet/>
        </div>
      </div>
      <MainFooter />
    </div>
  )
}
