import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, X } from 'lucide-react';
import { Bookings } from '../utils/types';
import { getBookingsByDateRange } from '../utils/firebase';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import RoomBookingForm from '../components/booking/RoomBookingForm';
import { isLoggedIn } from '../utils/firebase';
import { useGeneralStore } from '../utils/store';

const BookingCalendar = () => {
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Bookings[]>([]);
  interface SelectedDay {
    date: string;
    bookings: Bookings[];
  }
  const [selectedDay, setSelectedDay] = useState<SelectedDay | null>(null);
  const [bookingRoom , setBookingRoom] = useState<boolean>(false);

  const roomsList = useGeneralStore((state) => state.rooms);
  // const ministries = useGeneralStore((state) => state.ministries);
  
  useEffect(() => {
    const fetchBookings = async () => {
      // Get bookings from start of moth to end of month
      const startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(currentDate), 'yyyy-MM-dd');
      const bookings = await getBookingsByDateRange(startDate,endDate);
      console.log("Bookings fetched: ", bookings);
      setBookings(bookings);
    };
    
    fetchBookings();
  },[currentDate])

  // Get current month details
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Create booking count map
  const bookingCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    bookings.forEach(booking => {
      const date = booking.date;
      counts[date] = (counts[date] || 0) + 1;
    });
    return counts;
  }, [bookings]);

  // Get bookings for a specific date
  const getBookingsForDate = (dateStr: string) => {
    return bookings.filter(booking => booking.date === dateStr);
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  // Format date for comparison
  const formatDate = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // Handle day click
  const handleDayClick = (day: number) => {
    const dateStr = formatDate(day);
    const dayBookings = getBookingsForDate(dateStr);
    setSelectedDay({ date: dateStr, bookings: dayBookings });
  };

  // Generate calendar days
  const calendarDays = [];
  
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-20"></div>);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDate(day);
    const bookingCount = bookingCounts[dateStr] || 0;
    const hasBookings = bookingCount > 0;
    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

    calendarDays.push(
      <div
        key={day}
        onClick={() => handleDayClick(day)}
        className={`
          h-20 border p-2 relative transition-all duration-200 cursor-pointer
          hover:bg-blue-50 hover:border-blue-300
          ${isToday ? 'bg-sub border-accentOne' : 'border-gray-300'}
        `}
      >
        <div className={`text-sm font-medium ${isToday ? 'text-accenttwo' : ''}`}>
          {day}
        </div>
        {hasBookings && (
          <div className="absolute bottom-1 right-1">
            <span className="inline-flex items-center justify-center w-8 h-8 text-lsm bg-accentOne rounded-full">
              {bookingCount}
            </span>
          </div>
        )}
      </div>
    );
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="max-w-6xl mx-auto rounded-lg">
      <div className="bg-surface dark:bg-surfaceDark rounded-lg shadow-lg">
        {/* Header */}
        <div className="bg-main text-gray-200 p-6">
          <div className="flex items-center justify-center md:justify-between">
            <div className="hidden md:flex items-center space-x-3">
              <Calendar className="w-8 h-8" />
              <h1 className="text-sm md:text-2xl font-bold">Calendar View</h1>
            </div>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-accentOne hover:cursor-pointer rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold min-w-32 text-center">
                {monthNames[month]} {year}
              </h2>
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-accentOne hover:cursor-pointer rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-6">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-0 mb-2">
            {dayNames.map(day => (
              <div key={day} className="p-2 md:p-3 text-sm md:text-lg text-center font-semibold bg-sub">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-0">
            {calendarDays}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-sub border border-accenttwo rounded"></div>
              <span>Today</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-accentOne rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">X</span>
              </div>
              <span>Number of bookings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface dark:bg-surfaceDark rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-hidden flex flex-col">
            <div className="bg-main text-white p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Bookings for {new Date(selectedDay.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              <button
                onClick={() => setSelectedDay(null)}
                className="p-1 hover:bg-mainLight rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {selectedDay.bookings.length > 0 ? (
                <div className="space-y-3">
                  {selectedDay.bookings.map(booking => (
                    <div key={booking.id} className="border  border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* <h4 className="font-semibold text-xl text-gray-900 mb-2">{ministries.find(min => min.id === booking.ministry)?.name}</h4> */}
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4" />
                              <span>{roomsList.find(room => room.id === booking.roomId)?.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4" />
                              <span>{booking.startTime} - {booking.endTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16  text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-600 mb-2">No bookings scheduled</h4>
                  <p className="text-gray-500">This day is available for new bookings.</p>
                </div>
              )}
            </div>
            <div className="border-t border-gray-200 p-4 flex-shrink-0">
              {isLoggedIn() && <button
                onClick={() => {
                  setBookingRoom(true);
                }}
                className="w-full bg-main hover:bg-mainLight text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Book a Room</span>
              </button>}
            </div>
          </div>
        </div>
      )}
      {/* Booking Modal */}
      { bookingRoom && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface dark:bg-surfaceDark rounded-lg shadow-xl max-w-2xl max-h-200 w-full overflow-hidden flex flex-col">
            <div className="bg-main text-white p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Book a Room</h3>
              <button
                onClick={() => setBookingRoom(false)}
                className="p-1 hover:bg-mainLight rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className='p-10 overflow-y-auto flex-1'>
              <RoomBookingForm date={selectedDay?.date} roomsList={roomsList}/>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;