import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin } from 'lucide-react';
import { getBookingsByDateRange } from '../utils/firebase';
import { addDays, format } from 'date-fns';
import { Bookings } from '../utils/types';
import { useGeneralStore } from '../utils/store';

const WeeklyBookingView = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [bookings, setBookings] = useState<Bookings[]>([]);
  const roomsList = useGeneralStore(state => state.rooms);
  // const ministriesList = useGeneralStore(state => state.ministries);

  // Get start of current week (Sunday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const weekStart = getWeekStart(currentWeek);

  // Generate week days
  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      days.push(date);
    }
    return days;
  }, [weekStart]);

  // Group bookings by date
  useEffect(() => {
    getBookings();
  },[weekStart])

  const getBookings = async () => {
    const startDate = getWeekStart(currentWeek);
    const startDateFormatted = format(startDate, 'yyyy-MM-dd');
    const startDatePlusSeven = format(addDays(startDate, 7), 'yyyy-MM-dd');
    const bookings = await getBookingsByDateRange(startDateFormatted, startDatePlusSeven);
    setBookings(bookings);
  }

  // Navigation functions
  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getRoomName = (roomId: string) => {
    const room = roomsList.find(room => room.id === roomId);
    return room ? room.name : 'Unknown Room';
  }

  // const getMinistry = (ministryId: string) => {
  //   const ministry = ministriesList.find(ministry => ministry.id === ministryId);
  //   return ministry ? ministry.name : 'Unknown Ministry';
  // }

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  // const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // const getRoomColor = (room) => {
  //   const colors = {
  //     'Conference Room A': 'bg-blue-100 text-blue-800 border-blue-200',
  //     'Conference Room B': 'bg-green-100 text-green-800 border-green-200',
  //     'Meeting Room 1': 'bg-purple-100 text-purple-800 border-purple-200',
  //     'Meeting Room 2': 'bg-orange-100 text-orange-800 border-orange-200',
  //   };
  //   return colors[room] || 'bg-gray-100 text-gray-800 border-gray-200';
  // };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-main text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Weekly Room Bookings</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={goToPreviousWeek}
                className="p-2 hover:bg-accentOne rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToCurrentWeek}
                className="px-4 py-2 bg-sub hover:bg-accentOne rounded-lg transition-colors text-sm font-medium"
              >
                This Week
              </button>
              <button
                onClick={goToNextWeek}
                className="p-2 hover:bg-accentOne rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="text-lg">
            {weekDays[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} - {' '}
            {weekDays[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        {/* Weekly View */}
        <div className="p-6">
          <div className="space-y-6">
            {weekDays.map((day, index) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const UnsortDayBookings = bookings.filter(booking => booking.date === dateStr) || [];
              const dayBookings = UnsortDayBookings.sort((a, b) => {
                if (a.roomId == b.roomId) {
                    return (a.startTime < b.startTime) ? -1 : (a.startTime > b.startTime) ? 1 : 0;
                } else {
                    return a.roomId.localeCompare(b.roomId)
                }
            });
              const today = isToday(day);

              return (
                <div key={dateStr} className={`border rounded-lg overflow-hidden ${today ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                  {/* Day Header */}
                  <div className={`p-4 border-b ${today ? 'bg-blue-100 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <h3 className={`text-lg font-semibold ${today ? 'text-blue-800' : 'text-gray-900'}`}>
                          {dayNames[index]}
                        </h3>
                        <span className={`text-sm ${today ? 'text-blue-600' : 'text-gray-500'}`}>
                          {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        {today && (
                          <span className="px-2 py-1 bg-main text-white text-xs font-medium rounded-full">
                            Today
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${today ? 'text-blue-600' : 'text-gray-500'}`}>
                          {dayBookings.length} booking{dayBookings.length !== 1 ? 's' : ''}
                        </span>
                        <button
                          onClick={() => {
                            console.log(`Navigate to booking page for date: ${dateStr}`);
                          }}
                          className="p-1 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bookings */}
                  <div className="p-4">
                    {dayBookings.length > 0 ? (
                      <div className="space-y-3">
                        {dayBookings.map(booking => (
                          <div key={booking.id} className="flex items-center space-x-4 p-4 border border-accentOne bg-sub rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium text-sm">
                                {booking.startTime} - {booking.endTime}
                              </span>
                            </div>
                            <div className='flex-1'>
                              <p className="text-sm text-gray-500">Booked by {booking.ministry}</p>
                              <p className="text-xs text-gray-500">{booking.phoneNumber}</p>
                            </div>
                            <div className="flex-2">
                              <h2 className="font-semibold text-gray-900">{booking.description}</h2>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-lg border`}>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{getRoomName(booking.roomId)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p>No bookings scheduled for this day</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-6">
              <span>Total bookings this week: {Object.values(bookings).flat().length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyBookingView;