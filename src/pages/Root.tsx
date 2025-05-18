import MainFooter from '../components/MainFooter'
import MainNavbar from '../components/Navbar'
import { Outlet } from 'react-router'

export default function Root() {
  return (
    <div className='grid grid-rows-[auto_1fr_auto] h-screen w-full'>
      <MainNavbar/>
      <div className='flex w-full justify-center'>
        <div className='p-4 md:p-10 max-w-[1200px] w-full'>
          <Outlet/>
        </div>
      </div>
      <MainFooter />
    </div>
  )
}
