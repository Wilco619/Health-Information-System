import { Link } from 'react-router-dom';
import { useAuth } from '../auth/hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Health Information System
        </Link>
        
        {user && (
          <>
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/programs">Programs</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/clients">Clients</Link>
                </li>
              </ul>
              
              <div className="navbar-nav">
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
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;