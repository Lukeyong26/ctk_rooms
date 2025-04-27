import React from 'react';

interface Event {
  startTime: string;
  endTime: string;
  label: string;
}

interface DayTimelineProps {
  events: Event[];
  showPopup?: boolean;
}

const isHourInRange = (hour: string, startTime: string, endTime: string): boolean => {
  const hourDate = new Date(`1970-01-01T${hour}:00`);
  const startDate = new Date(`1970-01-01T${startTime}`);
  const endDate = new Date(`1970-01-01T${endTime}`);
  return hourDate >= startDate && hourDate <= endDate;
};

const DayTimeline: React.FC<DayTimelineProps> = ({ events, showPopup }) => {
    const renderTimeline = () => {
        const timelineElements = [];
        for (let hour = 6; hour < 23; hour++) {
            const hourString = `${hour.toString().padStart(2, '0')}:00`;
            const isEventHour = events.some(event => isHourInRange(hourString, event.startTime, event.endTime));
            const label = events.find(event => isHourInRange(hourString, event.startTime, event.endTime))?.label || null;
            timelineElements.push(
                <div key={hour} className='w-full'>
                  <div key={hour} className={`group flex h-5 border-1 border-gray-500 ${isEventHour ? 'bg-blue-800' : ''}`}>
                    {
                      showPopup ? (
                      label && <div className='group-hover:opacity-100 group-active:opacity-100 transition-all opacity-0 bg-amber-400 absolute left-0 -translate-y-32 m-4 p-4 rounded-sm'>
                        <p className='text-black text-sm'>BOOKED BY: </p>
                        <p className='text-red-700 text-lg'>{label}</p>
                      </div>) : null
                    }
                  </div>
                  <p className='p-1 ml-1 mr-1 text-center text-xs md:text-sm'>{hourString}</p>
                </div>
                
            );
        }
        return timelineElements;
    };
    
    return (
        <div className="flex flex-row w-full overflow-auto">
            {renderTimeline()}
        </div>
    );
};

export default DayTimeline;