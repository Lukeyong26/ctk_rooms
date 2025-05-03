import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Room } from "../utils/types";
import { addBooking, getBookingsByDateAndRoom, getRoomById } from "../utils/firebase";
import { Datepicker, TextInput } from "flowbite-react";
import TimePicker from "../components/TimePicker";

export default function BookRoom() {

  const initDate = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const nav = useNavigate();
  
  const { roomId } = useParams();
  const [room, setRoom] = useState<Room>({} as Room);
  const [date, setDate] = useState<string>(initDate);
  const [bookings, setBookings] = useState<any[]>([]);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [bookedBy, setBookedBy] = useState<string>('');

  useEffect(() => {
    const fetchRoom = async () => {
      const room = await getRoomById(roomId || '');
      setRoom(room || {} as Room);
    }
    fetchRoom();
  }, []);

  useEffect(() => {
    console.log("state:" + roomId + date + bookings + startTime + endTime);
  }, [roomId, date, bookings, startTime, endTime]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (roomId && date) {
        const bookings = await getBookingsByDateAndRoom(date, roomId);
        setBookings(bookings || []);
      }
    }
    fetchBookings();
  }, [roomId, date, startTime, endTime]);

  const handleMakeBooking = async (e : any) => {
    e.preventDefault();

    if (roomId === undefined) {
      return;
    }

    if (date === '' || startTime === '' || endTime === '' || bookedBy === '' || roomId === '') {
      alert("Please fill all the fields");
      return;
    }

    const booking = {
      date: date,
      roomId: roomId,
      bookedBy: bookedBy,
      startTime: startTime,
      endTime: endTime
    }

    console.log(booking);

    const bookings = await getBookingsByDateAndRoom(date, roomId);
    const isRoomBooked = bookings.some((booking) => {
      return (startTime < booking.endTime && endTime > booking.startTime);
    });
    if (isRoomBooked) {
      alert("OPPS! Sorry the Room was just booked. Please choose another time.");
      setStartTime('');
      setEndTime('');
      return;
    }

    await addBooking(booking);
    nav('/bookings/success');
  }
  
  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-md flex-col gap-4">
        <p>Making a booking for: </p>
        <p className="font-semibold text-4xl mb-2">{room?.name}</p>
        <Datepicker id="date" name="date" required onChange={(e) => setDate(e?.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }) || '')} />
        
        {/* <TextInput type="text" name="startTime" placeholder="Start Time" required />
        <TextInput type="text" name="endTime" placeholder="End Time" required /> */}

        <TimePicker bookings={bookings} setStartTime={setStartTime} setEndTime={setEndTime}/>
        


        <TextInput type="text" name="bookedBy" placeholder="Booked By" onChange={(e) => setBookedBy(e.target.value)}/>

        
        <button className="btn" onClick={handleMakeBooking}>Make Booking</button>
      </div>
    </div>
  )
}
