import { createBrowserRouter, RouterProvider } from 'react-router'
import Home from './pages/Home';
import './App.css';
import Admin from './pages/Admin';
import Root from './pages/Root';
import AllBookings from './pages/AllBookings';
import BookRoom from './pages/BookRoom';
import RoomBookings from './pages/RoomBookings';
import SuccessfulBooking from './pages/SuccessfulBooking';
import FreeRooms from './pages/FreeRooms';
import Help from './pages/Help';

const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'admin', Component: Admin },
      { path: 'bookings',
        children: [
          {index : true, Component: AllBookings},
          {path: ':roomId', Component: BookRoom},
          {path: 'success', Component: SuccessfulBooking}
        ],
      },
      { path: 'rooms',
        children: [
          {index: true, Component: FreeRooms},
          {path: ':roomId', Component: RoomBookings}
        ]
      },
      { path: 'help',
        Component: Help
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />
}

export default App
