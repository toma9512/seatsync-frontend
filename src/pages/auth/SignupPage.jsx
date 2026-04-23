import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../../api/auth";
import styles from "./Auth.module.css";

function SignupPage() {
    const [form, setForm] = useState({ email: "", password: "", name: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(form);
            alert("회원가입이 완료되었습니다!");
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "회원가입에 실패했습니다.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <h2>회원가입</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="이름"
                        value={form.name}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
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
                        회원가입
                    </button>
                </form>
                <p className={styles.link}>
                    이미 계정이 있으신가요? <Link to="/login">로그인</Link>
                </p>
            </div>
        </div>
    );
}

export default SignupPage;
