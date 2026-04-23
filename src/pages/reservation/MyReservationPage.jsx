import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getMyReservations, cancelReservation } from "../../api/reservation";
import styles from "./Reservation.module.css";

function MyReservationPage() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: reservations, isLoading } = useQuery({
        queryKey: ["myReservations"],
        queryFn: () => getMyReservations().then((res) => res.data.data),
    });

    const cancelMutation = useMutation({
        mutationFn: cancelReservation,
        onSuccess: () => {
            alert("예약이 취소되었습니다.");
            queryClient.invalidateQueries({ queryKey: ["myReservations"] });
        },
        onError: (err) => {
            alert(err.response?.data?.message || "취소에 실패했습니다.");
        },
    });

    const handleCancel = (reservationId) => {
        if (window.confirm("예약을 취소하시겠습니까?")) {
            cancelMutation.mutate(reservationId);
        }
    };

    const handleConfirm = (seatId) => {
        navigate("/reservations", { state: { seatId } });
    };

    const getStatusLabel = (status) => {
        if (status === "CONFIRMED")
            return { label: "예약 확정", color: "#22c55e" };
        if (status === "PENDING") return { label: "선점 중", color: "#f59e0b" };
        if (status === "CANCELLED")
            return { label: "취소됨", color: "#ef4444" };
        return { label: status, color: "#888" };
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>내 예약 목록</h1>

            {isLoading ? (
                <p className={styles.loading}>로딩 중...</p>
            ) : reservations?.length === 0 ? (
                <p className={styles.empty}>예약 내역이 없습니다.</p>
            ) : (
                <div className={styles.list}>
                    {reservations?.map((reservation) => {
                        const { label, color } = getStatusLabel(
                            reservation.status,
                        );
                        return (
                            <div
                                key={reservation.id}
                                className={styles.reservationCard}>
                                <div className={styles.reservationInfo}>
                                    <div className={styles.seatInfo}>
                                        <span className={styles.seatNumber}>
                                            {reservation.seatNumber}
                                        </span>
                                        <span className={styles.grade}>
                                            {reservation.grade}
                                        </span>
                                    </div>
                                    <p className={styles.price}>
                                        {reservation.price.toLocaleString()}원
                                    </p>
                                    <p className={styles.date}>
                                        {new Date(
                                            reservation.reservedAt,
                                        ).toLocaleString("ko-KR")}
                                    </p>
                                </div>
                                <div className={styles.reservationRight}>
                                    <span
                                        className={styles.status}
                                        style={{ color }}>
                                        {label}
                                    </span>
                                    {reservation.status === "PENDING" && (
                                        <button
                                            onClick={() =>
                                                handleConfirm(
                                                    reservation.seatId,
                                                )
                                            }
                                            className={styles.confirmBtn2}>
                                            예약 확정
                                        </button>
                                    )}
                                    {reservation.status === "CONFIRMED" && (
                                        <button
                                            onClick={() =>
                                                handleCancel(reservation.id)
                                            }
                                            className={styles.cancelBtn2}>
                                            취소
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default MyReservationPage;
