import { useState, useEffect } from 'react';
import api from '../../auth/services/api';

const ProgramList = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProgram, setNewProgram] = useState({
    name: '',
    code: '',
    description: ''
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await api.get('/programs/');
      setPrograms(response.data.results || response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch programs');
      console.error('API Error:', err);
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/programs/', newProgram);
      setPrograms(prevPrograms => [...prevPrograms, response.data]);
      setNewProgram({ name: '', code: '', description: '' });
      setError(null);
    } catch (err) {
      setError('Failed to create program');
      console.error('API Error:', err);
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
      <h2>Health Programs</h2>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h3 className="card-title">Create New Program</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    value={newProgram.name}
                    onChange={(e) => setNewProgram({...newProgram, name: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="code" className="form-label">Code</label>
                  <input
                    type="text"
                    id="code"
                    className="form-control"
                    value={newProgram.code}
                    onChange={(e) => setNewProgram({...newProgram, code: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    id="description"
                    className="form-control"
                    value={newProgram.description}
                    onChange={(e) => setNewProgram({...newProgram, description: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Create Program
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Existing Programs</h3>
              {programs.length > 0 ? (
                <div className="list-group">
                  {programs.map(program => (
                    <div key={program.id} className="list-group-item">
                      <h5 className="mb-1">{program.name} ({program.code})</h5>
                      <p className="mb-1">{program.description}</p>
                      <small>Created: {new Date(program.created_at).toLocaleDateString()}</small>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No programs available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramList;