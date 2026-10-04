import { Navigate, Route, Routes } from 'react-router-dom';
import { NavBar } from './components/navbar/NavBar';
import { LogIn } from './components/auth/LogIn';
import { SignUp } from './components/auth/SignUp';
import { UserView } from './components/User/UserView';
import { MovieView } from './components/Customer/MovieView';
import { SeatSelection } from './components/Customer/SeatSelection';
import { BookingView } from './components/Customer/BookingView';
import { PaymentView } from './components/Customer/PaymentView';
import { ShowView } from './components/Customer/ShowView';
import { TheatreView } from './components/Customer/TheatreView';
import { AuthProvider } from './components/auth/AuthProvider';
import { NotFound } from './components/other/NotFound';
import { AdminMovieView } from './components/Admin/AdminMovieView';
import { AdminShowView } from './components/Admin/AdminShowView';
import { AdminTheatreView } from './components/Admin/AdminTheatreView';

function App() {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-gray-900 text-gray-100">
                <NavBar />
                <Routes>
                    {/* Auth Routes */}
                    <Route path='/' element={<LogIn />} />
                    <Route path='/sign-in' element={<LogIn />} />
                    <Route path='/sign-up' element={<SignUp />} />

                    {/* Customer Routes */}
                    <Route path='/movies' element={<MovieView />} />
                    <Route path='/theatres' element={<TheatreView />} />
                    <Route path='/shows' element={<ShowView />} />
                    <Route path='/shows/movie/:movieId' element={<ShowView />} />
                    <Route path='/shows/theatre/:theatreId' element={<ShowView />} />
                    <Route path='/seats/:showId' element={<SeatSelection />} />
                    <Route path='/book-seats/:showId' element={<SeatSelection />} />
                    <Route path='/my-bookings' element={<BookingView />} />
                    <Route path='/payment/:bookingId' element={<PaymentView />} />

                    {/* Admin Routes */}
                    <Route path='/admin/movies' element={<AdminMovieView />} />
                    <Route path='/admin/shows' element={<AdminShowView />} />
                    <Route path='/admin/theatres' element={<AdminTheatreView />} />
                    <Route path='/users' element={<UserView />} />

                    {/* Fallback */}
                    <Route path='/404' element={<NotFound />} />
                    <Route path='*' element={<Navigate to="/404" replace />} />
                </Routes>
            </div>
        </AuthProvider>
    );
}

export default App;