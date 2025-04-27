import MainFooter from '../components/MainFooter'
import MainNavbar from '../components/Navbar'
import { Outlet } from 'react-router'

export default function Root() {
  return (
    <div>
      <div className='min-h-[calc(100vh-140px)]'>
        <MainNavbar />
        <div className='flex mx-auto max-w-7xl p-4'>
          <Outlet/>
        </div>
        
      </div>
      <MainFooter />
    </div>
    
  )
}
