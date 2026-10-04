import React, { useEffect, useState } from 'react';
import { Booking, BookingStatus } from '../../models/Booking';
import BookingService from '../../service/BookingService';
import { useNavigate } from 'react-router-dom';

export const BookingView: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            const data = await BookingService.getMyBookings();
            setBookings(data);
        } catch (error: any) {
            console.error('Failed to load bookings', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                navigate('/sign-in');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (bookingId: string) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await BookingService.cancelBooking(bookingId);
            alert('Booking cancelled successfully.');
            loadBookings();
        } catch (error: any) {
            alert(error.response?.data?.errorDescription || 'Failed to cancel booking.');
        }
    };

    if (loading) return <div className="text-center mt-10 text-white">Loading your bookings...</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-6">My Movie Bookings</h1>

            {bookings.length === 0 ? (
                <div className="bg-gray-800 p-8 rounded-xl text-center text-gray-400">
                    No bookings found. <button onClick={() => navigate('/movies')} className="text-indigo-400 underline ml-2">Browse Movies</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-white flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm font-semibold text-gray-400">Booking #{booking.id}</span>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                        booking.status === BookingStatus.CONFIRMED ? 'bg-green-900 text-green-300' :
                                        booking.status === BookingStatus.CANCELLED ? 'bg-red-900 text-red-300' : 'bg-yellow-900 text-yellow-300'
                                    }`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <p className="text-gray-300">Show ID: <span className="font-semibold text-white">{booking.showId}</span></p>
                                <p className="text-gray-300">Seats: <span className="font-semibold text-indigo-400">{booking.seatNumbers.join(', ')}</span></p>
                                <p className="text-gray-300">Tickets: <span className="font-semibold text-white">{booking.numberOfTickets}</span></p>
                                <p className="text-xl font-bold text-green-400 mt-2">LKR {booking.totalAmount?.toFixed(2)}</p>
                            </div>

                            <div className="flex gap-3 mt-6">
                                {booking.status === BookingStatus.PENDING && (
                                    <button
                                        onClick={() => navigate(`/payment/${booking.id}?amount=${booking.totalAmount}`)}
                                        className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-semibold"
                                    >
                                        Pay Now
                                    </button>
                                )}
                                {booking.status !== BookingStatus.CANCELLED && (
                                    <button
                                        onClick={() => handleCancel(booking.id!)}
                                        className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg font-semibold"
                                    >
                                        Cancel Booking
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};