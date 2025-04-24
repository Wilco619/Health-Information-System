import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../auth/services/api';

const ClientEnrollment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [client, setClient] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [formData, setFormData] = useState({
    program_id: '',
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientResponse, programsResponse] = await Promise.all([
          api.get(`/clients/${id}/`),
          api.get('/programs/')
        ]);
        
        // Ensure we're getting an array from the response
        const programsData = programsResponse.data.results || programsResponse.data || [];
        
        setClient(clientResponse.data);
        setPrograms(Array.isArray(programsData) ? programsData : []);
        setError(null);
      } catch (err) {
        setError('Failed to load required data');
        console.error('Loading error:', err);
        setPrograms([]); // Initialize as empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/clients/${id}/enroll/`, formData);
      navigate(`/clients/${id}`);
    } catch (err) {
      // Handle specific error messages from the backend
      const errorMessage = err.response?.data?.non_field_errors?.[0] || 
                         err.response?.data?.message ||
                         'Failed to enroll client in program';
      setError(errorMessage);
      console.error('Enrollment error:', err.response?.data || err);
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

  if (!client) {
    return (
      <div className="alert alert-danger m-4">
        Client not found
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">Enroll Client in Program</h2>
              
              <div className="alert alert-info">
                <strong>Client:</strong> {client.full_name}
              </div>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="program_id" className="form-label">Select Program</label>
                  <select
                    className="form-select"
                    id="program_id"
                    name="program_id"
                    value={formData.program_id}
                    onChange={(e) => setFormData({ ...formData, program_id: e.target.value })}
                    required
                  >
                    <option value="">Select a program...</option>
                    {programs.map(program => (
                      <option key={program.id} value={program.id}>
                        {program.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="notes" className="form-label">Notes</label>
                  <textarea
                    className="form-control"
                    id="notes"
                    name="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-md-2"
                    onClick={() => navigate(`/clients/${id}`)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                        Enrolling...
                      </>
                    ) : 'Enroll Client'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientEnrollment;