import { useState, useEffect } from 'react';
import api from '../../auth/services/api';

const ProgramList = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProgram, setEditingProgram] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);
  const [newProgram, setNewProgram] = useState({
    name: '',
    code: '',
    description: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPrograms, setFilteredPrograms] = useState([]);

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPrograms(programs);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = programs.filter(program => 
      program.name.toLowerCase().includes(query) ||
      program.code.toLowerCase().includes(query) ||
      program.description.toLowerCase().includes(query)
    );
    setFilteredPrograms(filtered);
  }, [searchQuery, programs]);

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
      if (editingProgram) {
        // Update existing program
        const response = await api.put(`/programs/${editingProgram.id}/`, newProgram);
        setPrograms(prevPrograms => 
          prevPrograms.map(p => p.id === editingProgram.id ? response.data : p)
        );
        setEditingProgram(null);
      } else {
        // Create new program
        const response = await api.post('/programs/', newProgram);
        setPrograms(prevPrograms => [...prevPrograms, response.data]);
      }
      setNewProgram({ name: '', code: '', description: '' });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${editingProgram ? 'update' : 'create'} program`);
      console.error('API Error:', err);
    }
  };

  const handleEdit = (program) => {
    setEditingProgram(program);
    setNewProgram({
      name: program.name,
      code: program.code,
      description: program.description
    });
  };

  const handleDelete = async () => {
    if (!programToDelete) return;

    try {
      await api.delete(`/programs/${programToDelete.id}/`);
      setPrograms(prevPrograms => 
        prevPrograms.filter(p => p.id !== programToDelete.id)
      );
      setProgramToDelete(null);
      setShowDeleteModal(false);
    } catch (err) {
      setError('Failed to delete program');
      console.error('Delete error:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingProgram(null);
    setNewProgram({ name: '', code: '', description: '' });
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
        <h2>Health Programs</h2>
        <div className="col-md-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search programs..."
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
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h3 className="card-title">{editingProgram ? 'Edit Program' : 'Create New Program'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={newProgram.name}
                    onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="code" className="form-label">Code</label>
                  <input
                    type="text"
                    className="form-control"
                    id="code"
                    value={newProgram.code}
                    onChange={(e) => setNewProgram({ ...newProgram, code: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows="3"
                    value={newProgram.description}
                    onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                    required
                  />
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    {editingProgram ? 'Update Program' : 'Create Program'}
                  </button>
                  {editingProgram && (
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => {
                        setEditingProgram(null);
                        setNewProgram({ name: '', code: '', description: '' });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">
                Existing Programs
                {searchQuery && (
                  <small className="text-muted ms-2">
                    ({filteredPrograms.length} found)
                  </small>
                )}
              </h3>
              <div className="programs-list" style={{ 
                maxHeight: '600px', 
                overflowY: 'auto',
                paddingRight: '5px'
              }}>
                {filteredPrograms.length > 0 ? (
                  <div className="list-group">
                    {filteredPrograms.map(program => (
                      <div key={program.id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h5 className="mb-1">{program.name} ({program.code})</h5>
                            <p className="mb-1">{program.description}</p>
                            <small>Created: {new Date(program.created_at).toLocaleDateString()}</small>
                          </div>
                          <div className="btn-group">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEdit(program)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => {
                                setProgramToDelete(program);
                                setShowDeleteModal(true);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">
                    {searchQuery 
                      ? 'No programs match your search.'
                      : 'No programs available.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setShowDeleteModal(false);
                    setProgramToDelete(null);
                  }}
                />
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete the program "{programToDelete?.name}"?</p>
                <p className="text-danger">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowDeleteModal(false);
                    setProgramToDelete(null);
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Delete Program
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramList;