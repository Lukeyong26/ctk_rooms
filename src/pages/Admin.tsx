import { Room } from "../utils/types"
import { addRoom, getBookingsByDateAndRoom, deleteBooking, addMinistry, deleteBookingByQuery, getPendingBookings, approveBooking } from "../utils/firebase"
import { Button, Datepicker, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import RoomBookingForm from "../components/booking/RoomBookingForm";
import { format } from "date-fns";
import DeleteBookingList from "../components/Admin/DeleteBookingList";
import { useAuthStore, useGeneralStore } from "../utils/store";
import { createUser } from "../utils/firebase_auth";

export default function Admin() {

  const isAdmin = useAuthStore((state) => state.isAdmin);
  const initDate = format(new Date(), 'yyyy-MM-dd');

  // Page state
  const [page, setPage] = useState<string>("pending");

  //Pending bookings
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);

  //Delete Booking

  const roomsList = useGeneralStore((state) => state.rooms);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(initDate);
  const [bookingsList, setBookingsList] = useState<any[]>([]);

  // For Pending Bookings
  useEffect(() => {
    const fetchPendingBookings = async () => {
      // Assuming you have a function to get pending bookings
      const bookings = await getPendingBookings();
      bookings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setPendingBookings(bookings);
    }
    fetchPendingBookings();
  }, []);

  // For Deleting Booking
  useEffect(() => {
    if (selectedRoom && selectedDate) {
      const fetchBookings = async () => {
        const bookings = await getBookingsByDateAndRoom(selectedDate, selectedRoom);
        console.log("Bookings: ", bookings);
        setBookingsList(bookings);
      }
      fetchBookings();
    }
  }, [selectedRoom, selectedDate]);

  const handleAddRoom = async (e : any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const id = name.replace(/\s+/g, '-').toLowerCase();
    const room: Room = {
      id: id,
      name: name,
      desc: formData.get('desc') as string,
      img: ''
    }
    await addRoom(room);
    (document.getElementById('add-room-form') as HTMLFormElement).reset();
  }

  const handleDeleteBooking = async (id: string) => {
    deleteBooking(id);
  }

  const handleAddMinistry = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const id = name.replace(/\s+/g, '-').toLowerCase();
    const ministry = {
      id: id,
      name: name,
      email: formData.get('email') as string,
    }
    const randPassword = Math.random().toString(36).slice(-8); // Generate a random password
    await createUser(ministry.email, randPassword); // Default password, change as needed
    await addMinistry(ministry);
    (document.getElementById('add-ministry-form') as HTMLFormElement).reset();
  }

  const handleApproveBooking = async (id: string) => {
    approveBooking(id);
  }

  return (
    <>
      {!isAdmin && (
        <div className="flex justify-center h-full">
          <p className="text-xl font-bold text-red-500">NO ACCESS</p>
        </div>
      )}
      {isAdmin && (
        <div className="flex flex-row w-full gap-10 p-10">
          <ul className="menu menu-lg bg-sub rounded-box w-62 gap-2">
            <li className="menu-title">Admin Functions</li>
            <li><a className={`${page === 'pending'? 'menu-active': ''}`} onClick={() => {setPage('pending')}}>Pending Bookings</a></li>
            <li><a className={`${page === 'makeBooking'? 'menu-active': ''}`}  onClick={() => {setPage('makeBooking')}}>Make A Booking</a></li>
            <li><a className={`${page === 'delete'? 'menu-active': ''}`}  onClick={() => {setPage('delete')}}>Delete A Booking</a></li>
            <li><a className={`${page === 'addRoom'? 'menu-active': ''}`}  onClick={() => {setPage('addRoom')}}>Add a Room</a></li>
            <li><a className={`${page === 'addMinistry'? 'menu-active': ''}`}  onClick={() => {setPage('addMinistry')}}>Add Ministry</a></li>
            <li><a className={`${page === 'purge'? 'menu-active': ''}`}  onClick={() => {setPage('purge')}}>Dont Touch</a></li>
          </ul>
          
          <div className="flex flex-col w-full bg-sub p-4 rounded-lg">
            
            { /* Approve Pending Bookings */}
            { page === 'pending' && (
              <div className="">
                <p className="font-semibold text-2xl mb-5">Approve/Delete Pending Bookings</p>
                <div className="flex w-full flex-col gap-4">
                  {pendingBookings.length === 0 ? (
                    <p>No pending bookings</p>
                  ) : (
                    pendingBookings.map((booking) => (
                      <div key={booking.id} className="flex flex-row items-center border-gray-300 border-1 p-2 rounded-lg">
                        <div className="flex flex-col gap-2">
                          <p>{booking.roomId.toUpperCase()} by {booking.ministry.toUpperCase()}</p>
                          <p>{format(booking.date,'EEE')}, {format(booking.date, 'dd/MM/yyyy')} - {booking.startTime} to {booking.endTime}</p>
                          <p>{booking.bookedBy} - {booking.phoneNumber}</p>
                        </div>
                        <div className="flex flex-row gap-4 ml-auto">
                            <button className="btn btn-lg btn-error" onClick={() => {
                              handleDeleteBooking(booking.id);
                              setPendingBookings(pendingBookings.filter((b) => b.id !== booking.id));
                            }}>Delete</button>
                              <button className="btn btn-lg btn-success" onClick={() => {
                              handleApproveBooking(booking.id);
                              setPendingBookings(pendingBookings.filter((b) => b.id !== booking.id));
                            }}>Approve</button>
                        </div>
                        
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            
            

            {/* Make A Room Booking */}
            { page === 'makeBooking' && (
              <div className="w-full">
                <div className="font-semibold text-2xl mb-5">Make A Room Booking</div>
                <div className="text-sm w-full">
                  <div className="flex w-full">
                    <RoomBookingForm multiForm roomsList={roomsList} />
                  </div>
                </div>
              </div>
            )}
            

            {/* Delete A Booking */}
            { page === 'delete' && (
              <div className="flex flex-col gap-2 w-full">
                <p className="font-semibold text-2xl mb-5">Delete A Booking</p>
                <Datepicker onChange={(e) => setSelectedDate(e? format(new Date(e), 'yyyy-MM-dd') : '')} id="date" name="date" required={true} />
                <Select onChange={(e) => setSelectedRoom(e.target.value)} id="roomId" name="roomId" required>
                  <option value="">Select a Room</option>
                  {roomsList.map((room) => (
                    <option key={room.id} value={room.id}>{room.name}</option>
                  ))}
                </Select>
                <div className="min-h-80 h-full">
                  {selectedDate && selectedRoom && (
                    <DeleteBookingList 
                      bookingsList={bookingsList} 
                      setBookingsList={setBookingsList} 
                      handleDeleteBooking={handleDeleteBooking} />
                  )}     
                </div>
              </div>
            )}

            {/* Add a Room */}
            { page === 'addRoom' && (
              <div className="flex w-full flex-col gap-4">
                <p className="font-semibold text-2xl mb-5">Add a Room</p>
                <form id="add-room-form" onSubmit={handleAddRoom} className="flex w-full flex-col gap-4">
                  <TextInput type="text" name="name" placeholder="Room Name" required />
                  <TextInput type="text" name="desc" placeholder="Room Description" required />
                  <Button color="alternative" type="submit">Add Room</Button>
                </form>
              </div>
            )}

            {/* Add Ministry */}
            { page === 'addMinistry' && (
              <div className="flex w-full flex-col gap-4">
                <p className="font-semibold text-2xl">Add Ministry</p>
                <p> NOTE: Adding a ministry will create a new account for them to use in the portal.</p>
                <form id="add-ministry-form" onSubmit={handleAddMinistry} className="flex w-full flex-col gap-4">
                  <TextInput type="text" name="name" placeholder="Ministy Name" required />
                  <TextInput type="text" name="email" placeholder="Ministry Email" required />
                  <Button color="alternative" type="submit">Add Ministry</Button>
                </form>
              </div>
            )}

            {/* Purge */} 
            { page === 'purge' && (
              <div className="flex w-full flex-col gap-4">
                <p className="font-semibold text-2xl mb-5">Purge</p>
                <Button color="alternative" onClick={deleteBookingByQuery}>DEATH</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
