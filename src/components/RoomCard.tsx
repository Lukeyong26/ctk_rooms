import { Button } from 'flowbite-react';
import React from 'react';
import DayTimeline from './DayTimeline';
import { Bookings } from '../utils/types';

interface RoomCardProps {
  id: string;
  imageUrl: string;
  title: string;
  desc: string;
  bookings?: Bookings[];
}

const RoomCard: React.FC<RoomCardProps> = ({ id, imageUrl, title, desc, bookings }) => {

  // const todaysDate = new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' });

  return (
    <div className='relative bg-gray-200 h-72 w-full dark:bg-gray-900'>
      <div className='relative h-6/8 w-full'>
        <div className='absolute z-1 flex flex-row w-full h-full'>
          <div className='p-4 text-white'>
            <h2 className='text-2xl md:text-4xl'>{title}</h2>
            <h3 className='text-lg md:text-2xl'>{desc}</h3>
          </div>
          <div className='flex flex-col h-full gap-2 p-4 ml-auto'>
            <Button href={'room/'+id} className='bg-gray-900 dark:bg-gray-900 text-white h-full' >
              Room Bookings
            </Button>
            <Button href={'bookings/'+id} className='bg-blue-800 dark:bg-gray-900 text-white h-full'>
              Book Room
            </Button>
          </div>
        </div>
        <img 
            src={imageUrl} alt={title} 
            className=' object-cover w-full h-full brightness-50'
        />
      </div>
      {/* <div className='w-full h-0/8 bg-blue-800' /> */}
      <div className='relative flex flex-row items-center justify-center h-2/8 p-4 w-full'>
        <p className='text-xs font-semibold w-20'>Days Bookings:</p>
        <DayTimeline showPopup bookings={bookings || []} />
      </div>
    </div>
  );
};

export default RoomCard;