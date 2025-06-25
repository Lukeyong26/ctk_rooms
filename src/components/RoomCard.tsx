import React from 'react';
import DayTimeline from './DayTimeline';
import { Bookings } from '../utils/types';
import { Link } from 'react-router';

interface RoomCardProps {
  id: string;
  imageUrl: string;
  title: string;
  desc: string;
  bookings?: Bookings[];
}

const RoomCard: React.FC<RoomCardProps> = ({ id, imageUrl, title, desc, bookings }) => {
  return (
    <div className='relative bg-sub h-80 w-full dark:bg-gray-900 rounded-lg shadow-lg shadow-gray-400 dark:shadow-gray-950'>
      <div className='relative h-6/8 w-full'>
        <div className='absolute z-1 flex flex-col w-full h-full'>
          <div className='p-4 text-gray-200 w-2/3'>
            <h2 className='text-2xl md:text-4xl'>{title}</h2>
            <h3 className='text-lg md:text-2xl'>{desc}</h3>
          </div>
          <div className='flex flex-col p-4 w-full h-full mt-auto text-gray-200 overflow-x-auto'>
            <p className='text-xs font-semibold w-full mr-auto mb-auto'>Bookings:</p>
            <DayTimeline showPopup bookings={bookings || []} />
          </div>
        </div>
        <img 
            src={imageUrl} alt={title} 
            className=' object-cover w-full h-full brightness-50 rounded-lg'
        />
      </div>
      {/* <div className='w-full h-0/8 bg-blue-800' /> */}
      
      <div className='flex flex-row h-2/8 gap-2 p-4 w-full'>
        <Link to={'/rooms/'+id} className='h-full w-full'><button className="btn w-full h-full bg-mainLight shadow-sm">See Room Bookings</button></Link>
        <Link to={'/bookings/'+id} className='h-full w-full'><button className="btn w-full h-full bg-mainLight shadow-sm">Book Room</button></Link>
      </div>
    </div>
  );
};

export default RoomCard;