import { Room } from "../utils/types"
import { addRoom, addBooking, getRoomsList, getBookingsByDateAndRoom, deleteBooking } from "../utils/firebase"
import { Button, Datepicker, Label, Select, TextInput } from "flowbite-react";
import { use, useEffect, useState } from "react";

export default function Admin() {

  const [roomsList, setRoomsList] = useState<Room[]>([]);

  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }));
  const [bookingsList, setBookingsList] = useState<any[]>([]);

  useEffect(() => {
    const fetchRoomsList = async () => {
      const rooms = await getRoomsList();
      setRoomsList(rooms);
    }
    fetchRoomsList();
  },[]);

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
    const formData = new FormData(e.currentTarget);
    const date = formData.get('date') as string;
    const roomId = formData.get('roomId') as string;
    const bookedBy = formData.get('bookedBy') as string;
    const startTime = formData.get('startTime') as string;
    const endTime = formData.get('endTime') as string;

    const stringDate = new Date(date).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });


    const booking = {
      date: stringDate,
      roomId: roomId,
      bookedBy: bookedBy,
      startTime: startTime,
      endTime: endTime
    }

    console.log(booking);

    const roomBookings = await getBookingsByDateAndRoom(stringDate, roomId);
    
    const isRoomBooked = roomBookings.some((booking) => {
      return (startTime < booking.endTime && endTime > booking.startTime);
    });

    if (isRoomBooked) {
      alert("Room is already booked for the selected time. Please choose another time.");
      return;
    } else {
      await addBooking(booking);
      alert("Booking made successfully!");
    }
    (document.getElementById('add-booking-form') as HTMLFormElement).reset();
  }

  const handleDeleteBooking = async (id: string) => {
    deleteBooking(id);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-10 p-10">
      <form id="add-room-form" onSubmit={handleAddRoom} className="flex w-full max-w-md flex-col gap-4">
        <Label htmlFor="name" >Add a Room</Label>
        <TextInput type="text" name="name" placeholder="Room Name" required />
        <TextInput type="text" name="desc" placeholder="Room Description" required />
        <Button color="alternative" type="submit">Add Room</Button>
      </form>

      <form id="add-booking-form" onSubmit={handleMakeBooking} className="flex w-full max-w-md flex-col gap-4">
        <Label htmlFor="name" >Make a Booking</Label>
        <Select id="roomId" name="roomId" required>
          {roomsList.map((room) => (
            <option key={room.id} value={room.id}>{room.name}</option>
          ))}
        </Select>
        <Datepicker id="date" name="date" required={true} />
        <TextInput type="text" name="bookedBy" placeholder="Booked By" required />
        
        <TextInput type="text" name="startTime" placeholder="Start Time" required />
        <TextInput type="text" name="endTime" placeholder="End Time" required />
        
        <Button color="alternative" type="submit">Make Booking</Button>
      </form>

      <form className="flex w-full max-w-md flex-col gap-4">
        <Label htmlFor="name" >Delete a Booking</Label>
        <Select onChange={(e) => setSelectedRoom(e.target.value)} id="roomId" name="roomId" required>
          <option value="">Select a Room</option>
          {roomsList.map((room) => (
            <option key={room.id} value={room.id}>{room.name}</option>
          ))}
        </Select>
        <Datepicker onChange={(e) => setSelectedDate(e?.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }) || '')} id="date" name="date" required={true} />
        {selectedDate && selectedRoom && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="bookings">Bookings:</Label>
            {bookingsList.length === 0 ? (
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
      </form>
    </div>
  )
}
