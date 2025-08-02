import { Link, useNavigate } from "react-router";
import { ThumbsUpIcon } from "lucide-react";

export default function SuccessfulBooking() {
  const nav = useNavigate();
  return (
    <div>
      <div className="flex flex-col gap-2 bg-base-200 p-4 rounded-lg text-center">
      <ThumbsUpIcon className="w-16 h-16 text-green-600 mx-auto" />
        <p className="text-lg font-semibold">Booking Successful!</p>
        <p className="text-md">The Parish Office will review your booking.</p>
      </div>
        <div className="flex justify-center mt-4 gap-4">
          <button onClick={() => {nav(-1)}} className="btn">Back</button>
          <Link to={'/'}><button className="btn">Home</button></Link>
        </div>      
    </div>
  )
}
