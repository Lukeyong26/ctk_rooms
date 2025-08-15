import React, { useEffect, useState } from 'react';
import { Bookings } from '../../utils/types';

interface TimePrickerProps {
  bookings: Bookings[],
  setStartTime: (time: string) => void,
  setEndTime: (time: string) => void,
}

const TimePicker: React.FC<TimePrickerProps> = ({bookings, setStartTime, setEndTime}) => {

  const [startTime, setStartTimeState] = useState<string>('');
  const [endTime, setEndTimeState] = useState<string>('');
  const [pickEndTime, setPickEndTime] = useState<boolean>(false);

  useEffect(() => {
    if (startTime && endTime) {
      validateTime(startTime, endTime);
    }
  }, [endTime]);


  const validateTime = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) {
      return;
    }

    console.log("validating time", startTime, endTime)

    const isRoomBooked = bookings.some((booking) => {
      return (startTime < booking.endTime && endTime > booking.startTime);
    });
  
    if (isRoomBooked) {
      const modal = document.getElementById('bookedRoomModal');
      if (modal) {
        (modal as HTMLDialogElement).showModal();
      }
      setStartTimeState('');
      setEndTimeState('');
      setPickEndTime(false);
      return;
    }

    if (startTime >= endTime) {
      const modal = document.getElementById('startTimeModal');
      if (modal) {
        (modal as HTMLDialogElement).showModal();
      }
      setStartTimeState('');
      setEndTimeState('');
      setPickEndTime(false);
      return;
    }

    if (startTime === endTime) {
      setStartTimeState('');
      setEndTimeState('');
      setPickEndTime(false);
      return;
    }

    setStartTime(startTime);
    setEndTime(endTime);
  }

  const handleStartTimeChange = (time: string) => {
    setStartTimeState(time);
    setPickEndTime(true);
  };
  const handleEndTimeChange = (time: string) => {
    setEndTimeState(time);
  };

  const isHourInRange = (hour: string, startTime: string, endTime: string): boolean => {
    const hourDate = new Date(`1970-01-01T${hour}:00`);
    const startDate = new Date(`1970-01-01T${startTime}`);
    const endDate = new Date(`1970-01-01T${endTime}`);
    return hourDate >= startDate && hourDate < endDate;
  };

  const renderTimeSlots = () => {
    const timeSlots = [];
    for (let hour = 6; hour < 22; hour++) {
      const hourString = `${hour.toString().padStart(2, '0')}:00`;
      const hourPlusOne = `${(hour + 1).toString().padStart(2, '0')}:00`;
      const isEventHour = bookings.some(booking => ((isHourInRange(hourString, booking.startTime, booking.endTime))));
      if (!pickEndTime) {
        timeSlots.push(
          <button key={hour} onClick={() => {
            handleStartTimeChange(hourString);
            const endHour = hour + 1;
            const endHourString = `${endHour.toString().padStart(2, '0')}:00`;
            handleEndTimeChange(endHourString);
          }} disabled={isEventHour} className='btn p-1'>
            {hourString + " - " + hourPlusOne}
          </button>
        );
      } else {
        timeSlots.push(
          <button type='button' key={hour} onClick={() => {
            const endHour = hour + 1;
            const endHourString = `${endHour.toString().padStart(2, '0')}:00`;
            handleEndTimeChange(endHourString)
          }} disabled={isEventHour} className={`btn p-1 ${startTime === hourString || isHourInRange(hourString, startTime, endTime)? 'bg-green-300' : ''}`}>
            {hourString + " - " + hourPlusOne}
          </button>   
        );
      }
      
    }
    return timeSlots;
  }

  return (
    <div>
      <div className="flex flex-row gap-2 mb-4 w-full">
        <div className='flex flex-col md:flex-row gap-2 w-full'>
          <label className="flex flex-row items-center gap-2 w-1/2">
            <span className="label">Start Time:</span>
            <p className="text-lg">{startTime}</p>
          </label>
          <label className="flex flex-row items-center gap-2 w-1/2">
            <span className="label">End Time:</span>
            <p className="text-lg">{endTime}</p>
          </label>
        </div>
        
        <button type='button' className='btn' onClick={() => {
          setStartTimeState('');
          setEndTimeState('');
          setPickEndTime(false);
        }}>Reset</button>
      </div>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-1'>
      {renderTimeSlots()}
      </div>

      {/* Alert Modals for Errors */}
      <dialog id="bookedRoomModal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Sorry!</h3>
          <p className="py-4">Room is already booked for that timeslot.</p>
        </div>
      </dialog>

      <dialog id="startTimeModal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Sorry!</h3>
          <p className="py-4">The End time must be after the Start time.</p>
        </div>
      </dialog>
      
    </div>
    
  );
};

export default TimePicker;