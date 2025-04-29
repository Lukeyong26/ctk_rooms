import { useEffect, useState } from "react";
import RoomCard from "../components/RoomCard";
import { getBookingsByDate, getRoomsList,  } from "../utils/firebase";
import { Bookings, Room } from "../utils/types";
import { Datepicker } from "flowbite-react";

export default function Home() {

  const todaysDate = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });

  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [todaysBookings, setTodaysBookings] = useState<Bookings[]>([]);
  const [selectedDate, setSelectedDate] = useState(todaysDate);

  useEffect(() => {
    const fetchData = async () => {
      const rooms = await getRoomsList();
      const bookings = await getBookingsByDate(selectedDate);
      console.log(bookings);
      setAllRooms(rooms);
      setTodaysBookings(bookings);
    };

    fetchData();
  }, [selectedDate]);

  return (
    <div className="grid grid-cols-1 gap-4 w-full">
      <Datepicker onChange={(e)=>{
        if (e) {
          const date = new Date(e).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });
          setSelectedDate(date);
        }
      }}/>
      {allRooms.map((room) => {
        const roomBookings = todaysBookings.filter((booking) => booking.roomId === room.id);

        return (
          <RoomCard key={room.id} imageUrl={"https://thumbs.dreamstime.com/b/office-room-7881663.jpg"} id={room.id} title={room.name} desc={room.desc} bookings={roomBookings} />
        )
      })}
    </div>
  );

}
