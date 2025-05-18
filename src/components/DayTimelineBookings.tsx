import React from 'react';
import { Bookings } from '../utils/types';
import { JSX } from 'react/jsx-runtime';

interface DayTimelineProps {
  bookings: Bookings[];
  showPopup?: boolean;
}

const cssColStartlist = [
  'col-start-1','col-start-2','col-start-3','col-start-4','col-start-5','col-start-6','col-start-7','col-start-8',
  'col-start-9','col-start-10','col-start-11','col-start-12','col-start-13','col-start-14','col-start-15','col-start-16',
];

const cssColSpanlist = [
  'col-span-1','col-span-2','col-span-3','col-span-4','col-span-5','col-span-6','col-span-7','col-span-8',
  'col-span-9','col-span-10','col-span-11','col-span-12','col-span-13','col-span-14','col-span-15','col-span-16',
];

const randomColor = [
  'bg-[#B3C8CF]','bg-[#D1E7DD]','bg-[#F8D7DA]','bg-[#FFF3CD]','bg-[#CFE2FF]',
  'bg-[#F9F9F9]','bg-[#D9EAD3]','bg-[#EAD1DC]','bg-[#D0E0E3]','bg-[#FFE6CC]',
  'bg-[#F4CCCC]','bg-[#CFE2F3]','bg-[#EAD1DC]','bg-[#B6D7A8]','bg-[#C9DAF8]',
]

const DayTimelineBookings: React.FC<DayTimelineProps> = ({ bookings }) => {
  const renderTimeline = () => {
    const timelineElements = [];
    for (let hour = 6; hour <= 22; hour++) {
      const hourString = `${hour.toString().padStart(2, '0')}:00`;

      timelineElements.push(
        <div key={hour} className='row-start-2 min-w-12'>
          <p className='text-xs md:text-sm'>{hourString}</p>
        </div>
      );
    }
    return timelineElements;
  };

  const renderBookings = () => {
    const bookingElements: JSX.Element[] = [];
    bookings.forEach((booking, index) => {
      const startHour = parseInt(booking.startTime.split(':')[0], 10);
      const hours = parseInt(booking.endTime.split(':')[0], 10) - startHour;

      const randomNumber = Math.floor(Math.random() * randomColor.length);

      const colStartClass = cssColStartlist[startHour - 6];
      const colSpanClass = cssColSpanlist[hours - 1];

      bookingElements.push(
        <div key={index} className={`row-start-1 w-full h-6 ${colStartClass} ${colSpanClass}` }>
            <div className={`flex h-full w-full ${randomColor[randomNumber]} items-center justify-center rounded-lg border-1 border-gray-400`}>
                <div className='text-xs md:text-sm text-black font-semibold'>
                    <div>{booking.bookedBy}</div>
                </div>
            </div>
        </div>
      );
    });
    return bookingElements;
  }

  
  return (
      <div className="flex w-full mt-2">
        <div className='grid grid-rows-2 grid-flow-row-dense w-full items-center'>
          {renderBookings()}
          {renderTimeline()}
        </div>
      </div>
  );
};

export default DayTimelineBookings;