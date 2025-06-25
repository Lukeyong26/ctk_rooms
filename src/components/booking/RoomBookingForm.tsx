import { useEffect, useState } from "react";
import TimePicker from "./TimePicker";
import { Select, TextInput } from "flowbite-react";
import { addBooking, getBookingsByDateAndRoom, getMinistries } from "../../utils/firebase";
import { useNavigate } from "react-router";
import { BookingFormData, Room } from "../../utils/types";
import { format } from "date-fns";

function RoomBookingForm({ multiForm, roomsList, roomID, date }: 
  { multiForm?: boolean, roomsList?: Room[], roomID?: string, date?: string }
) {
  
  const nav = useNavigate();
  const todaysDate = date? date : format(new Date(), 'yyyy-MM-dd'); // Format YYYY-MM-DD for input type="date"
  const [ministries, setMinistries] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [multipleBookings, setMultipleBookings] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [mainFormData, setMainFormData] = useState<BookingFormData>({
    date: todaysDate, roomId: roomID? roomID : '', bookedBy: '', startTime: '', endTime: '', 
    ministry: '', phoneNumber: '', email: '', description: '', pending: true
  });

  const [multiFormData, setmultiFormData] = useState<any>({
    repeatValue: 1, repeatType: '1', endType: 'eoy', endDate: todaysDate
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

  const resetForms = () => {
    setMainFormData({
      date: todaysDate, roomId: roomID? roomID : '', bookedBy: '', startTime: '', endTime: '', 
      ministry: '', phoneNumber: '', email: '', description: '', pending: true
    });
    setmultiFormData({
      repeatValue: 1, repeatType: '1', endType: 'eoy', endDate: todaysDate
    });
    setMultipleBookings(false);
  }

  const handleMakeBooking = async (e : any) => {
    e.preventDefault();
    setLoading(true);
    if (mainFormData.roomId === undefined) {
      setLoading(false);
      return;
    }

    if (mainFormData.date === '' || mainFormData.startTime === '' || mainFormData.endTime === '' || mainFormData.bookedBy === '' || mainFormData.roomId === '') {
      alert("Please fill all the fields");
      setLoading(false);
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
        setLoading(false);
        return;
      }

      await addBooking(mainFormData);
      resetForms();
      setLoading(false);
      
      nav('/bookings/success');

    } else {
      // Handle multi booking
      if (
        mainFormData.date === '' || mainFormData.startTime === '' || mainFormData.endTime === '' || mainFormData.bookedBy === '' || mainFormData.roomId === '' ||
        multiFormData.repeatValue === '' || multiFormData.repeatType === '' || (multiFormData.endDate === '' && multiFormData.endType !== 'eoy')
      ) {
        alert("Please fill all the fields");
        setLoading(false);
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

      console.log("Start Date: ", dateObj);
      console.log("End Date: ", endDateObj);

      while (dateObj <= endDateObj) {
        const booking = {
          date: format(new Date(dateObj), 'yyyy-MM-dd'),
          roomId: mainFormData.roomId,
          bookedBy: mainFormData.bookedBy,
          startTime: mainFormData.startTime,
          endTime: mainFormData.endTime,
          ministry: mainFormData.ministry,
          phoneNumber: mainFormData.phoneNumber,
          email: mainFormData.email,
          description: mainFormData.description,
          pending: mainFormData.pending
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
      resetForms();
      setLoading(false);
      
      nav('/bookings/success');
    }
  }

  const handleMainForm = (e: any) => {
    const { name, value } = e.target;
    let data = null;
    if (name === 'endDate') {
      data = format(new Date(value), 'yyyy-MM-dd');
    } else {
      data = value;
    }
    setMainFormData((prevState: any) => ({
      ...prevState,
      [name]: data
    }));
  }

  const handleMultiForm = (e: any) => {
    const { name, value } = e.target;
    let data = null;
    if (name === 'endDate') {
      data = format(new Date(value), 'yyyy-MM-dd');
    } else {
      data = value;
    }
    setmultiFormData((prevState: any) => ({
      ...prevState,
      [name]: data
    }));
  }
  
  return (
    <div className="flex w-full">
      <div className="flex w-full flex-col gap-4">
        {roomsList && (
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
              <input type="number" value={multiFormData.repeatValue} name="repeatValue" className="input" placeholder="Number" onChange={handleMultiForm} />
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
        <button className="btn" onClick={handleMakeBooking}>
          {loading ? (<span className="loading loading-spinner"></span>) : (null)}
          Make Booking
        </button>
      </div>
    </div>
  )
}

export default RoomBookingForm