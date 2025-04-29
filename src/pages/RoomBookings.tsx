import { useParams } from "react-router"
    
export default function RoomBookings() {

  const { roomId } = useParams();
  
  return (
    <div>{roomId}</div>
  )
}
