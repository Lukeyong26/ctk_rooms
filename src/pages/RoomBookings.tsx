import { useParams } from "react-router"
import { getBookingsByDateRange, getBookingsByDateRangeAndRoom, getRoomById } from "../utils/firebase";
import { useEffect, useState } from "react";
import { Room } from "../utils/types";
import DayTimelineBookings from "../components/DayTimelineBookings";
    
export default function RoomBookings() {

  const todayDate = new Date().toISOString().split('T')[0];
  const todayDatePlusSeven = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0];

  const { roomId } = useParams();
  const [room, setRoom] = useState<Room | null>(null);
  const [startDate, setStartDate] = useState<string | null>(todayDate);
  const [endDate, setEndDate] = useState<string | null>(todayDatePlusSeven);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    getRoom();
    fetchBookings();
  }, [])

  useEffect (() => {
    fetchBookings();
  },[startDate, endDate]);

  const getRoom = async () => {
    const room = await getRoomById(roomId as string);
    setRoom(room);
  }

  const fetchBookings = async () => {
    if (startDate && endDate && roomId) {
      const bookings = await getBookingsByDateRangeAndRoom(startDate, endDate, roomId);
      console.log("Bookings fetched:", bookings);
      setBookings(bookings);
    }
  }

  const renderBookings = () => {
    if (!startDate || !endDate) return null;
    let startDateObj = new Date(startDate);
    let endDateObj = new Date(endDate);

    let booksRender = [];

    while (startDateObj <= endDateObj) {
      const formattedDate = startDateObj.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });
      const formattedDay = startDateObj.toLocaleDateString('en-GB', { weekday: 'long' });
      const bookingsForDate = bookings.filter(booking => booking.date === startDateObj.toISOString().split('T')[0]);
      
      booksRender.push(
        <div key={formattedDate} className="relative flex flex-col w-full h-27 bg-base-100 gap-2 p-2 rounded-lg">
          <p className="text-lg w-full font-semibold">{formattedDay + " : " + formattedDate}</p>
          <div className="absolute w-full bottom-2 overflow-x-auto">
            <DayTimelineBookings showPopup bookings={bookingsForDate} />
          </div>
        </div>
      )
      startDateObj.setDate(startDateObj.getDate() + 1);
    }

    return booksRender;
  }
  
  return (
    <div className="h-full w-full">
      {room && (
        <div className='relative flex flex-col gap-4 w-full h-full bg-base-300 p-4 rounded-lg'>
          <p className='text-4xl font-semibold'>{room.name}</p>
          <p className='text-lg font-semibold'>{room.desc}</p>
          <img 
            src={"https://hosanna.com.sg/wp-content/uploads/2023/06/2022-08-02-1024x768.jpg"} alt={room.name} 
            className=' object-cover rounded-lg h-80'
          />
          <div className="relative flex flex-col gap-2 p-4 w-full">
            <p className="text-lg font-semibold">Bookings:</p>
            <div className="flex flex-row gap-2 mb-2 h-full">
              <label className="input w-full">
                <span className="label">From:</span>
                <input onChange={(e)=>{
                  if (e) {
                    const date = new Date(e.target.value).toISOString().split('T')[0];
                    setStartDate(date);
                  }
                }} type="date"/>
              </label>
              <label className="input w-full">
                <span className="label">To:</span>
                <input onChange={(e)=>{
                  if (e) {
                    const date = new Date(e.target.value).toISOString().split('T')[0];
                    setEndDate(date);
                  }
                }} type="date" />
              </label>
            </div>
            <div className="flex flex-col w-full gap-2">
              {renderBookings()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
