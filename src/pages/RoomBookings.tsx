import { useParams } from "react-router"
import { getBookingsByDateRangeAndRoom, getRoomById } from "../utils/firebase";
import { useEffect, useState } from "react";
import { Room } from "../utils/types";
import DayTimelineBookings from "../components/DayTimelineBookings";
import { format, addDays } from "date-fns";
    
export default function RoomBookings() {

  const todayDate = format(new Date(), 'yyyy-MM-dd');
  const todayDatePlusSeven = format(addDays(new Date(), 7), 'yyyy-MM-dd');

  const { roomId } = useParams();
  const [room, setRoom] = useState<Room | null>(null);
  const [startDate, setStartDate] = useState<string>(todayDate);
  const [endDate, setEndDate] = useState<string>(todayDatePlusSeven);
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
      const bookingsForDate = bookings.filter(booking => booking.date === format(new Date(startDateObj), 'yyyy-MM-dd'));
      
      booksRender.push(
        <div key={formattedDate} className="relative flex flex-col w-full h-40 bg-white dark:bg-accentOneDark gap-2 p-2 rounded-lg">
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
        <div className='relative flex flex-col gap-4 w-full h-full bg-sub dark:bg-subDark p-4 rounded-lg'>
          <p className='text-4xl font-semibold'>{room.name}</p>
          <p className='text-lg font-semibold'>{room.desc}</p>
          <img 
            src={"/images/" + room.img} alt={room.name} 
            className=' object-cover rounded-lg h-80'
          />
          <div className="relative flex flex-col gap-2 p-4 w-full">
            <p className="text-lg font-semibold">Bookings:</p>
            <div className="flex flex-row gap-2 mb-2 h-full">
              <label className="input w-full bg-sub dark:bg-accentOneDark">
                <span className="label">From:</span>
                <input onChange={(e)=>{
                  if (e) {
                    const date = format(new Date(e.target.value), 'yyyy-MM-dd'); 
                    setStartDate(date);
                  }
                }} type="date" value={startDate}/>
              </label>
              <label className="input w-full bg-sub dark:bg-accentOneDark">
                <span className="label">To:</span>
                <input onChange={(e)=>{
                  if (e) {
                    const date = format(new Date(e.target.value), 'yyyy-MM-dd');
                    setEndDate(date);
                  }
                }} type="date" value={endDate}/>
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
