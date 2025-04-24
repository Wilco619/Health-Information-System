import { useState, useEffect } from 'react';
import { useAuth } from '../auth/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { clientAPI } from '../auth/services/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalPrograms: 0,
    enrolledClients: 0,
    recentClients: [],
    recentPrograms: [],
    programStats: [],
    enrollmentTrend: {
      labels: [],
      datasets: []
    }
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await clientAPI.getDashboardStats();
        setStats(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Enhanced chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monthly Enrollment Trends' }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold">Welcome to your Dashboard</h2>
          <p className="text-muted">Hello {user.username}, here's an overview of your health information system.</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body bg-primary bg-opacity-10 border-start border-5 border-primary">
              <h5 className="card-title text-primary fw-bold">Total Clients</h5>
              <h2 className="display-6 fw-bold mb-3">{stats.totalClients}</h2>
              <Link to="/clients" className="btn btn-sm btn-outline-primary">View all clients</Link>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body bg-success bg-opacity-10 border-start border-5 border-success">
              <h5 className="card-title text-success fw-bold">Enrolled Clients</h5>
              <h2 className="display-6 fw-bold mb-3">{stats.enrolledClients}</h2>
              <small className="text-muted">In various programs</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body bg-info bg-opacity-10 border-start border-5 border-info">
              <h5 className="card-title text-info fw-bold">Total Programs</h5>
              <h2 className="display-6 fw-bold mb-3">{stats.totalPrograms}</h2>
              <Link to="/programs" className="btn btn-sm btn-outline-info">View all programs</Link>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body bg-warning bg-opacity-10 border-start border-5 border-warning">
              <h5 className="card-title text-warning fw-bold">Enrollment Rate</h5>
              <h2 className="display-6 fw-bold mb-3">
                {((stats.enrolledClients / stats.totalClients) * 100).toFixed(1)}%
              </h2>
              <small className="text-muted">Of total clients</small>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Trend Chart & Top Programs */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-0">
              <h5 className="card-title mb-0 fw-bold">Enrollment Trends</h5>
            </div>
            <div className="card-body">
              <div style={{ height: "300px" }}>
                <Line data={stats.enrollmentTrend} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-0">
              <h5 className="card-title mb-0 fw-bold">Top Programs</h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {stats.programStats.map(program => (
                  <div key={program.id} className="list-group-item border-0 px-4 py-3">
                    <div className="d-flex w-100 justify-content-between align-items-center mb-2">
                      <h6 className="mb-0 fw-bold">{program.name}</h6>
                      <span className="badge bg-primary rounded-pill">
                        {program.enrolledCount} clients
                      </span>
                    </div>
                    <div className="progress" style={{ height: '6px' }}>
                      <div
                        className="progress-bar bg-primary"
                        role="progressbar"
                        style={{ width: `${(program.enrolledCount / stats.totalClients) * 100}%` }}
                        aria-valuenow={(program.enrolledCount / stats.totalClients) * 100}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0 fw-bold">Recently Added Clients</h5>
              <span className="badge bg-primary rounded-pill">{stats.recentClients.length}</span>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {stats.recentClients.map(client => (
                  <Link
                    key={client.id}
                    to={`/clients/${client.id}`}
                    className="list-group-item list-group-item-action border-0 px-4 py-3"
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1 fw-bold">{client.full_name}</h6>
                      <small className="text-muted">{new Date(client.registered_at).toLocaleDateString()}</small>
                    </div>
                    <small className="text-muted d-flex align-items-center">
                      <span className="badge bg-success me-1">{client.enrolled_programs}</span>
                      program(s) enrolled
                    </small>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0 fw-bold">Recently Added Programs</h5>
              <span className="badge bg-info rounded-pill">{stats.recentPrograms.length}</span>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {stats.recentPrograms.map(program => (
                  <Link
                    key={program.id}
                    className="list-group-item list-group-item-action border-0 px-4 py-3"
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1 fw-bold">{program.name}</h6>
                      <small className="text-muted">{new Date(program.created_at).toLocaleDateString()}</small>
                    </div>
                    <small className="text-muted d-flex align-items-center">
                      <span className="badge bg-primary me-1">{program.enrolled_clients}</span>
                      client(s) enrolled
                    </small>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Display error if any */}
      {error && (
        <div className="alert alert-danger mt-4" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default Dashboard;