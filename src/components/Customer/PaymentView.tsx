import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import PaymentService from '../../service/PaymentService';
import { PaymentStatus } from '../../models/Payment';

export const PaymentView: React.FC = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const [searchParams] = useSearchParams();
    // Display only: the backend charges the booking's own total.
    const amount = Number(searchParams.get('amount')) || 0;

    const [paymentMethod, setPaymentMethod] = useState<string>('CARD');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bookingId) {
            alert('Missing booking reference.');
            return;
        }

        setLoading(true);
        try {
            await PaymentService.processPayment({
                bookingId: bookingId,
                amount: amount,
                paymentMethod: paymentMethod,
                status: PaymentStatus.COMPLETED
            });

            alert('Payment completed successfully! Your booking is now CONFIRMED.');
            navigate('/my-bookings');
        } catch (error: any) {
            alert(error.response?.data?.errorDescription || 'Payment processing failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto my-12 bg-gray-800 p-8 rounded-xl border border-gray-700 text-white shadow-2xl">
            <h1 className="text-2xl font-bold mb-4 text-center">Checkout & Payment</h1>
            <div className="bg-gray-700/50 p-4 rounded-lg mb-6 text-center">
                <p className="text-sm text-gray-400">Booking Reference #{bookingId}</p>
                <p className="text-3xl font-bold text-green-400 mt-1">LKR {amount.toFixed(2)}</p>
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Payment Method</label>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white"
                    >
                        <option value="CARD">Credit / Debit Card</option>
                        <option value="ONLINE_BANKING">Online Banking</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition disabled:bg-gray-600 mt-4"
                >
                    {loading ? 'Processing Payment...' : `Pay LKR ${amount.toFixed(2)}`}
                </button>
            </form>
        </div>
    );
};