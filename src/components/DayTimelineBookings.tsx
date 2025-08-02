import React, { useEffect } from 'react';
import { Bookings } from '../utils/types';
import { JSX } from 'react/jsx-runtime';
import { getMinistries } from '../utils/firebase';

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

const DayTimelineBookings: React.FC<DayTimelineProps> = ({ bookings }) => {

  const [ministries, setMinistries] = React.useState<any[]>([]);

  useEffect(() => {
    const fetchMinistries = async () => {
      const ministriesList = await getMinistries();
      setMinistries(ministriesList || []);
    };
    fetchMinistries();
  }, []);

  const renderTimeline = () => {
    const timelineElements = [];
    for (let hour = 6; hour <= 22; hour++) {
      const hourString = `${hour.toString().padStart(2, '0')}:00`;

      timelineElements.push(
        <div key={hour} className='row-start-4 min-w-12'>
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

      // const ministry = ministries.find((m) => m.id === booking.ministry);
      // const color = ministry?.color || '#ffffff';
      // const minName = ministry?.name || 'Unknown';

      const colStartClass = cssColStartlist[startHour - 6];
      const colSpanClass = cssColSpanlist[hours - 1];

      bookingElements.push(
        <div key={index} className={`overflow-hidden bg-gray-200 h-18 md:h-20 row-start-1 row-span-3 w-full p-2 rounded-lg border-1 border-gray-400 ${colStartClass} ${colSpanClass}` }>
            <div className={`flex h-full w-full items-center justify-center`}>
                <div className='text-xs md:text-sm text-gray-800 font-semibold'>
                  BOOKED              
                </div>
            </div>
        </div>
      );
    });
    return bookingElements;
  }

  
  return (
      <div className="flex w-full">
        <div className='grid grid-rows-4 grid-flow-row-dense w-full items-center'>
          {renderBookings()}
          {renderTimeline()}
        </div>
      </div>
  );
};

export default DayTimelineBookings;