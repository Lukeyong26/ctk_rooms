import { Link } from 'react-router'
import DayTimeline from '../components/DayTimeline'
import { Datepicker } from 'flowbite-react'
import { useState } from 'react';
import { JSX } from 'react/jsx-runtime';
import { Bookings, Room } from '../utils/types';

export default function AllBookings() {

  const todaysDate = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });

  const [selectedDate, setSelectedDate] = useState(todaysDate);
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [todaysBookings, setTodaysBookings] = useState<Bookings[]>([]);


  const renderRooms = () => {
    const tableElements: JSX.Element[] = [];
    allRooms.map((room, index) => {
      if (true) {
        tableElements.push(
          <div key={index} className='flex flex-row w-full mb-4'>
            <Link to="/" className='w-2/12'>
              <p className='text-sm'>Room</p>
            </Link>
            <DayTimeline bookings={[]} />
          </div>
        )
      } else {
        tableElements.push(
          <div key={index} className='flex flex-row w-full mb-4'>
            <Link to="/" className='w-2/12'>
              <p className='text-sm'>Room</p>
            </Link>
            <DayTimeline bookings={[]} />
          </div>
        )
      }
    });

    return tableElements;
  }

  return (
    <div className='w-full p-4'>
      <div className='w-1/4 mb-4'>
        <Datepicker onChange={(e)=>{
          if (e) {
            const date = new Date(e).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });
            setSelectedDate(date);
          }
        }}/>
      </div>
      {
        renderRooms()
      }

    </div>
  )
}
