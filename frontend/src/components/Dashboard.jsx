import { useAuth } from '../auth/hooks/useAuth'

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col">
          <h2>Welcome to your Dashboard</h2>
          <p>Hello {user.username}, you have successfully logged in!</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard