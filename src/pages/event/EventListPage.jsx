import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../../api/event";
import styles from "./Event.module.css";

function EventListPage() {
    const [filters, setFilters] = useState({ genre: "", keyword: "" });
    const [search, setSearch] = useState({ genre: "", keyword: "" });
    const navigate = useNavigate();

    const { data, isLoading } = useQuery({
        queryKey: ["events", search],
        queryFn: () =>
            getEvents(search).then((res) => {
                console.log("API 응답:", res);
                return res.data.data;
            }),
    });

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch({ ...filters });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>공연 목록</h1>

            <form onSubmit={handleSearch} className={styles.searchBar}>
                <select
                    value={filters.genre}
                    onChange={(e) =>
                        setFilters({ ...filters, genre: e.target.value })
                    }
                    className={styles.select}>
                    <option value="">전체 장르</option>
                    <option value="콘서트">콘서트</option>
                    <option value="뮤지컬">뮤지컬</option>
                    <option value="스포츠">스포츠</option>
                    <option value="연극">연극</option>
                </select>
                <input
                    type="text"
                    placeholder="공연 검색"
                    value={filters.keyword}
                    onChange={(e) =>
                        setFilters({ ...filters, keyword: e.target.value })
                    }
                    className={styles.searchInput}
                />
                <button type="submit" className={styles.searchBtn}>
                    검색
                </button>
            </form>

            {isLoading ? (
                <p className={styles.loading}>로딩 중...</p>
            ) : (
                <div className={styles.grid}>
                    {data?.length === 0 ? (
                        <p className={styles.empty}>검색 결과가 없습니다.</p>
                    ) : (
                        data?.map((event) => (
                            <div
                                key={event.id}
                                className={styles.card}
                                onClick={() => navigate(`/events/${event.id}`)}>
                                <div className={styles.poster}>🎭</div>
                                <div className={styles.info}>
                                    <span className={styles.genre}>
                                        {event.genre}
                                    </span>
                                    <h3 className={styles.eventTitle}>
                                        {event.title}
                                    </h3>
                                    <p className={styles.venue}>
                                        📍 {event.venue}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default EventListPage;
