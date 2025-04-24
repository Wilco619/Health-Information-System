import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { clientAPI } from '../../auth/services/api';

const ClientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchClientProfile();
  }, [id]);

  const fetchClientProfile = async () => {
    try {
      const response = await clientAPI.getProfile(id);
      setClient(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch client profile');
      console.error('Profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await clientAPI.deleteClient(id);
      navigate('/clients');
    } catch (err) {
      setError('Failed to delete client');
      console.error('Delete error:', err);
    }
    setShowDeleteModal(false);
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>;
  if (error) return <div className="alert alert-danger m-4">{error}</div>;
  if (!client) return <div className="alert alert-info m-4">No client found</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Client Profile</h2>
        <div>
          <Link 
            to={`/clients/${id}/edit`}
            className="btn btn-primary me-2"
          >
            Edit Profile
          </Link>
          <button 
            className="btn btn-danger"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Client
          </button>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-body">
          <h3 className="card-title">{client.full_name}</h3>
          <div className="row">
            <div className="col-md-6">
              <p><strong>Email:</strong> {client.email}</p>
              <p><strong>Phone:</strong> {client.phone_number}</p>
              <p><strong>Date of Birth:</strong> {new Date(client.date_of_birth).toLocaleDateString()}</p>
              <p><strong>Gender:</strong> {client.gender}</p>
            </div>
            <div className="col-md-6">
              <p><strong>National ID:</strong> {client.national_id || 'N/A'}</p>
              <p><strong>Blood Type:</strong> {client.blood_type || 'N/A'}</p>
              <p><strong>Registered:</strong> {new Date(client.registered_at).toLocaleDateString()}</p>
              <p><strong>Registered By:</strong> {client.registered_by_username}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Enrolled Programs <span><Link 
                          to={`/clients/${client.id}/enroll`} 
                          className="btn btn-sm btn-success"
                        >
                          Enroll
                        </Link></span></h4>
          
          {client.enrollments && client.enrollments.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Program</th>
                    <th>Enrollment Date</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {client.enrollments.map(enrollment => (
                    <tr key={enrollment.id}>
                      <td>{enrollment.program_name}</td>
                      <td>{new Date(enrollment.enrollment_date).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${enrollment.is_active ? 'bg-success' : 'bg-secondary'}`}>
                          {enrollment.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{enrollment.notes || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No program enrollments found.</p>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDeleteModal(false)}
                />
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete {client.full_name}? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Delete Client
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientProfile;