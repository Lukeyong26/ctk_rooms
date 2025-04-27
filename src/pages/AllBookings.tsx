import { Link } from 'react-router'
import DayTimeline from '../components/DayTimeline'
import { Datepicker } from 'flowbite-react'
import { useState } from 'react';
import { JSX } from 'react/jsx-runtime';

interface Bookings {
  startTime: string;
  endTime: string;
  label: string;
}

interface Room {
  name : string;
  bookings: Bookings[];
}

const room301 : Room = {name : 'Room 301', bookings: [{ startTime: '09:00', endTime: '11:00', label: 'Pri Cat' }, { startTime: '15:00', endTime: '19:00', label: 'Youth' }] }
const room302 : Room = {name : 'Room 302', bookings: [{ startTime: '08:00', endTime: '12:00', label: 'Choir' }, { startTime: '14:00', endTime: '20:00', label: 'Youth' }] }
const mainChurch : Room = {name : 'Main Church', bookings: [{ startTime: '06:00', endTime: '11:00', label: 'Pri Cat' }, { startTime: '15:00', endTime: '19:00', label: 'Youth' }] }

const data = [
  { date: '28/04/2025', rooms: [room301, room302] },
  { date: '02/05/2025', rooms: [mainChurch, room302] },
  { date: '07/05/2025', rooms: [room302] }
]

const allRooms = ["Room 301", "Room 302", "Main Church", "RCIA Room" ];

export default function AllBookings() {

  const todaysDate = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });

  const [selectedDate, setSelectedDate] = useState(todaysDate);

  // const isSameDate = (date1String: string, date2String: string) => { 
  //   const date1 = new Date(date1String);
  //   const date2 = new Date(date2String);
  //   return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
  // }

  const getRoomsForDate = (date: string) => {
    const rooms = data.find(item => item.date === date)?.rooms || [];
    return rooms;
  }

  const renderRooms = () => {
    const tableElements: JSX.Element[] = [];
    allRooms.map((room, index) => {
      if (getRoomsForDate(selectedDate).find(r => r.name === room) !== undefined) {
        tableElements.push(
          <div key={index} className='flex flex-row w-full mb-4'>
            <Link to="/" className='w-2/12'>
              <p className='text-sm'>{room}</p>
            </Link>
            <DayTimeline events={getRoomsForDate(selectedDate).find(r => r.name === room)?.bookings || []} />
          </div>
        )
      } else {
        tableElements.push(
          <div key={index} className='flex flex-row w-full mb-4'>
            <Link to="/" className='w-2/12'>
              <p className='text-sm'>{room}</p>
            </Link>
            <DayTimeline events={[]} />
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
