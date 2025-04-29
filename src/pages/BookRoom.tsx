import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Room } from "../utils/types";
import { addBooking, getBookingsByDateAndRoom, getRoomById } from "../utils/firebase";
import { Button, Datepicker, TextInput } from "flowbite-react";

export default function BookRoom() {
  
  const { roomId } = useParams();
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      const room = await getRoomById(roomId || '');
      setRoom(room || null);
    }
    fetchRoom();
  }, []);

  const handleMakeBooking = async (e : any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const date = formData.get('date') as string;
    const roomId = room?.id || '';
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
  
  return (
    <div className="flex w-full justify-center">
      <form id="add-booking-form" onSubmit={handleMakeBooking} className="flex w-full max-w-md flex-col gap-4">
        <p>Making a booking for: </p>
        <p className="font-semibold text-2xl mb-2">{room?.name}</p>
        <Datepicker id="date" name="date" required={true} />
        <TextInput type="text" name="bookedBy" placeholder="Booked By" required />
        
        <TextInput type="text" name="startTime" placeholder="Start Time" required />
        <TextInput type="text" name="endTime" placeholder="End Time" required />
        
        <Button color="alternative" type="submit">Make Booking</Button>
      </form>
    </div>
  )
}
