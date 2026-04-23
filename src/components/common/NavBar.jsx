import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import styles from "./Navbar.module.css";

function Navbar() {
    const { isLoggedIn, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className={styles.navbar}>
            <Link to="/" className={styles.logo}>
                🎫 SeatSync
            </Link>
            <div className={styles.menu}>
                {isLoggedIn ? (
                    <>
                        <Link to="/my-reservations">내 예약</Link>
                        <button
                            onClick={handleLogout}
                            className={styles.logoutBtn}>
                            로그아웃
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">로그인</Link>
                        <Link to="/signup">회원가입</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
