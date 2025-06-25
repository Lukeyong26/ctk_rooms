import { Label } from "flowbite-react";

function DeleteBookingList({ bookingsList, setBookingsList, handleDeleteBooking } : { bookingsList: any[], setBookingsList: (bookings: any[]) => void, handleDeleteBooking: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
        <Label htmlFor="bookings">Bookings:</Label>
        {bookingsList.length === 0? (
        <p className="text-center">No bookings found</p>
        ) : (
        <div className="flex flex-col gap-2">
            {bookingsList.map((booking, index) => (
            <div key={index} className="flex flex-row items-center bg-gray-50 border-gray-300 border-1 dark:bg-gray-700 p-2 rounded-lg">
                <div className="flex flex-col">
                  <p>{booking.ministry.toUpperCase()}</p>
                  <p>{booking.startTime} - {booking.endTime}</p>
                </div>
                <div className="ml-auto">
                  <button className="btn btn-lg btn-error" onClick={() => {
                      handleDeleteBooking(booking.id);
                      setBookingsList(bookingsList.filter((b) => b.id !== booking.id));
                  }}>Delete</button>
                </div>
            </div>
            ))}
        </div>
        )}
    </div>
  )
}

export default DeleteBookingList