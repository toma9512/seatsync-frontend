import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../api/auth";
import useAuthStore from "../../store/authStore";
import styles from "./Auth.module.css";

function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const { setToken } = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login(form);
            setToken(res.data.data.token);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "로그인에 실패했습니다.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <h2>로그인</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="이메일"
                        value={form.email}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="비밀번호"
                        value={form.password}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                    {error && <p className={styles.error}>{error}</p>}
                    <button type="submit" className={styles.btn}>
                        로그인
                    </button>
                </form>
                <p className={styles.link}>
                    계정이 없으신가요? <Link to="/signup">회원가입</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
