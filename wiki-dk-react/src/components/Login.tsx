import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import './Register.css';

function Login() {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("Login must be used within an AuthProvider");
    }

    async function submitLogin(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);
        const name = formData.get('username') as string;
        const password = formData.get('password') as string;

        var resp = authContext?.login(name, password);

        if (resp)
            alert("Login successful!");
    }

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form className="login authForm" onSubmit={submitLogin}>
                <input type="text" className="authInput" name="username" placeholder="Usuário" required />
                <input type="password" className="authInput" name="password" placeholder="Senha" required />
                <button id="login" type="submit">Entrar</button>
            </form>
            <p className="fontsmall fontinter"><u>Não lembra sua senha? contate Kokai</u></p>
            <p className="fontsmall fontinter">Recuperação de senha em breve</p>
        </div>
    );
}

export default Login;