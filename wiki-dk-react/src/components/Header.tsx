import dkLogo from '../assets/dk_transp.png'
import './Header.css'
import './AuthCornerButtons'
import AuthCornerButtons from './AuthCornerButtons'
import { useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()

  return (
    <header className="full fixed z-10">
    <section id="header" className='full'>
      <div className="header-content">
        <button className="logoBtnWrapper" onClick={() => navigate('/')}>
          <img id="header_logo" src={dkLogo} />
        </button>
        <div>
          <h1 id="header_title" className='fontcinzel'>WikiDK</h1>
          <p className='fontinter header_subtitle'>Central de guias, recursos e regras para o clan de swordplay</p>
        </div>
        <AuthCornerButtons/>
      </div>
    </section>
    </header>
  )
}

export default Header
