import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin } from 'lucide-react';
import { Bookings } from '../utils/types';
import { useGeneralStore } from '../utils/store';

const PaginatedList = ({bookings} : {bookings:Bookings[]}) => {

  //console.log("PaginatedList bookings: ", bookings);

  const [activeTab, setActiveTab] = useState('upcoming');
  const [currentPage, setCurrentPage] = useState(1);
  const roomList = useGeneralStore((state) => state.rooms);
  const itemsPerPage = 5;

  // Filter and sort bookings based on active tab
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredBookings = bookings
    .filter(booking => {
      const bookingDate = new Date(booking.date);
      bookingDate.setHours(0, 0, 0, 0);
      
      if (activeTab === 'past') {
        return bookingDate < today;
      } else {
        return bookingDate >= today;
      }
    })
    .sort((a, b) => {
      // First sort by date
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      if (dateA.getTime() !== dateB.getTime()) {
        if (activeTab === 'past') {
          // For past bookings, show most recent first (descending)
          return dateB.getTime() - dateA.getTime();
        } else {
          // For upcoming bookings, show earliest first (ascending)
          return dateA.getTime() - dateB.getTime();
        }
      }
      
      // If dates are the same, sort by start time
      const [hoursA, minutesA] = a.startTime.split(':').map(Number);
      const [hoursB, minutesB] = b.startTime.split(':').map(Number);
      const timeA = hoursA * 60 + minutesA;
      const timeB = hoursB * 60 + minutesB;
      
      return timeA - timeB; // Always ascending for time within the same day
    });

  // Calculate pagination based on filtered bookings
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  const formatDate = (dateString:string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString:string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const goToPage = (page:number) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleTabChange = (tab:string) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  const getPaginationNumbers = () => {
    const maxPages = window.innerWidth < 640 ? 3 : 5; // Adjust based on screen size
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);
    
    // Adjust startPage if we're near the end
    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  return (
    <div className="w-full mx-auto p-2 md:p-6">
      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => handleTabChange('upcoming')}
              className={`py-2 px-1 border-b-2 font-medium text-xs md:text-sm transition-colors ${
                activeTab === 'upcoming'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upcoming Bookings
              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                activeTab === 'upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {bookings.filter(booking => {
                  const bookingDate = new Date(booking.date);
                  bookingDate.setHours(0, 0, 0, 0);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return bookingDate >= today;
                }).length}
              </span>
            </button>
            <button
              onClick={() => handleTabChange('past')}
              className={`py-2 px-1 border-b-2 font-medium text-xs md:text-sm transition-colors ${
                activeTab === 'past'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Past Bookings
              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                activeTab === 'past' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {bookings.filter(booking => {
                  const bookingDate = new Date(booking.date);
                  bookingDate.setHours(0, 0, 0, 0);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return bookingDate < today;
                }).length}
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <div className="text-sm font-medium text-gray-900">
                        {roomList.find(room => room.id === booking.roomId)?.name || 'Unknown Room'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <div className="text-sm text-gray-900">
                        {formatDate(booking.date)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <div className="text-sm text-gray-900">
                        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        !booking.pending
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {!booking.pending ? 'Confirmed' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="hidden md:flex text-sm text-gray-700">
          Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
          <span className="font-medium">{Math.min(endIndex, filteredBookings.length)}</span> of{' '}
          <span className="font-medium">{filteredBookings.length}</span> {activeTab === 'past' ? 'past' : 'upcoming'} bookings
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPrevious}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="flex space-x-1">
            {getPaginationNumbers().map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`relative inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  page === currentPage
                    ? 'bg-blue-600 text-white border border-blue-600'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={goToNext}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginatedList;