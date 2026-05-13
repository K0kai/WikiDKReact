import { useNavigate } from 'react-router-dom';
import './Register.css'

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
    return fetch('http://localhost:5119/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ name, email, password })
    });
}
async function submitRegistration(event: React.SubmitEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const navigate = useNavigate();

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

    var response = makeRegisterRequest(username, email, password);
    if ((await response).ok) {
        form.reset();
        navigate('/login')
        alert('Registro bem-sucedido! faça login!.');        
    } else {
        alert('Falha no registro. Por favor, tente novamente.');
    }
}

function Register() {
    return (<div className="auth-container">
        <h2>Cadastro</h2>
        <form className="register authForm" onSubmit={submitRegistration}>
            <input type="text" name="username" className="username-input" placeholder="Nome de usuário" required />
            <input type="email" name="email" className="email-input" placeholder="Email" required />
            <input type="password" name="password" className="password-input" placeholder="Senha" required />
            <input type="password" name="confirmPassword" className="confirm-password-input" placeholder="Confirmar senha" required />
            <p className="password-requirements">A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números.</p>
            <button type="submit" id="register">Registrar</button>
        </form>
    </div>)

}

export default Register