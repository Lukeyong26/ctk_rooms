import { useEffect, useState } from "react";
import TimePicker from "./TimePicker";
import { Select, TextInput } from "flowbite-react";
import { addBooking, getBookingsByDateAndRoom, getMinistries } from "../utils/firebase";
import { useNavigate } from "react-router";
import { BookingFormData, Bookings, Room } from "../utils/types";

function RoomBookingForm({ multiForm, roomsList, roomID }: { multiForm?: boolean, roomsList?: Room[], roomID?: string }) {
  
  const nav = useNavigate();

  const todaysDate = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD for input type="date"
  console.log("Today's Date:", todaysDate);
  const [ministries, setMinistries] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [mainFormData, setMainFormData] = useState<BookingFormData>({
    date: todaysDate, roomId: roomID? roomID : '', bookedBy: '', startTime: '', endTime: '', 
    ministry: '', phoneNumber: '', email: '', description: ''
  });
  const [multipleBookings, setMultipleBookings] = useState<boolean>(false);
  const [multiFormData, setmultiFormData] = useState<any>({
    repeatValue: 0, repeatType: '1', endType: 'eoy', endDate: ''
  });

  useEffect(() => {
    const fetchMinistries = async () => {
      const ministriesList = await getMinistries();
      setMinistries(ministriesList || []);
    }
    fetchMinistries();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      if (mainFormData.roomId && mainFormData.date) {
        const bookings = await getBookingsByDateAndRoom(mainFormData.date, mainFormData.roomId);
        setBookings(bookings || []);
      }
    }
    fetchBookings();
  }, [mainFormData.roomId, mainFormData.date]);

  const handleMakeBooking = async (e : any) => {
    e.preventDefault();
    if (mainFormData.roomId === undefined) {
      return;
    }
    console.log("state:", mainFormData);
    if (mainFormData.date === '' || mainFormData.startTime === '' || mainFormData.endTime === '' || mainFormData.bookedBy === '' || mainFormData.roomId === '') {
      alert("Please fill all the fields");
      return;
    }

    if (!multipleBookings) { 
      // Handle single booking
      const bookings = await getBookingsByDateAndRoom(mainFormData.date, mainFormData.roomId);
      const isRoomBooked = bookings.some((booking) => {
        return (mainFormData.startTime < booking.endTime && mainFormData.endTime > booking.startTime);
      });
      if (isRoomBooked) {
        alert("OPPS! Sorry the Room was just booked. Please choose another time.");
        setMainFormData((prevState: any) => ({...prevState, startTime: '', endTime: ''}));
        return;
      }

      await addBooking(mainFormData);
      nav('/bookings/success');

    } else {
      // Handle multi booking
      if (
        mainFormData.date === '' || mainFormData.startTime === '' || mainFormData.endTime === '' || mainFormData.bookedBy === '' || mainFormData.roomId === '' ||
        multiFormData.repeatValue === '' || multiFormData.repeatType === '' || (multiFormData.endDate === '' && multiFormData.endType !== 'eoy')
      ) {
        alert("Please fill all the fields");
        return;
      }
      const repeatValue = parseInt(multiFormData.repeatValue);
      const repeatType = parseInt(multiFormData.repeatType);
      const endType = multiFormData.endType;
      let dateObj = new Date(mainFormData.date);
      let endDateObj = new Date(multiFormData.endDate);

      if (endType === 'eoy') {
        endDateObj.setMonth(11);
        endDateObj.setDate(31);
      }

      while (dateObj <= endDateObj) {
        const booking = {
          date: dateObj.toISOString().split('T')[0],
          roomId: mainFormData.roomId,
          bookedBy: mainFormData.bookedBy,
          startTime: mainFormData.startTime,
          endTime: mainFormData.endTime,
          ministry: mainFormData.ministry,
          phoneNumber: mainFormData.phoneNumber,
          email: mainFormData.email,
          description: mainFormData.description
        }
        await addBooking(booking);
        console.log("Booking made for: ", booking);
        if (repeatType === 1) {
          dateObj.setDate(dateObj.getDate() + repeatValue);
        } else if (repeatType === 2) {
          dateObj.setDate(dateObj.getDate() + (repeatValue * 7));
        } else if (repeatType === 3) {
          dateObj.setMonth(dateObj.getMonth() + repeatValue);
        }
      }
      alert("Multi Booking made successfully");
    }
  }

  const handleMainForm = (e: any) => {
    const { name, value } = e.target;
    if (name === 'date') {
      const dateValue = new Date(value);
      const formattedDate = dateValue.toISOString().split('T')[0];
      console.log("Formatted Date:", formattedDate);
      setMainFormData((prevState: any) => ({
        ...prevState,
        [name]: formattedDate
      }));
      return;
    }
    console.log("Main Form Data:", mainFormData);
    setMainFormData((prevState: any) => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleMultiForm = (e: any) => {
    const { name, value } = e.target;
    if (name === 'endDate') {
      const dateValue = new Date(value);
      const formattedDate = dateValue.toISOString().split('T')[0];
      setmultiFormData((prevState: any) => ({
        ...prevState,
        [name]: formattedDate
      }));
      return;
    }
    setmultiFormData((prevState: any) => ({
      ...prevState,
      [name]: value
    }));
  }
  
  return (
    <div className="flex w-full">
      <div className="flex w-full max-w-md flex-col gap-4">
        {multiForm && (
          <Select onChange={handleMainForm} id="roomId" name="roomId">
            <option value="">Select a Room</option>
            {roomsList?.map((room) => (
              <option key={room.id} value={room.id}>{room.name}</option>
            ))}
          </Select>
        )}
        <Select onChange={handleMainForm} name="ministry">
          <option value="">Select a Ministry</option>
          {ministries.map((ministry) => (
            <option key={ministry.id} value={ministry.id}>{ministry.name}</option>
          ))}
        </Select>
        
        <input type="date" name="date" value={mainFormData.date} required onChange={handleMainForm} className="border-1 rounded-sm p-2 border-gray-300"/>

        <TimePicker bookings={bookings} setStartTime={(time) => {
          setMainFormData((prevState: any) => ({ ...prevState, startTime: time }));
        }} setEndTime={(time) => {
          setMainFormData((prevState: any) => ({ ...prevState, endTime: time }));
        }}/>

        <TextInput type="text" name="bookedBy" placeholder="Full Name" onChange={handleMainForm}/>
        <TextInput type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleMainForm}/>
        <TextInput type="email" name="email" placeholder="Email" onChange={handleMainForm}/>
        <textarea className="textarea w-full" name="description" placeholder="Purpose of Booking" onChange={handleMainForm}></textarea>

        {multiForm && (
          <label className="label" htmlFor="multiple-bookings">
            <input onChange={()=>setMultipleBookings(!multipleBookings)} type="checkbox" className="checkbox mr-2" />
            Recurrent Bookings
          </label>
        )}
        
        {multipleBookings && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <label htmlFor="recurrence" className="label mr-2">Repeats every:</label>
              <input type="number" name="repeatValue" className="input" placeholder="Number" onChange={handleMultiForm} />
              <select className="select" name="repeatType" onChange={handleMultiForm}>
                <option value="1">Day</option>
                <option value="2">Weeks</option>
                <option value="3">Month</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="recurrence" className="label">Ends on:</label>
              <label className="label">
                <input type="radio" name="endType" value="eoy" onChange={handleMultiForm} className="radio mr-2" defaultChecked />
                End of Year
              </label>
              <label className="label">
                <input type="radio" name="endType" value="date" onChange={handleMultiForm} className="radio mr-2" />
                {/* <Datepicker id="recurrence" name="endDate" /> */}
                <input type="date" name="endDate" className="input" onChange={handleMultiForm} />
              </label>
            </div>
          </div>
        )}
        <button className="btn" onClick={handleMakeBooking}>Make Booking</button>
      </div>
    </div>
  )
}

export default RoomBookingForm