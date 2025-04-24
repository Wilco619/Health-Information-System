import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../auth/services/api';

const ClientProfile = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClientProfile();
  }, [id]);

  const fetchClientProfile = async () => {
    try {
      const response = await api.get(`/clients/${id}/profile/`);
      setClient(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch client profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>;
  if (error) return <div className="alert alert-danger m-4">{error}</div>;
  if (!client) return <div className="alert alert-info m-4">No client found</div>;

  return (
    <div className="container mt-4">
      <h2>Client Profile</h2>
      
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
          <h4 className="card-title">Enrolled Programs</h4>
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
    </div>
  );
};

export default ClientProfile;