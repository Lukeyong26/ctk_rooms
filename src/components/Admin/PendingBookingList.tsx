import { useEffect, useState } from "react";
import { approveBooking, deleteBooking, getPendingBookings } from "../../utils/firebase";
import { format } from "date-fns";

function PendingBookingList() {

  //Pending bookings state
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  const [conflictBookings, setConflictBookings] = useState<any[]>([]);
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [hasConflict, setHasConflict] = useState<boolean>(false);

  // Loading Functions
  useEffect(() => {
    const fetchPendingBookings = async () => {
      const bookings = await getPendingBookings();
      bookings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setPendingBookings(bookings);
    }
    fetchPendingBookings();
  }, []);

  useEffect(() => {
    if (pendingBookings.length > 0) {
      validatePendingBookings();
    } else {
      setHasConflict(false);
      setConflictBookings([]);
    }
  }, [pendingBookings]);

  // Helper Functions
  const isStartTimeInRange = (checkStart: string, startTime: string, endTime: string) => {
    const checkStartDate = new Date(`1970-01-01T${checkStart}:00`);
    const startDate = new Date(`1970-01-01T${startTime}:00`);
    const endDate = new Date(`1970-01-01T${endTime}:00`);
    return checkStartDate >= startDate && checkStartDate < endDate;
  }

  const isEndTimeInRange = (checkEnd: string, startTime: string, endTime: string) => {
    const checkEndDate = new Date(`1970-01-01T${checkEnd}:00`);
    const startDate = new Date(`1970-01-01T${startTime}:00`);
    const endDate = new Date(`1970-01-01T${endTime}:00`);
    return checkEndDate > startDate && checkEndDate <= endDate;
  }

  const validatePendingBookings = () => {
    setHasConflict(false);
    setConflictBookings([]);
    if (pendingBookings.length === 0) {
      setHasConflict(false);
      return;
    }
    pendingBookings.forEach((booking) => {
      console.log("Validating booking: ", booking);
      if (pendingBookings.some((b) => 
        b.id !== booking.id &&
        b.roomId === booking.roomId && 
        b.date === booking.date && 
        (isStartTimeInRange(booking.startTime, b.startTime, b.endTime) || isEndTimeInRange(booking.endTime, b.startTime, b.endTime))))
      {
        setConflictBookings((prev) => [...prev, booking.id]);
        setHasConflict(true);
      }
    })
  }

  const handleApproveBooking = async (id: string) => {
    //remove booking from state
    setPendingBookings(pendingBookings.filter((b) => b.id !== id));
    approveBooking(id);
  }

  const handleDeleteBooking = async (id: string) => {
    //remove booking from state
    setPendingBookings(pendingBookings.filter((b) => b.id !== id));
    deleteBooking(id);
  }

  const handleApproveSelected = async () => {
    if (selectedBookings.length === 0) {
      alert("Please select at least one booking to approve.");
      return;
    }
    if (hasConflict) {
      alert("Please resolve conflicts before approving.");
      return;
    }

    // Approve selected bookings
    for (const id of selectedBookings) {
      await approveBooking(id);
    }
    
    // Remove approved bookings from pending list
    setPendingBookings(pendingBookings.filter((b) => !selectedBookings.includes(b.id)));
    setSelectedBookings([]);
  }

  return (
    <div className="">
      <p className="font-semibold text-2xl mb-5">Approve/Delete Pending Bookings</p>
      <div className="flex w-full flex-col gap-4">
        {pendingBookings.length === 0 ? (
          <p className="flex mt-10 items-center justify-center">No pending bookings</p>
        ) : (
          <>
            {/* Pending Bookings Summary */}
            <div>
              <p className="text-sm mb-4">Pending Bookings: {pendingBookings.length}</p>
              {hasConflict && <p className="text-sm text-error">Conflicting Bookings: {conflictBookings.length}</p>}
              {hasConflict && <p className="text-sm text-error">Please resolve conflicts before approving.</p>}
            </div>

            {/* Select pending bookings area */}
            <div className="flex flex-row justify-between items-center mb-4">
              <label className="label">
                <input type="checkbox" className="checkbox" checked={selectedBookings.length === pendingBookings.length} onChange={() => {
                  if (selectedBookings.length === pendingBookings.length) {
                    setSelectedBookings([]);
                  } else {
                    setSelectedBookings(pendingBookings.map(b => b.id));
                  }
                }}/>
                Select All
              </label>
              <button disabled={pendingBookings.length===0 || hasConflict || selectedBookings.length===0} className="btn btn-lg btn-success" onClick={handleApproveSelected}>Approve Selected</button>
            </div>

            {/* Pending Bookings List */}
            {pendingBookings.map((booking) => (
              <div key={booking.id} className={`flex flex-row items-center ${conflictBookings.some(v=>v ===booking.id)? 'border-error':'border-gray-300'}  border-1 p-2 rounded-lg`}>
                <input type="checkbox" className="checkbox checkbox-sm mr-5" checked={selectedBookings.includes(booking.id)} onChange={() => {
                  if (selectedBookings.includes(booking.id)) {
                    setSelectedBookings(selectedBookings.filter(id => id !== booking.id));
                  } else {
                    setSelectedBookings([...selectedBookings, booking.id]);
                  }
                }}
                />
                <div className="flex flex-col gap-2">
                  <p>{booking.roomId.toUpperCase()} by {booking.ministry.toUpperCase()}</p>
                  <p>{format(booking.date,'EEE')}, {format(booking.date, 'dd/MM/yyyy')} - {booking.startTime} to {booking.endTime}</p>
                  <p>{booking.bookedBy} - {booking.phoneNumber}</p>
                </div>
                <div className="flex flex-row gap-4 ml-auto">
                    <button className="btn btn-lg btn-error" onClick={() => {
                      handleDeleteBooking(booking.id);
                    }}>Delete</button>
                      <button className="btn btn-lg btn-success" onClick={() => {
                      handleApproveBooking(booking.id);
                    }}>Approve</button>
                </div>
                
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default PendingBookingList