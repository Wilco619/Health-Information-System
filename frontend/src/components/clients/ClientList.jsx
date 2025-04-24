import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../auth/services/api';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients/');
      // Handle both paginated and non-paginated responses
      setClients(response.data.results || response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch clients');
      console.error('API Error:', err);
      setClients([]); // Initialize as empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent form submission default behavior
    setLoading(true);
    try {
      // Use POST method for search
      const response = await api.post('/clients/search/', {
        query: searchQuery
      });
      setClients(response.data.results || response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to search clients');
      console.error('Search error:', err.response?.data || err);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Clients</h2>
        <Link to="/clients/new" className="btn btn-primary">
          Register New Client
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="btn btn-outline-primary"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {clients.length > 0 ? (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Registered Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map(client => (
                    <tr key={client.id}>
                      <td>{client.full_name}</td>
                      <td>{client.email}</td>
                      <td>{client.phone_number}</td>
                      <td>{new Date(client.registered_at).toLocaleDateString()}</td>
                      <td>
                        <Link 
                          to={`/clients/${client.id}`} 
                          className="btn btn-sm btn-info me-2"
                        >
                          View Profile
                        </Link>
                        <Link 
                          to={`/clients/${client.id}/enroll`} 
                          className="btn btn-sm btn-success"
                        >
                          Enroll
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-info">
          No clients found. {searchQuery && 'Try adjusting your search criteria.'}
        </div>
      )}
    </div>
  );
};

export default ClientList;