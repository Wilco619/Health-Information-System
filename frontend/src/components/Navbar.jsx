import { useAuth } from '../auth/hooks/useAuth'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Health Information System
        </Link>
        
        {user && (
          <div className="navbar-nav ms-auto">
            <span className="nav-item nav-link text-light">
              Welcome, {user.username}
            </span>
            <button 
              className="btn btn-outline-light ms-2" 
              onClick={logout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar