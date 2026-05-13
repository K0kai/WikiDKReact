import { useNavigate } from "react-router-dom";
import "./Register.css"

const API_URL = import.meta.env.VITE_API_URL

function Register() {

    const navigate = useNavigate();

    function checkPasswordMatch(password: string, confirmPassword: string): boolean {
        return password === confirmPassword;
    }

    function validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password: string): boolean {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        return hasUpperCase && hasLowerCase && hasNumber && password.length >= minLength;
    }

    async function makeRegisterRequest(name: string, email: string, password: string): Promise<Response> {
        return fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
    }

    async function submitRegistration(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);

        const username = formData.get('username') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (!checkPasswordMatch(password, confirmPassword)) {
            alert('As senhas não coincidem.');
            return;
        }

        if (!validateEmail(email)) {
            alert('Por favor, insira um email válido.');
            return;
        }

        if (!validatePassword(password)) {
            alert('A senha não atende aos requisitos.');
            return;
        }

        const response = await makeRegisterRequest(username, email, password);

        if (response.ok) {
            form.reset();
            navigate('/login');
            alert('Registro bem-sucedido! faça login!.');
        } else {
            alert('Falha no registro. Por favor, tente novamente.');
        }
    }

    return (
        <div className="auth-container">
            <h2>Cadastro</h2>
            <form className="register authForm" onSubmit={submitRegistration}>
                <input type="text" className="authInput" name="username" placeholder="Nome de usuário" required />
                <input type="email" className="authInput" name="email" placeholder="Email" required />
                <input type="password" className="authInput" name="password" placeholder="Senha" required />
                <input type="password" className="authInput" name="confirmPassword" placeholder="Confirmar senha" required />
                <p className="password-requirements">A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números.</p>
                <button id="register" type="submit">Registrar</button>
            </form>
        </div>
    );
}

export default Register;