import MainFooter from '../components/MainFooter'
import MainNavbar from '../components/Navbar'
import { Outlet } from 'react-router'

export default function Root() {
  return (
    <div className='grid grid-rows-[auto_1fr_auto] h-screen'>
      <MainNavbar/>
      <div className='p-4 md:p-10'>
        <Outlet/>
      </div>
      <MainFooter />
    </div>
  )
}
