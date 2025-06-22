
import './App.css'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'

export default function App() {
  return (
    <div className="admin-panel">
      <Sidebar />
      <main className="main-content">
        <Dashboard />
      </main>
    </div>
  )
}
