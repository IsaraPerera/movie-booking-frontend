import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingService from '../../service/BookingService';
import ShowService from '../../service/ShowService';

const AVAILABLE_SEATS = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4'];

export const SeatSelection: React.FC = () => {
    const { showId } = useParams<{ showId: string }>();
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [ticketPrice, setTicketPrice] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    // Load the real ticket price for display. The backend recalculates the
    // total itself when the booking is created.
    useEffect(() => {
        if (!showId) return;
        ShowService.getShowById(showId)
            .then((show) => setTicketPrice(Number(show.ticketPrice) || 0))
            .catch((err) => console.error('Failed to load show', err));
    }, [showId]);

    const toggleSeat = (seat: string) => {
        if (selectedSeats.includes(seat)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seat));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    const totalAmount = selectedSeats.length * ticketPrice;

    const handleBooking = async () => {
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat.');
            return;
        }
        if (!showId) {
            alert('Missing show reference.');
            return;
        }

        setLoading(true);
        try {
            await BookingService.createBooking({
                showId: showId,
                seatNumbers: selectedSeats,
                numberOfTickets: selectedSeats.length
            });

            alert('Booking created successfully! Proceeding to payment.');
            navigate('/my-bookings');
        } catch (error: any) {
            console.error('Create booking failed:', error);

            if (error.response?.status === 401) {
                alert('Please sign in to book seats.');
                navigate('/sign-in');
            } else {
                // Shows the HTTP status and the server's message so the real
                // cause is visible. "no response" means the request never got
                // an answer (network / CORS), not a server-side error.
                const status = error.response?.status;
                const data = error.response?.data;
                const detail =
                    data?.errorDescription ||
                    data?.message ||
                    data?.error ||
                    (typeof data === 'string' ? data : '');
                alert(
                    'Failed to create booking' +
                    (status ? ` (HTTP ${status})` : ' (no response from server)') +
                    (detail ? `: ${detail}` : '.')
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto my-10 bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700 text-white">
            <h1 className="text-2xl font-bold mb-2 text-center">Select Your Seats</h1>
            <p className="text-gray-400 text-center mb-6">Click on available seats to reserve them for your show.</p>

            <div className="w-full bg-indigo-600/30 text-indigo-300 text-center py-2 rounded-md mb-8 font-semibold tracking-widest border border-indigo-500/50">
                STAGE / SCREEN THIS WAY
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
                {AVAILABLE_SEATS.map((seat) => {
                    const isSelected = selectedSeats.includes(seat);
                    return (
                        <button
                            key={seat}
                            onClick={() => toggleSeat(seat)}
                            className={`py-3 rounded-lg font-bold border transition ${
                                isSelected
                                    ? 'bg-green-600 text-white border-green-500 shadow-lg scale-105'
                                    : 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
                            }`}
                        >
                            {seat}
                        </button>
                    );
                })}
            </div>

            <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <p className="text-sm text-gray-400">Selected Seats: <span className="text-white font-semibold">{selectedSeats.join(', ') || 'None'}</span></p>
                    <p className="text-sm text-gray-400">Tickets: <span className="text-white font-semibold">{selectedSeats.length}</span></p>
                    <p className="text-xl font-bold text-green-400 mt-1">Total: LKR {totalAmount.toFixed(2)}</p>
                </div>

                <button
                    onClick={handleBooking}
                    disabled={selectedSeats.length === 0 || loading}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-3 rounded-lg transition disabled:bg-gray-600"
                >
                    {loading ? 'Processing...' : 'Confirm & Book Tickets'}
                </button>
            </div>
        </div>
    );
};