import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import TeacherDashboard from "../components/TeacherDashboard";
import StudentDashboard from "../components/StudentDashboard";

const DashboardPage = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="p-8 bg-[#f9fafb] ">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Welcome, {user?.username}!
                    </h1>
                    <p className="text-slate-600">Your role is: {user?.role}</p>
                </div>
                <button
                    onClick={logout}
                    className="px-4 py-2 font-semibold text-[#4C5FD5] border border-[#4C5FD5] hover:bg-[#F0F2FF] rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.04)]focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D67B4E]"
                >
                    Logout
                </button>
            </header>

            <main className="p-6 bg-[#F9FAFB] rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
                {user?.role === "teacher" ? (
                    <TeacherDashboard />
                ) : (
                    <StudentDashboard />
                )}
            </main>
        </div>
    );
};

export default DashboardPage;
