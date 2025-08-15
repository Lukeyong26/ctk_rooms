import { useEffect, useState } from "react";
import TimePicker from "./TimePicker";
import { Label, Select, TextInput } from "flowbite-react";
import { addBooking, getBookingsByDateAndRoom } from "../../utils/firebase";
import { useNavigate } from "react-router";
import { BookingFormData, Room } from "../../utils/types";
import { format } from "date-fns";
import { useAuthStore, useGeneralStore } from "../../utils/store";

function RoomBookingForm({ multiForm, roomsList, roomID, date }: 
  { multiForm?: boolean, roomsList?: Room[], roomID?: string, date?: string }
) {
  
  const nav = useNavigate();
  const todaysDate = date? date : format(new Date(), 'yyyy-MM-dd');
  const user = useAuthStore((state) => state.user);
  const UserMinistry = useAuthStore((state) => state.ministry);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const ministryList = useGeneralStore((state) => state.ministries);
  const roomList = useGeneralStore((state) => state.rooms);

  const [bookings, setBookings] = useState<any[]>([]);
  const [multipleBookings, setMultipleBookings] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorBookings, setErrorBookings] = useState<string[]>([]);

  const [mainFormData, setMainFormData] = useState<any>({
    date: todaysDate, roomId: roomID? roomID : '', bookedBy: '', startTime: '', endTime: '', 
    ministry: UserMinistry || '', phoneNumber: '', email: user?.email || '', description: '', 
    pending: isAdmin? false : true, repeatValue: 1, repeatType: '1', endType: 'eoy', endDate: todaysDate
  });

  const [confirmedBooking, setConfirmedBooking] = useState<BookingFormData[]>([]);

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
      ministry: '', phoneNumber: '', email: user?.email || '', description: '', pending: isAdmin? false : true,
      repeatValue: 1, repeatType: '1', endType: 'eoy', endDate: todaysDate
    });
    setMultipleBookings(false);
    setLoading(false);
  }

  const handleMakeBooking = async (e : any) => {
    e.preventDefault();
    setLoading(true);
    
    if (mainFormData.roomId === undefined) {
      setLoading(false);
      return;
    }
    if (
      mainFormData.date === '' || mainFormData.startTime === '' || mainFormData.endTime === '' || 
      mainFormData.bookedBy === '' || mainFormData.roomId === '' || mainFormData.repeatValue === '' || 
      mainFormData.repeatType === '' || (mainFormData.endDate === '' && mainFormData.endType !== 'eoy')
    ) {
      const modal = document.getElementById('emptyFields');
      if (modal) {
        (modal as HTMLDialogElement).showModal();
      }
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
        const modal = document.getElementById('roomBookedModal');
        if (modal) {
          (modal as HTMLDialogElement).showModal();
        }
        setMainFormData((prevState: any) => ({...prevState, startTime: '', endTime: ''}));
        setLoading(false);
        return;
      }

      const booking : BookingFormData = {
        date: mainFormData.date,
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

      setConfirmedBooking([booking]);
      
    } else {
      // Handle multi booking
      const repeatValue = parseInt(mainFormData.repeatValue);
      const repeatType = parseInt(mainFormData.repeatType);
      const endType = mainFormData.endType;
      let dateObj = new Date(mainFormData.date);
      let endDateObj = new Date(mainFormData.endDate);

      if (endType === 'eoy') {
        endDateObj.setMonth(11);
        endDateObj.setDate(31);
      }
      let errorBookingsCount = 0;
      while (dateObj <= endDateObj) {
        const dateString = format(new Date(dateObj), 'yyyy-MM-dd');

        const bookings = await getBookingsByDateAndRoom(dateString, mainFormData.roomId);
        const isRoomBooked = bookings.some((booking) => {
          return (mainFormData.startTime < booking.endTime && mainFormData.endTime > booking.startTime);
        });
        if (isRoomBooked) {
          errorBookingsCount++;
          setErrorBookings((prev) => [...prev, `${dateString} from ${mainFormData.startTime} to ${mainFormData.endTime}`]);
        } else {
          const booking : BookingFormData = {
            date: dateString,
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
  
          setConfirmedBooking((prev) => [...prev, booking]);
          console.log("Booking made for: ", booking);
        }

        if (repeatType === 1) {
          dateObj.setDate(dateObj.getDate() + repeatValue);
        } else if (repeatType === 2) {
          dateObj.setDate(dateObj.getDate() + (repeatValue * 7));
        } else if (repeatType === 3) {
          dateObj.setMonth(dateObj.getMonth() + repeatValue);
        }
      }

      if (errorBookingsCount > 0) {
        resetForms();
        const modal = document.getElementById('multidayConflict');
        if (modal) {
          (modal as HTMLDialogElement).showModal();
        }
        setLoading(false);
        return;
      }
    }
    // Show confirmation modal
    const modal = document.getElementById('confirmationModal');
    if (modal) {
      (modal as HTMLDialogElement).showModal();
    }
  }

  const confirmBooking = () => {
    confirmedBooking.map(async (booking) => {
      await addBooking(booking);
    });
    resetForms();
    setLoading(false);
    nav('/bookings/success');
  }

  const handleMainForm = (e: any) => {
    const { name, value } = e.target;
    let data = null;
    if (name === 'endDate') {
      data = format(new Date(value), 'yyyy-MM-dd');
    } 
    else if (name === 'ministry' && isAdmin) {
      data = ministryList.find((ministry) => ministry.id === value)?.name || '';
    }
    else {
      data = value;
    }
    
    setMainFormData((prevState: any) => ({
      ...prevState,
      [name]: data
    }));
  }

  return (
    <div className="flex w-full">
      <form onSubmit={handleMakeBooking} className="flex w-full flex-col gap-4">
        {roomsList && (
          <Select required onChange={handleMainForm} id="roomId" name="roomId">
            <option value="">Select a Room</option>
            {roomsList?.map((room) => (
              <option key={room.id} value={room.id}>{room.name}</option>
            ))}
          </Select>
        )}

        {isAdmin? (
          <Select required onChange={handleMainForm} name="ministry">
            <option value="">Select a Ministry</option>
            {ministryList.map((ministry) => (
              <option key={ministry.id} value={ministry.id}>{ministry.name}</option>
            ))}
          </Select>
        ): (
          <>
            <div>Email: <Label className="label text-lg">{user?.email}</Label></div>
            <div>Ministry: <Label className="label text-lg">{UserMinistry}</Label></div>
          </>
        )}

        <input required type="date" name="date" value={mainFormData.date} onChange={handleMainForm} className="border-1 rounded-sm p-2 border-gray-300"/>

        <TextInput required className="w-full" name="description" value={mainFormData.description} placeholder="Purpose of Booking" onChange={handleMainForm}/>

        <TimePicker bookings={bookings} setStartTime={(time) => {
          setMainFormData((prevState: any) => ({ ...prevState, startTime: time }));
        }} setEndTime={(time) => {
          setMainFormData((prevState: any) => ({ ...prevState, endTime: time }));
        }}/>

        <TextInput required type="text" name="bookedBy" value={mainFormData.bookedBy} placeholder="Full Name" onChange={handleMainForm}/>
        <TextInput required type="text" name="phoneNumber" value={mainFormData.phoneNumber} placeholder="Phone Number" onChange={handleMainForm}/>

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
              <input type="number" value={mainFormData.repeatValue} name="repeatValue" className="input" placeholder="Number" onChange={handleMainForm} />
              <select className="select" name="repeatType" onChange={handleMainForm}>
                <option value="1">Day</option>
                <option value="2">Weeks</option>
                <option value="3">Month</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="recurrence" className="label">Ends on:</label>
              <label className="label">
                <input type="radio" name="endType" value="eoy" onChange={handleMainForm} className="radio mr-2" defaultChecked />
                End of Year
              </label>
              <label className="label">
                <input type="radio" name="endType" value="date" onChange={handleMainForm} className="radio mr-2" />
                {/* <Datepicker id="recurrence" name="endDate" /> */}
                <input type="date" name="endDate" className="input" onChange={handleMainForm} />
              </label>
            </div>
          </div>
        )}
        <button className="btn" type="submit">
          {loading ? (<span className="loading loading-spinner"></span>) : (null)}
          Make Booking
        </button>
      </form>

      {/* Confirmation Modal */}
      <dialog id="confirmationModal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Please Confirm!</h3>
          <p className="py-4">You are about to make a booking for:</p>
          <div className="flex flex-col gap-2">
            {confirmedBooking.map((booking, index) => (
              <div key={index} className="border border-gray-300 p-2 rounded">
                <p><strong>Location:</strong> {roomList?.find(room => room.id === booking.roomId)?.name || 'Unknown'}</p>
                <p><strong>Date:</strong> {format(new Date(booking.date),"dd MMMM yyyy")}</p>
                <p><strong>Time:</strong> {booking.startTime} - {booking.endTime}</p>
                <p><strong>Purpose:</strong> {booking.description}</p>
              </div>
            ))}
          </div>
          <div className="modal-action">
            <form method="dialog">
              <div className="flex gap-2">
                <button onClick={() => resetForms()} className="btn">Cancel</button>
                <button onClick={confirmBooking} className="btn">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </dialog>

      {/* Alert Modal for Errors */}
      <dialog id="roomBookedModal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Sorry!</h3>
          <p className="py-4">Room just got booked for that timeslot!</p>
          <p className="py-4">Please refresh the browser or contact the parish office.</p>
        </div>
      </dialog>

      <dialog id="emptyFields" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Sorry!</h3>
          <p className="py-4">Please fill all the fields.</p>
        </div>
      </dialog>

      <dialog id="multidayConflict" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Sorry!</h3>
          <p className="py-4">The following bookings could not be made due to conflicts:</p>
          {errorBookings.map((errormsg, index) => (
            <p key={index} className="py-1">{errormsg}</p>
          ))}
        </div>
      </dialog>
    </div>
  )
}

export default RoomBookingForm