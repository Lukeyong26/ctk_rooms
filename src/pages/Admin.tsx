import { Room } from "../utils/types"
import { addRoom, addBooking, getRoomsList, getBookingsByDateAndRoom, deleteBooking } from "../utils/firebase"
import { Button, Datepicker, Label, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import TimePicker from "../components/TimePicker";
import { useNavigate } from "react-router";

export default function Admin() {

  const initDate = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const nav = useNavigate();

  //Delete Booking
  const [roomsList, setRoomsList] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(initDate);
  const [bookingsList, setBookingsList] = useState<any[]>([]);

  // Booking Room
  const [roomId, setRoomId] = useState<string>('');
  const [date, setDate] = useState<string>(initDate);
  const [bookings, setBookings] = useState<any[]>([]);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [bookedBy, setBookedBy] = useState<string>('');

  useEffect(() => {
    const fetchRoomsList = async () => {
      const rooms = await getRoomsList();
      setRoomsList(rooms);
    }
    fetchRoomsList();
  },[]);

  // For Booking Room
  useEffect(() => {
    const fetchBookings = async () => {
      if (roomId && date) {
        const bookings = await getBookingsByDateAndRoom(date, roomId);
        setBookings(bookings || []);
      }
    }
    fetchBookings();
  }, [roomId, date, startTime, endTime]);

  // For Deleting Booking
  useEffect(() => {
    console.log("Selected Room: ", selectedRoom);
    console.log("Selected Date: ", selectedDate);
    if (selectedRoom && selectedDate) {
      const fetchBookings = async () => {
        const bookings = await getBookingsByDateAndRoom(selectedDate, selectedRoom);
        console.log("Bookings: ", bookings);
        setBookingsList(bookings);
      }
      fetchBookings();
    }
  }, [selectedRoom, selectedDate]);

  const handleAddRoom = async (e : any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const id = name.replace(/\s+/g, '-').toLowerCase();
    const room: Room = {
      id: id,
      name: name,
      desc: formData.get('desc') as string
    }
    await addRoom(room);
    (document.getElementById('add-room-form') as HTMLFormElement).reset();
  }

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
    alert("Booking made successfully");
    nav('/admin');
  }

  const handleDeleteBooking = async (id: string) => {
    deleteBooking(id);
  }

  return (
    <div className="flex flex-col items-center w-full gap-10 p-10">

      {/* Add a Room */}
      <div className="collapse collapse-arrow bg-base-100 border border-base-300">
        <input type="radio" name="my-accordion-2"/>
        <div className="collapse-title font-semibold">Add a Room</div>
        <div className="collapse-content">
          <form id="add-room-form" onSubmit={handleAddRoom} className="flex w-full max-w-md flex-col gap-4">
            <TextInput type="text" name="name" placeholder="Room Name" required />
            <TextInput type="text" name="desc" placeholder="Room Description" required />
            <Button color="alternative" type="submit">Add Room</Button>
          </form>
        </div>
      </div>

      {/* Make A Room Booking */}
      <div className="collapse collapse-arrow bg-base-100 border border-base-300">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title font-semibold">Make A Room Booking</div>
        <div className="collapse-content text-sm">
          <div className="flex w-full">
            <div className="flex w-full max-w-md flex-col gap-4">
              <Datepicker id="date" name="date" required onChange={(e) => setDate(e?.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }) || '')} />

              <Select onChange={(e) => setRoomId(e.target.value)} id="roomId" name="roomId" required>
                <option value="">Select a Room</option>
                {roomsList.map((room) => (
                  <option key={room.id} value={room.id}>{room.name}</option>
                ))}
              </Select>
              
              <TimePicker bookings={bookings} setStartTime={setStartTime} setEndTime={setEndTime}/>
              <TextInput type="text" name="bookedBy" placeholder="Booked By" onChange={(e) => setBookedBy(e.target.value)}/>
              <button className="btn" onClick={handleMakeBooking}>Make Booking</button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete A Booking */}
      <div className="collapse collapse-arrow bg-base-100 border border-base-300">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title font-semibold">Delete A Booking</div>
        <div className="collapse-content text-sm">
          <form className="flex w-full max-w-md flex-col gap-4">
            <Label htmlFor="name" >Delete a Booking</Label>
            <Datepicker onChange={(e) => setSelectedDate(e?.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }) || '')} id="date" name="date" required={true} />

            <Select onChange={(e) => setSelectedRoom(e.target.value)} id="roomId" name="roomId" required>
              <option value="">Select a Room</option>
              {roomsList.map((room) => (
                <option key={room.id} value={room.id}>{room.name}</option>
              ))}
            </Select>
            <div className="min-h-80 h-full">
              {selectedDate && selectedRoom && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="bookings">Bookings:</Label>
                  {bookingsList.length === 0? (
                    <p className="text-center">No bookings found</p>
                  ) : (
                    <div>
                      {bookingsList.map((booking, index) => (
                        <div key={index} className="flex flex-row justify-between items-center bg-gray-50 border-gray-300 border-1 dark:bg-gray-700 p-2 rounded-lg">
                          <p>{booking.bookedBy}</p>
                          <p>{booking.startTime} - {booking.endTime}</p>
                          <Button color="alternative" size="xs" onClick={() => {
                            handleDeleteBooking(booking.id);
                            setBookingsList(bookingsList.filter((b) => b.id !== booking.id));
                          }}>Delete</Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}     
            </div>
               
          </form>
        </div>
      </div>

      
    </div>
  )
}
