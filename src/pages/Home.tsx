import { useEffect, useState } from "react";
import RoomCard from "../components/RoomCard";
import { getBookingsByDate, getBookingsByDateAndRoom, getRoomsList,  } from "../utils/firebase";
import { Bookings, Room } from "../utils/types";
import { format } from "date-fns";

export default function Home() {

  const todaysDate = format(new Date(), 'yyyy-MM-dd');

  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [DisplayedRooms, setDisplayedRooms] = useState<Room[]>([]);
  const [todaysBookings, setTodaysBookings] = useState<Bookings[]>([]);
  const [selectedDate, setSelectedDate] = useState(todaysDate);
  const [selectedRoom, setSelectedRoom] = useState("all-rooms");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const rooms = await getRoomsList();
      setAllRooms(rooms);

      if (selectedRoom !== "all-rooms") {
        const bookings = await getBookingsByDateAndRoom(selectedDate, selectedRoom);
        const filteredRooms = rooms.filter((room) => room.id === selectedRoom);
        setDisplayedRooms(filteredRooms);
        setTodaysBookings(bookings);
        setLoading(false);
      } else {
        const bookings = await getBookingsByDate(selectedDate);
        console.log("Bookings for date:", selectedDate, bookings);
        setDisplayedRooms(rooms);
        setTodaysBookings(bookings);
        setLoading(false);
      }
    };

    fetchData();
    
  }, [selectedDate, selectedRoom]);

  return (
    <div className="h-full w-full">
      <div className="flex justify-center gap-2 w-full">
        <label className="input w-full">
          <span className="label">Select Date:</span>
          <input onChange={(e)=>{
            if (e) {
              const date = format(new Date(e.target.value), 'yyyy-MM-dd');
              setSelectedDate(date);
            }
          }} type="date" value={selectedDate} />
        </label>

        <label className="select w-full">
          <span className="label">Room:</span>
          <select onChange={(e) => {
            setSelectedRoom(e.target.value);
          }} className="select w-full">
            <option value="all-rooms">All Rooms</option>
            {allRooms.map((room) => (
              <option key={room.id} value={room.id}>{room.name}</option>
            ))}
          </select>
        </label>
      </div>
      
      {!loading ? (
      <div className="grid grid-cols-1 gap-6 w-full mt-10">
        {DisplayedRooms.map((room) => {
          const roomBookings = todaysBookings.filter((booking) => booking.roomId === room.id);

          return (
            <RoomCard key={room.id} imageUrl={"https://hosanna.com.sg/wp-content/uploads/2023/06/2022-08-02-1024x768.jpg"} id={room.id} title={room.name} desc={room.desc} bookings={roomBookings} />
          )
        })}
      </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <span className="loading loading-spinner loading-xl text-gray-800 dark:text-white"></span>
        </div>
      )}
    </div>
  );
}
