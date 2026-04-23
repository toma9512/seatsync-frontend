import { Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import EventListPage from "./pages/event/EventListPage";
import EventDetailPage from "./pages/event/EventDetailPage";
import ReservationPage from "./pages/reservation/ReservationPage";
import MyReservationPage from "./pages/reservation/MyReservationPage";
import Navbar from "./components/common/Navbar";

const PrivateRoute = ({ children }) => {
    const { isLoggedIn } = useAuthStore();
    return isLoggedIn ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <EventListPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/events/:id"
                    element={
                        <PrivateRoute>
                            <EventDetailPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/reservations"
                    element={
                        <PrivateRoute>
                            <ReservationPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/my-reservations"
                    element={
                        <PrivateRoute>
                            <MyReservationPage />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </>
    );
}

export default App;
