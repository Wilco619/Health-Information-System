import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../auth/services/api';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);

  // Fetch all clients on component mount
  useEffect(() => {
    fetchClients();
  }, []);

  // Filter clients whenever search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredClients(clients);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = clients.filter(client => 
      client.full_name.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      client.phone_number.toLowerCase().includes(query) ||
      (client.national_id && client.national_id.toLowerCase().includes(query))
    );
    setFilteredClients(filtered);
  }, [searchQuery, clients]);

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients/');
      const clientsData = response.data.results || response.data || [];
      setClients(clientsData);
      setFilteredClients(clientsData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch clients');
      console.error('API Error:', err);
      setClients([]);
      setFilteredClients([]);
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
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="btn btn-outline-secondary"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {filteredClients.length > 0 ? (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive" style={{ 
              maxHeight: '600px', 
              overflowY: 'auto'
            }}>
              <table className="table table-hover">
                <thead style={{ 
                  position: 'sticky', 
                  top: 0, 
                  backgroundColor: 'white',
                  zIndex: 1 
                }}>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Registered Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map(client => (
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
            {searchQuery && (
              <div className="text-muted mt-2">
                Found {filteredClients.length} of {clients.length} clients
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="alert alert-info">
          {searchQuery 
            ? 'No clients match your search criteria.' 
            : 'No clients found in the system.'}
        </div>
      )}
    </div>
  );
};

export default ClientList;