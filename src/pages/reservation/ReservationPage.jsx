import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { confirmReservation, getRemainingTime } from "../../api/reservation";
import styles from "./Reservation.module.css";

function ReservationPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!state?.seatId) {
            navigate("/");
            return;
        }

        // Redis TTL 남은 시간 가져오기
        getRemainingTime(state.seatId)
            .then((res) => {
                setTimeLeft(res.data.data);
            })
            .catch(() => {
                alert("선점 시간이 만료되었습니다.");
                navigate("/");
            });
    }, []);

    useEffect(() => {
        if (timeLeft === null) return;

        if (timeLeft <= 0) {
            alert("선점 시간이 만료되었습니다.");
            navigate("/");
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    alert("선점 시간이 만료되었습니다.");
                    navigate("/");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        if (seconds === null) return "--:--";
        const m = String(Math.floor(seconds / 60)).padStart(2, "0");
        const s = String(seconds % 60).padStart(2, "0");
        return `${m}:${s}`;
    };

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await confirmReservation(state.seatId);
            alert("예약이 확정되었습니다!");
            navigate("/my-reservations");
        } catch (err) {
            alert(err.response?.data?.message || "예약 확정에 실패했습니다.");
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <h2>예약 확정</h2>
                <p className={styles.desc}>선점한 좌석을 확정하시겠습니까?</p>

                <div className={styles.timer}>
                    <span className={styles.timerLabel}>남은 시간</span>
                    <span
                        className={`${styles.timerValue} ${timeLeft !== null && timeLeft <= 60 ? styles.urgent : ""}`}>
                        {formatTime(timeLeft)}
                    </span>
                </div>

                <div className={styles.buttons}>
                    <button
                        onClick={handleConfirm}
                        className={styles.confirmBtn}
                        disabled={loading || timeLeft === null}>
                        {loading ? "처리 중..." : "예약 확정"}
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className={styles.cancelBtn}>
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReservationPage;
