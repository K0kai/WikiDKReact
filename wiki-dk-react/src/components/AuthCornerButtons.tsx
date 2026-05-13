import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useContext } from "react";

function AuthCornerButtons()
{
  const authContext = useContext(AuthContext);

   if (!authContext) {
    throw new Error("AuthCornerButtons must be used within an AuthProvider");
  }

  const { isAuthenticated } = authContext;
 
  const navigate = useNavigate();
  
  function getButtons(){
    if(isAuthenticated){
      return <button onClick={() => {
        authContext?.logout();
      }} className="logout-button cornerbtn">Logout</button>
    } else {
      return (
        <>
          <button className="register-button cornerbtn" onClick={() => navigate('/register')} hidden={authContext?.isAuthenticated}>Registrar</button>
          <button className="login-button cornerbtn" onClick={() => navigate('/login')} hidden={authContext?.isAuthenticated}>Login</button>
        </>
      );
    }
  }
  
  return(  
    <div className="log-or-register">
      <img src={`${authContext.user?.userIcon ?? "https://cdn-icons-png.flaticon.com/512/149/149071.png"}`} alt="User Icon" className="pthover user-icon circular" onClick={() => {navigate("/user")}} />
      <div className="auth-options">
        {getButtons()}
      </div>
    </div>
  )
  


}

export default AuthCornerButtons;
