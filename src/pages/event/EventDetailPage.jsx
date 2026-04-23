import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getEvent } from "../../api/event";
import { getSchedulesByEvent } from "../../api/schedule";
import { getSeatsBySchedule } from "../../api/seat";
import { holdSeat } from "../../api/reservation";
import styles from "./Event.module.css";

function EventDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    const { data: event } = useQuery({
        queryKey: ["event", id],
        queryFn: () => getEvent(id).then((res) => res.data.data),
    });

    const { data: schedules } = useQuery({
        queryKey: ["schedules", id],
        queryFn: () => getSchedulesByEvent(id).then((res) => res.data.data),
    });

    const { data: seats, refetch: refetchSeats } = useQuery({
        queryKey: ["seats", selectedSchedule],
        queryFn: () =>
            getSeatsBySchedule(selectedSchedule).then((res) => res.data.data),
        enabled: !!selectedSchedule,
    });

    const handleHold = async (seatId) => {
        try {
            await holdSeat(seatId);
            alert("좌석이 선점되었습니다! 5분 안에 예약을 확정해주세요.");
            navigate("/reservations", { state: { seatId } });
        } catch (err) {
            alert(err.response?.data?.message || "선점에 실패했습니다.");
        }
    };

    const getStatusLabel = (status) => {
        if (status === "AVAILABLE")
            return { label: "예약 가능", color: "#22c55e" };
        if (status === "PENDING") return { label: "선점 중", color: "#f59e0b" };
        return { label: "예약 완료", color: "#ef4444" };
    };

    return (
        <div className={styles.container}>
            {event && (
                <>
                    <div className={styles.detailHeader}>
                        <div className={styles.detailPoster}>🎭</div>
                        <div className={styles.detailInfo}>
                            <span className={styles.genre}>{event.genre}</span>
                            <h1 className={styles.detailTitle}>
                                {event.title}
                            </h1>
                            <p className={styles.venue}>📍 {event.venue}</p>
                            <p className={styles.description}>
                                {event.description}
                            </p>
                        </div>
                    </div>

                    <h2 className={styles.sectionTitle}>회차 선택</h2>
                    <div className={styles.scheduleList}>
                        {schedules?.map((schedule) => (
                            <button
                                key={schedule.id}
                                className={`${styles.scheduleBtn} ${selectedSchedule === schedule.id ? styles.selected : ""}`}
                                onClick={() =>
                                    setSelectedSchedule(schedule.id)
                                }>
                                <span>
                                    {new Date(
                                        schedule.startTime,
                                    ).toLocaleString("ko-KR")}
                                </span>
                                <span>잔여 {schedule.remainingSeats}석</span>
                            </button>
                        ))}
                    </div>

                    {selectedSchedule && (
                        <>
                            <h2 className={styles.sectionTitle}>좌석 선택</h2>
                            <div className={styles.seatGrid}>
                                {seats?.map((seat) => {
                                    const { label, color } = getStatusLabel(
                                        seat.status,
                                    );
                                    return (
                                        <button
                                            key={seat.id}
                                            className={styles.seat}
                                            style={{
                                                borderColor: color,
                                                color,
                                            }}
                                            disabled={
                                                seat.status !== "AVAILABLE"
                                            }
                                            onClick={() => handleHold(seat.id)}>
                                            <span>{seat.seatNumber}</span>
                                            <span className={styles.seatPrice}>
                                                {seat.price.toLocaleString()}원
                                            </span>
                                            <span className={styles.seatStatus}>
                                                {label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default EventDetailPage;
