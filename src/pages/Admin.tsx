import { Room } from "../utils/types"
import { addRoom, getRoomsList, getBookingsByDateAndRoom, deleteBooking, addMinistry, deleteBookingByQuery } from "../utils/firebase"
import { Button, Datepicker, Label, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import RoomBookingForm from "../components/RoomBookingForm";

export default function Admin() {

  const initDate = new Date().toISOString().split('T')[0];

  //Delete Booking
  const [roomsList, setRoomsList] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(initDate);
  const [bookingsList, setBookingsList] = useState<any[]>([]);

  //Add Ministry
  const [ministryFormData, setMinistryFormData] = useState<any>({name: '', color: '#ff0000'});

  useEffect(() => {
    const fetchRoomsList = async () => {
      const rooms = await getRoomsList();
      setRoomsList(rooms);
    }
    fetchRoomsList();
  },[]);

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
      desc: formData.get('desc') as string
    }
    await addRoom(room);
    (document.getElementById('add-room-form') as HTMLFormElement).reset();
  }

  const handleDeleteBooking = async (id: string) => {
    deleteBooking(id);
  }

  const handleMinistryChange = (e: any) => {
    const { name, value } = e.target;
    setMinistryFormData((prevState: any) => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleAddMinistry = async (e: any) => {
    e.preventDefault();
    if (ministryFormData.name === '') {
      alert("Please enter a ministry name");
      return;
    }
    const ministry = {
      id: ministryFormData.name.replace(/\s+/g, '-').toLowerCase(),
      name: ministryFormData.name,
      color: ministryFormData.color
    };
    await addMinistry(ministry);
    console.log("Ministry added:", ministry);
    alert("Ministry added successfully");
    setMinistryFormData({name: '', color: '#ff0000'});
  }

  return (
    <div className="flex flex-col items-center w-full gap-10 p-10">

      {/* Make A Room Booking */}
      <div className="collapse collapse-arrow bg-base-100 border border-base-300">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title font-semibold">Make A Room Booking</div>
        <div className="collapse-content text-sm">
          <div className="flex w-full">
            <RoomBookingForm multiForm roomsList={roomsList} />
          </div>
        </div>
      </div>

      {/* Delete A Booking */}
      <div className="collapse collapse-arrow bg-base-100 border border-base-300">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title font-semibold">Delete A Booking</div>
        <div className="collapse-content text-sm">
          <form className="flex w-full max-w-md flex-col gap-4">
            <Label htmlFor="name" >Delete a Booking</Label>
            <Datepicker onChange={(e) => setSelectedDate(e?.toISOString().split('T')[0] || '')} id="date" name="date" required={true} />

            <Select onChange={(e) => setSelectedRoom(e.target.value)} id="roomId" name="roomId" required>
              <option value="">Select a Room</option>
              {roomsList.map((room) => (
                <option key={room.id} value={room.id}>{room.name}</option>
              ))}
            </Select>
            <div className="min-h-80 h-full">
              {selectedDate && selectedRoom && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="bookings">Bookings:</Label>
                  {bookingsList.length === 0? (
                    <p className="text-center">No bookings found</p>
                  ) : (
                    <div>
                      {bookingsList.map((booking, index) => (
                        <div key={index} className="flex flex-row justify-between items-center bg-gray-50 border-gray-300 border-1 dark:bg-gray-700 p-2 rounded-lg">
                          <p>{booking.bookedBy}</p>
                          <p>{booking.startTime} - {booking.endTime}</p>
                          <Button color="alternative" size="xs" onClick={() => {
                            handleDeleteBooking(booking.id);
                            setBookingsList(bookingsList.filter((b) => b.id !== booking.id));
                          }}>Delete</Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}     
            </div>
          </form>
        </div>
      </div>

      {/* Add a Room */}
      <div className="collapse collapse-arrow bg-base-100 border border-base-300">
        <input type="radio" name="my-accordion-2"/>
        <div className="collapse-title font-semibold">Add a Room</div>
        <div className="collapse-content">
          <form id="add-room-form" onSubmit={handleAddRoom} className="flex w-full max-w-md flex-col gap-4">
            <TextInput type="text" name="name" placeholder="Room Name" required />
            <TextInput type="text" name="desc" placeholder="Room Description" required />
            <Button color="alternative" type="submit">Add Room</Button>
          </form>
        </div>
      </div>

      {/* Add Ministry */}
      <div className="collapse collapse-arrow bg-base-100 border border-base-300">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title font-semibold">Add Ministry</div>
        <div className="collapse-content">
          <form className="flex w-full max-w-md flex-col gap-4">
            <Label htmlFor="name">Ministry Name</Label>
            <TextInput type="text" name="name" onChange={handleMinistryChange} />
            <Label htmlFor="color">Ministry Color</Label>
            <input type="color" name="color" onChange={handleMinistryChange} value={ministryFormData.color}
            className="w-8 h-8 border-1 border-gray-400 rounded-sm" />
            <Button color="alternative" onClick={handleAddMinistry} >Add Ministry</Button>
          </form>
        </div>
      </div>

      {/* Purge */}
      <div className="collapse collapse-arrow bg-base-100 border border-base-300">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title font-semibold">Purge</div>
        <div className="collapse-content">
          <Button color="alternative" onClick={deleteBookingByQuery} >DEATH</Button>
        </div>
      </div>
    </div>
  )
}
