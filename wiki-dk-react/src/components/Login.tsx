import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import './Register.css';
import MessageBox from "./reusable/MessageBox";
import Modal from "./reusable/Modal";
import { useNavigate } from "react-router-dom";

function Login() {
    const authContext = useContext(AuthContext);
    const [modal, setModal] = useState<string>("")
    const navigate = useNavigate();

    if (!authContext) {
        throw new Error("Login must be used within an AuthProvider");
    }
    if (authContext.isAuthenticated)
        navigate(-1);

    async function submitLogin(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);
        const name = formData.get('username') as string;
        const password = formData.get('password') as string;

        var resp = await authContext?.login(name, password) ?? false;

        if (resp){
           setModal("login-success")
           return
        }
        setModal("login-failed")
    }

    function returnOnePage(){
        closeModal();
        navigate(-1)        
    }

    function closeModal(){
        setModal("")
    }

    return (
        <div className="auth-container">
            {modal == "login-success" ? (<Modal onClose={returnOnePage}>
             <><MessageBox title="Confirmação" message="Login bem sucedido!" confirmText="Ok" type="success" onClose={returnOnePage} onConfirm={returnOnePage}></MessageBox></>
             </Modal>) : (<></>)}    
             {modal == "login-failed" ? (<Modal onClose={closeModal}>
             <><MessageBox title="Falha" message="Falha no login, cheque suas credenciais e tente novamente." confirmText="Ok" type="error" onClose={closeModal} onConfirm={closeModal}></MessageBox></>
             </Modal>) : (<></>)}        
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