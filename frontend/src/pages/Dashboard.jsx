// pages/Dashboard.jsx

import DashboardLayout from '../components/BusinessDashboard/DashboardLayout'
import Overview from './BusinessDashboard/Overview'

function Dashboard() {
  return (
    <DashboardLayout>
        <Overview />
    </DashboardLayout>
  )
}

export default Dashboard