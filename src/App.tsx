import { createBrowserRouter, RouterProvider } from 'react-router'
import Home from './pages/Home';
import './App.css';
import Admin from './pages/Admin';
import Root from './pages/Root';
import BookRoom from './pages/BookRoom';
import RoomBookings from './pages/RoomBookings';
import SuccessfulBooking from './pages/SuccessfulBooking';
import FreeRooms from './pages/FreeRooms';
import LoginPage from './pages/auth/Login';
import Profile from './pages/Profile';
import CalendarPage from './pages/CalendarPage';
import WeeklyBookingView from './pages/WeeklyViewPage';
import ForgetPasswordPage from './pages/ForgetPasswordPage';

const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'admin', Component: Admin },
      { path: 'calendar', Component: CalendarPage},
      { path: 'weekly', Component: WeeklyBookingView},
      { path: 'bookings',
        children: [
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
      { path: 'profile',
        Component: Profile
      },
      {
        path: 'auth',
        children: [
          {path: 'login', Component: LoginPage},
          {path: 'reset-password', Component: ForgetPasswordPage}
        ]
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />
}

export default App
