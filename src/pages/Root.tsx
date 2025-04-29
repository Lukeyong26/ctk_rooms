import MainNavbar from '../components/Navbar'
import { Outlet } from 'react-router'

export default function Root() {
  return (
    <div className=''>
      <div className="justify-items-center w-full bg-gray-200">
      
        <MainNavbar/>
      </div>
      
      <div className='flex  mx-auto max-w-7xl p-4'>
        <Outlet/>
      </div>
    </div>
  )
}
