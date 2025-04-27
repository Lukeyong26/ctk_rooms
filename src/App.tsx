import { createBrowserRouter, RouterProvider } from 'react-router'
import Home from './pages/Home';
import './App.css';
import Admin from './pages/Admin';
import Root from './pages/Root';
import AllBookings from './pages/AllBookings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: '/admin', element: <Admin /> },
      { path: '/bookings', element: <AllBookings /> },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />
}

export default App
