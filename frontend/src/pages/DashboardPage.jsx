import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import TeacherDashboard from "../components/TeacherDashboard";
import StudentDashboard from "../components/StudentDashboard";

const DashboardPage = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       
        <header className="flex justify-between items-center py-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Welcome, {user?.username}!
            </h1>
            <p className="text-sm text-slate-500 capitalize mt-1">
              {user?.role} Dashboard
            </p>
          </div>

        
          <button
            onClick={logout}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Logout
          </button>
        </header>

        
        <main className="mt-8 p-4 sm:p-6 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {user?.role === "teacher" ? (
            <TeacherDashboard />
          ) : (
            <StudentDashboard />
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;