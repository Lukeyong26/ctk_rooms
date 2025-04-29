import React from 'react';
import { Bookings } from '../utils/types';

interface DayTimelineProps {
  bookings: Bookings[];
  showPopup?: boolean;
}

const isHourInRange = (hour: string, startTime: string, endTime: string): boolean => {
  const hourDate = new Date(`1970-01-01T${hour}:00`);
  const startDate = new Date(`1970-01-01T${startTime}`);
  const endDate = new Date(`1970-01-01T${endTime}`);
  return hourDate >= startDate && hourDate < endDate;
};

const DayTimeline: React.FC<DayTimelineProps> = ({ bookings, showPopup }) => {
    const renderTimeline = () => {
        const timelineElements = [];
        for (let hour = 6; hour < 22; hour++) {
            const hourString = `${hour.toString().padStart(2, '0')}:00`;
            const isEventHour = bookings.some(booking => isHourInRange(hourString, booking.startTime, booking.endTime));
            const label = bookings.find(booking => isHourInRange(hourString, booking.startTime, booking.endTime))?.bookedBy || null;
            timelineElements.push(
                <div key={hour} className='w-full'>
                  {hour !== 22 ? 
                  <div key={hour} className={`flex items-center justify-center h-5 min-w-10 border-gray-500 border-1`}>
                    <div className={`group w-full h-full ${isEventHour ? 'bg-blue-800' : ''}`}>
                      {
                        showPopup ? (
                        label && <div className='group-hover:opacity-100 group-active:opacity-100 absolute transition-all opacity-0 bg-amber-400 left-0 -translate-y-32 m-4 p-4 rounded-sm'>
                          <p className='text-black text-sm'>BOOKED BY: </p>
                          <p className='text-red-700 text-lg'>{label}</p>
                        </div>) : null
                      }
                    </div>
                  </div> : <div className='h-10' />
                  }
                  <p className='text-xs md:text-sm'>{hourString}</p>
                </div>
                
            );
        }
        return timelineElements;
    };
    
    return (
        <div className="flex h-full w-full overflow-auto ">
            {renderTimeline()}
        </div>
    );
};

export default DayTimeline;