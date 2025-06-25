import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Room } from "../utils/types";
import { getRoomById } from "../utils/firebase";
import RoomBookingForm from "../components/booking/RoomBookingForm";

export default function BookRoom() {
  
  const { roomId } = useParams();
  const [room, setRoom] = useState<Room>({} as Room);

  useEffect(() => {
    const fetchRoom = async () => {
      const room = await getRoomById(roomId || '');
      setRoom(room || {} as Room);
    }
    fetchRoom();
  }, []);
  
  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-md flex-col gap-4">
        <p>Making a booking for: </p>
        <p className="font-semibold text-4xl mb-2">{room?.name}</p>
        <RoomBookingForm roomID={roomId}/>
      </div>
    </div>
  )
}
