import { Link } from "react-router";

export default function SuccessfulBooking() {
  return (
    <div>
      <div className="flex flex-col gap-2 bg-base-200 p-4 rounded-lg text-center">
        <p className="text-lg font-semibold">Booking Successful!</p>
        <p className="text-md">Your booking has been successfully completed.</p>
      </div>
      <div className="flex justify-center mt-4 gap-4">
        <Link to={'/'}><button className="btn">Home</button></Link>
      </div>
    </div>
  )
}
