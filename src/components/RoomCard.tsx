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
    <div className='relative p-2 h-80 w-full shadow-sm shadow-gray-500 rounded-lg'>
      <div className='relative h-6/8 w-full text-gray-200 '>
        <div className='absolute z-1 flex flex-col w-full h-full'>
          <div className='p-4 w-2/3'>
            <h2 className='text-2xl md:text-4xl'>{title}</h2>
            <h3 className='text-lg md:text-2xl'>{desc}</h3>
          </div>
          <div className='flex flex-col p-4 w-full h-full mt-auto overflow-x-auto'>
            <p className='text-xs font-semibold w-full mr-auto mb-auto'>Bookings:</p>
            <DayTimeline showPopup bookings={bookings || []} />
          </div>
        </div>
        <img 
            src={imageUrl} alt={title} 
            className='object-cover bg-main w-full h-full brightness-70 rounded-lg'
            onError={({currentTarget}) => {
              currentTarget.onerror = null; // Prevent infinite loop if image fails to load
              currentTarget.src = 'https://buildingontheword.org/files/2019/09/cross-2.jpg'
            }}
        />
      </div>
      {/* <div className='w-full h-0/8 bg-blue-800' /> */}
      
      <div className='flex flex-row h-2/8 gap-2 pt-2 w-full'>
        <Link to={'/rooms/'+id} className='h-full w-full'><button className="btn rounded-lg w-full h-full border-0 bg-sub dark:bg-subDark shadow-sm">See Room Bookings</button></Link>
        <Link to={'/bookings/'+id} className='h-full w-full'><button className="btn rounded-lg w-full h-full border-0 bg-sub dark:bg-subDark shadow-sm">Book Room</button></Link>
      </div>
    </div>
  );
};

export default RoomCard;