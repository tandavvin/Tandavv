
import {
  Users,
  Store,
  IndianRupee,
  CreditCard,
  UserPlus,
  LayoutTemplate,
  ShieldPlus,
  Activity,
  ArrowUpRight,
  MoreHorizontal,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";

// Sample dashboard statistics
const statistics = [
  {
    title: "Total Users",
    value: "12,450",
    change: "+12.5%",
    description: "vs last month",
    icon: Users,
    trend: "up",
  },
  {
    title: "Active Stores",
    value: "2,840",
    change: "+8.2%",
    description: "vs last month",
    icon: Store,
    trend: "up",
  },
  {
    title: "Total Revenue",
    value: "₹4,85,000",
    change: "+15.8%",
    description: "vs last month",
    icon: IndianRupee,
    trend: "up",
  },
  {
    title: "Subscriptions",
    value: "1,250",
    change: "-2.4%",
    description: "vs last month",
    icon: CreditCard,
    trend: "down",
  },
];

// Sample monthly revenue
const revenueData = [
  { month: "Jan", revenue: 35 },
  { month: "Feb", revenue: 48 },
  { month: "Mar", revenue: 42 },
  { month: "Apr", revenue: 65 },
  { month: "May", revenue: 55 },
  { month: "Jun", revenue: 78 },
  { month: "Jul", revenue: 62 },
  { month: "Aug", revenue: 85 },
  { month: "Sep", revenue: 72 },
  { month: "Oct", revenue: 92 },
  { month: "Nov", revenue: 75 },
  { month: "Dec", revenue: 100 },
];

// Sample user growth
const userGrowthData = [
  { month: "Jan", users: 30 },
  { month: "Feb", users: 45 },
  { month: "Mar", users: 38 },
  { month: "Apr", users: 55 },
  { month: "May", users: 48 },
  { month: "Jun", users: 68 },
  { month: "Jul", users: 58 },
  { month: "Aug", users: 75 },
  { month: "Sep", users: 65 },
  { month: "Oct", users: 85 },
  { month: "Nov", users: 78 },
  { month: "Dec", users: 100 },
];

// Sample registrations
const recentUsers = [
  {
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    store: "Rahul Fashion",
    date: "19 Nov 2026",
    status: "Active",
  },
  {
    name: "Priya Patel",
    email: "priya@gmail.com",
    store: "Priya Boutique",
    date: "18 Nov 2026",
    status: "Active",
  },
  {
    name: "Amit Verma",
    email: "amit@gmail.com",
    store: "Amit Electronics",
    date: "18 Nov 2026",
    status: "Pending",
  },
  {
    name: "Sneha Joshi",
    email: "sneha@gmail.com",
    store: "Sneha Cosmetics",
    date: "17 Nov 2026",
    status: "Active",
  },
];

// Sample platform activities
const activities = [
  {
    title: "New user registered",
    description: "Rahul Sharma created an account.",
    time: "10 minutes ago",
    icon: UserPlus,
    color: "text-blue-600 bg-blue-50",
  },
  {
    title: "New store created",
    description: "Priya Boutique was created.",
    time: "35 minutes ago",
    icon: Store,
    color: "text-green-600 bg-green-50",
  },
  {
    title: "Subscription payment received",
    description: "₹999 payment received successfully.",
    time: "1 hour ago",
    icon: CheckCircle,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    title: "System notification",
    description: "A new platform update is available.",
    time: "3 hours ago",
    icon: AlertCircle,
    color: "text-orange-600 bg-orange-50",
  },
];

// Quick action items
const quickActions = [
  {
    title: "Add New User",
    description: "Create a platform user account.",
    icon: UserPlus,
    path: "/admin/users",
  },
  {
    title: "Manage Templates",
    description: "Add or update website templates.",
    icon: LayoutTemplate,
    path: "/admin/templates",
  },
  {
    title: "Create Sub Admin",
    description: "Assign access to a new administrator.",
    icon: ShieldPlus,
    path: "/admin/sub-admins",
  },
  {
    title: "View Activity Logs",
    description: "Review platform activities.",
    icon: Activity,
    path: "/admin/activity-logs",
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-8">

      {/* Dashboard Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back! Here's what's happening with Tandav today.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg px-4 py-2">
          <Clock size={16} />
          November 19, 2026
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statistics.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Revenue Chart */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-900">
                Revenue Overview
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Monthly revenue performance
              </p>
            </div>

            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <MoreHorizontal size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-3xl font-bold text-gray-900">
              ₹4,85,000
            </h3>
            <p className="text-sm text-green-600 flex items-center gap-1 mt-2">
              <TrendingUp size={15} />
              15.8% increase from last month
            </p>
          </div>

          <div className="h-52 flex items-end gap-2 sm:gap-3 border-b border-gray-100 pb-2">
            {revenueData.map((item) => (
              <div
                key={item.month}
                className="flex-1 h-full flex flex-col justify-end items-center gap-2"
              >
                <div
                  title={`${item.month}: ${item.revenue}%`}
                  className="w-full max-w-8 bg-orange-500 hover:bg-orange-600 rounded-t-md transition-all"
                  style={{ height: `${item.revenue}%` }}
                />
                <span className="text-[10px] sm:text-xs text-gray-400">
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-900">
                User Growth
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                New user registration trends
              </p>
            </div>

            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <MoreHorizontal size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-3xl font-bold text-gray-900">
              12,450
            </h3>
            <p className="text-sm text-green-600 flex items-center gap-1 mt-2">
              <TrendingUp size={15} />
              12.5% increase from last month
            </p>
          </div>

          <div className="h-52 flex items-end gap-2 sm:gap-3 border-b border-gray-100 pb-2">
            {userGrowthData.map((item) => (
              <div
                key={item.month}
                className="flex-1 h-full flex flex-col justify-end items-center gap-2"
              >
                <div
                  title={`${item.month}: ${item.users}%`}
                  className="w-full max-w-8 bg-blue-500 hover:bg-blue-600 rounded-t-md transition-all"
                  style={{ height: `${item.users}%` }}
                />
                <span className="text-[10px] sm:text-xs text-gray-400">
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Users and Platform Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent Registrations */}
        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div>
              <h2 className="font-semibold text-gray-900">
                Recent Registrations
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Latest users registered on Tandav
              </p>
            </div>

            <Link
              to="/admin/users"
              className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              View All
              <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Store</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {recentUsers.map((user) => (
                  <tr key={user.email} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {user.email}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {user.store}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-500">
                      {user.date}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.status === "Active"
                            ? "bg-green-50 text-green-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>



        {/* Platform Activity */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-900">
                Platform Activity
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Recent platform updates
              </p>
            </div>

            <Activity size={20} className="text-gray-400" />
          </div>

          <div className="space-y-6">
            {activities.map((activity, index) => {
              const Icon = activity.icon;

              return (
                <div key={index} className="flex gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${activity.color}`}
                  >
                    <Icon size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {activity.description}
                    </p>

                    <p className="text-xs text-gray-400 mt-2">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            to="/admin/activity-logs"
            className="block text-center text-sm font-medium text-orange-600 hover:text-orange-700 mt-6 pt-4 border-t border-gray-100"
          >
            View All Activities
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Quick Actions
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Quickly access important admin operations
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                to={action.path}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:border-orange-300 hover:shadow-sm transition group"
              >
                <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4 group-hover:bg-orange-100 transition">
                  <Icon size={21} />
                </div>

                <h3 className="font-semibold text-gray-900">
                  {action.title}
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  {action.description}
                </p>

                <div className="flex items-center gap-1 text-sm text-orange-600 font-medium mt-4">
                  Open
                  <ArrowUpRight size={15} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
