import { useEffect, useState } from 'react';
import { Bookings, Room } from '../utils/types';
import { getBookingsByDate, getRoomsList } from '../utils/firebase';
import { Link } from 'react-router';
import { format } from 'date-fns';

export default function FreeRooms() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
          setCurrentTime(new Date());
        }, 1000);
    
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true);
            try {
                const data : Bookings[] = await getBookingsByDate(format(new Date(), 'yyyy-MM-dd'));
                const allRooms : Room[] = await getRoomsList();

                const bookedRoomIds = data.filter(booking => {
                    const currentTime = new Date().getTime();

                    const [startHours, startMinutes] = booking.startTime.split(':').map(Number);
                    const [endHours, endMinutes] = booking.endTime.split(':').map(Number);
                    const bookingStartTime = new Date().setHours(startHours, startMinutes, 0, 0);
                    const bookingEndTime = new Date().setHours(endHours, endMinutes, 0, 0);

                    return currentTime >= bookingStartTime && currentTime <= bookingEndTime;
                }).map(booking => booking.roomId);

                const availableRooms = allRooms.filter(room => !bookedRoomIds.includes(room.id));
                setRooms(availableRooms);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();

        const intervalId = setInterval(() => {
            const now = new Date();
            if (now.getMinutes() === 0) {
                fetchRooms();
            }
        }, 60000); // Check every minute
      
        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);

    if (loading) {
        return <div>Loading available rooms...</div>;
    }

    return (
        <div>
            <p className='text-2xl font-semibold'>Currently Available Rooms:</p>
            <p>Current Time: {currentTime.toLocaleTimeString()}</p>
            {rooms.length > 0 ? (
                <div className='grid grid-cols-2 xl:grid-cols-4 mt-5 w-full gap-2'>
                    {rooms.map(room => (
                        <div key={room.id} className='flex flex-col gap-4 w-full bg-base-300 p-4 rounded-lg'>
                            <p className='text-2xl font-semibold'>{room.name}</p>
                            <img 
                                src={"https://thumbs.dreamstime.com/b/office-room-7881663.jpg"} alt={room.name} 
                                className=' object-cover rounded-lg'
                            />
                            <Link to={'/bookings/'+room.id} className='h-full w-full'><button className="btn shadow-sm w-full">Book Room</button></Link>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No rooms are available at the moment.</p>
            )}
            
        </div>
    );
};