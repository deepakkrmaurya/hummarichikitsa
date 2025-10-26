import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

// Mock data generator - Replace with actual API calls
const generateMockData = () => {
  // Generate 30 days of appointment data
  const appointmentsOverTime = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const total = Math.floor(Math.random() * 50) + 30;
    const completed = Math.floor(total * 0.6);
    const active = Math.floor(total * 0.3);
    const pending = total - completed - active;
    
    return {
      date: date.toISOString().split('T')[0],
      total,
      completed,
      active,
      pending,
    };
  });

  // Hospital-wise data
  const hospitals = ['General Hospital', 'City Medical', 'Community Health', 'University Medical'];
  const appointmentsByHospital = hospitals.map(hospital => ({
    hospital,
    completed: Math.floor(Math.random() * 150) + 50,
    active: Math.floor(Math.random() * 80) + 20,
    total: Math.floor(Math.random() * 200) + 100,
  }));

  // Status distribution for pie chart
  const totalCompleted = appointmentsOverTime.reduce((sum, day) => sum + day.completed, 0);
  const totalActive = appointmentsOverTime.reduce((sum, day) => sum + day.active, 0);
  const totalPending = appointmentsOverTime.reduce((sum, day) => sum + day.pending, 0);

  const appointmentStatusData = [
    { name: 'Completed', value: totalCompleted, color: '#10B981' },
    { name: 'Active', value: totalActive, color: '#3B82F6' },
    { name: 'Pending', value: totalPending, color: '#F59E0B' },
  ];

  return {
    appointmentsOverTime,
    appointmentsByHospital,
    appointmentStatusData,
    hospitals,
  };
};

const AnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  // Generate mock data - REPLACE WITH API CALL
  const mockData = useMemo(() => generateMockData(), []);
  const { appointmentsOverTime, appointmentsByHospital, appointmentStatusData, hospitals } = mockData;

  // Filter data based on date range
  const filteredData = useMemo(() => {
    const filteredAppointments = appointmentsOverTime.filter(apt => 
      apt.date >= dateRange.from && apt.date <= dateRange.to
    );

    const filteredHospitalData = appointmentsByHospital.map(hospital => ({
      ...hospital,
      completed: Math.floor(hospital.completed * (filteredAppointments.length / appointmentsOverTime.length)),
      active: Math.floor(hospital.active * (filteredAppointments.length / appointmentsOverTime.length)),
    }));

    const totalCompleted = filteredAppointments.reduce((sum, day) => sum + day.completed, 0);
    const totalActive = filteredAppointments.reduce((sum, day) => sum + day.active, 0);
    const totalPending = filteredAppointments.reduce((sum, day) => sum + day.pending, 0);

    const filteredStatusData = [
      { name: 'Completed', value: totalCompleted, color: '#10B981' },
      { name: 'Active', value: totalActive, color: '#3B82F6' },
      { name: 'Pending', value: totalPending, color: '#F59E0B' },
    ];

    return {
      appointmentsOverTime: filteredAppointments,
      appointmentsByHospital: filteredHospitalData,
      appointmentStatusData: filteredStatusData,
    };
  }, [dateRange, appointmentsOverTime, appointmentsByHospital]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalAppointments = filteredData.appointmentsOverTime.reduce((sum, day) => sum + day.total, 0);
    const completedAppointments = filteredData.appointmentsOverTime.reduce((sum, day) => sum + day.completed, 0);
    const activeAppointments = filteredData.appointmentsOverTime.reduce((sum, day) => sum + day.active, 0);
    const pendingAppointments = filteredData.appointmentsOverTime.reduce((sum, day) => sum + day.pending, 0);

    return {
      totalAppointments,
      completedAppointments,
      activeAppointments,
      pendingAppointments,
    };
  }, [filteredData]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  // KPI Cards
  const KPICard = ({ title, value, color, change }) => (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300"
      whileHover={{ y: -2 }}
    >
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
      <p className={`text-2xl font-bold text-${color}-600 mb-1`}>{value.toLocaleString()}</p>
      {change && (
        <p className={`text-sm text-${color}-500`}>
          {change > 0 ? '+' : ''}{change}% from last period
        </p>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Appointment Analytics
              </h1>
              <p className="text-gray-600 mt-2">
                Track complete and active appointments across your hospitals
              </p>
            </div>
            
            {/* Date Range Filter */}
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
              <div>
                <label htmlFor="from-date" className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  id="from-date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="to-date" className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  id="to-date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
        >
          <KPICard
            title="Total Appointments"
            value={kpis.totalAppointments}
            change={12}
            color="blue"
          />
          <KPICard
            title="Completed Appointments"
            value={kpis.completedAppointments}
            change={8}
            color="green"
          />
          <KPICard
            title="Active Appointments"
            value={kpis.activeAppointments}
            change={15}
            color="blue"
          />
          <KPICard
            title="Pending Appointments"
            value={kpis.pendingAppointments}
            change={-5}
            color="orange"
          />
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Area Chart - Appointments Over Time */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Appointments Trend ({dateRange.from} to {dateRange.to})
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredData.appointmentsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).getDate()}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value) => [value, 'Appointments']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="completed" 
                    stackId="1"
                    stroke="#10B981" 
                    fill="#10B981"
                    fillOpacity={0.2}
                    name="Completed"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="active" 
                    stackId="1"
                    stroke="#3B82F6" 
                    fill="#3B82F6"
                    fillOpacity={0.2}
                    name="Active"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pending" 
                    stackId="1"
                    stroke="#F59E0B" 
                    fill="#F59E0B"
                    fillOpacity={0.2}
                    name="Pending"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Right Side Charts */}
          <div className="space-y-6">
            {/* Pie Chart - Appointment Status */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Appointment Status Distribution
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={filteredData.appointmentStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {filteredData.appointmentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}`, 'Appointments']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Horizontal Bar Chart - Hospital Wise */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Appointments by Hospital
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={filteredData.appointmentsByHospital}
                    layout="vertical"
                    margin={{ left: 100 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis type="number" />
                    <YAxis 
                      type="category" 
                      dataKey="hospital" 
                      width={80}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="completed" 
                      name="Completed"
                      fill="#10B981"
                      radius={[0, 4, 4, 0]}
                    />
                    <Bar 
                      dataKey="active" 
                      name="Active"
                      fill="#3B82F6"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Summary Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Appointment Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{kpis.completedAppointments}</p>
              <p className="text-green-700">Completed Appointments</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{kpis.activeAppointments}</p>
              <p className="text-blue-700">Active Appointments</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">
                {((kpis.completedAppointments / kpis.totalAppointments) * 100).toFixed(1)}%
              </p>
              <p className="text-orange-700">Completion Rate</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AnalyticsDashboard;