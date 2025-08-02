import { useEffect, useState } from "react";
import RoomCard from "../components/RoomCard";
import { getBookingsByDate, getBookingsByDateAndRoom, getRoomsList,  } from "../utils/firebase";
import { Bookings, Room } from "../utils/types";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(format(newDate, 'yyyy-MM-dd'));
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(format(newDate, 'yyyy-MM-dd'));
  };

  return (
    <div className="h-full w-full">
      {/* HEADER */}
      <div className="bg-main text-gray-200 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-3">
            {/* <Calendar className="w-8 h-8" /> */}
            <h1 className="text-2xl font-bold">HOME</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={goToPreviousDay}
              className="p-2 hover:bg-accentOne hover:cursor-pointer rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <label className="input text-gray-800 w-full bg-sub dark:bg-subDark">
              <input onChange={(e)=>{
                if (e) {
                  const date = format(new Date(e.target.value), 'yyyy-MM-dd');
                  setSelectedDate(date);
                }
              }} type="date" value={selectedDate} />
            </label>
            <button
              onClick={goToNextDay}
              className="p-2 hover:bg-accentOne hover:cursor-pointer rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-2 w-full text-gray-800">
          <label className="select w-full bg-sub dark:bg-subDark">
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
      </div>
      
      
      {!loading ? (
      <div className="grid grid-cols-1 gap-6 w-full mt-4">
        {DisplayedRooms.map((room) => {
          const roomBookings = todaysBookings.filter((booking) => booking.roomId === room.id);

          return (
            <RoomCard key={room.id} imageUrl={"/images/" + room.img} id={room.id} title={room.name} desc={room.desc} bookings={roomBookings} />
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
