import { Button } from 'flowbite-react';
import React from 'react';
import DayTimeline from './DayTimeline';

interface RoomCardProps {
    imageUrl: string;
    title: string;
    onBook: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ imageUrl, title, onBook }) => {

  const todaysDate = new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' });

  return (
    <div className='relative bg-gray-900 h-72 w-full'>
      <div className='h-4/6 w-full'>
        <div className='absolute z-1 flex flex-row w-full'>
          <div className='p-4'>
            <h2 className='text-4xl'>{title}</h2>
            <h3 className=' text-2xl'>Level 3 room </h3>
          </div>
          <div className='flex flex-col gap-2 p-4 ml-auto'>
            <Button onClick={onBook}>
              View Room Bookings
            </Button>
            <Button color="yellow" onClick={onBook}>
              Book Room
            </Button>
          </div>
        </div>
        <img 
            src={imageUrl} alt={title} 
            className=' object-cover w-full h-full brightness-50'
        />
      </div>
      <div className='relative flex flex-row items-center justify-center h-2/6 p-4 w-full'>
        <p className='text-sm'>{todaysDate}</p>
        <DayTimeline showPopup events={[ { startTime: '09:00', endTime: '11:00', label: 'Pri Cat' }, { startTime: '15:00', endTime: '19:00', label: 'Youth' }, ]} />
      </div>
    </div>
  );
};

export default RoomCard;