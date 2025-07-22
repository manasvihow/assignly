import React, { useState, useEffect, useMemo } from 'react';
import { getAllAssignments, createAssignment } from '../services/assignmentService';
import Modal from './Modal';
import AssignmentsTable from './AssignmentsTable';
import CreateAssignmentForm from './CreateAssignmentForm';
import AssignmentDetail from './AssignmentDetail';

const TeacherDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [viewingAssignment, setViewingAssignment] = useState(null);

  const fetchAssignments = async () => {
    try {
      const data = await getAllAssignments();
      setAssignments(data);
    } catch (err) {
      setError('Failed to fetch assignments.');
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleCreateAssignment = async (formData) => {
    setLoading(true);
    try {
      await createAssignment(formData);
      setIsCreateModalOpen(false); 
      fetchAssignments(); 
    } catch (err) {
      console.error("Failed to create assignment", err);
      alert("Failed to create assignment.");
    } finally {
      setLoading(false);
    }
  };

  const { activeAssignments, pastAssignments } = useMemo(() => {
    const now = new Date();
    return assignments.reduce(
      (acc, assignment) => {
        const deadline = new Date(assignment.deadline);
        if (deadline > now) {
          acc.activeAssignments.push(assignment);
        } else {
          acc.pastAssignments.push(assignment);
        }
        return acc;
      },
      { activeAssignments: [], pastAssignments: [] }
    );
  }, [assignments]);

  const handleRowClick = (assignment) => {
    setViewingAssignment(assignment);
  };

  return (
    <div>
      {/* Conditionally render the detail view OR the list view */}
      {viewingAssignment ? (
        <AssignmentDetail 
          assignment={viewingAssignment} 
          onBack={() => setViewingAssignment(null)} 
        />
      ) : (
        // This is the original Master List view
        <div className="flex gap-8">
          {/* Left Column: Tabs and Table */}
          <div className="w-2/3">
            <div className="border-b border-slate-200 mb-4">
              <nav className="-mb-px flex gap-6">
                <button
                  onClick={() => setActiveTab('active')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'active' ? 'text-teal-600 border-teal-500' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                >
                  Active Assignments
                </button>
                <button
                  onClick={() => setActiveTab('past')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'past' ? 'text-teal-600 border-teal-500' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                >
                  Past Assignments
                </button>
              </nav>
            </div>
            <div>
              {activeTab === 'active' ? (
                <AssignmentsTable assignments={activeAssignments} onRowClick={handleRowClick}/>
              ) : (
                <AssignmentsTable assignments={pastAssignments} onRowClick={handleRowClick} />
              )}
            </div>
          </div>

          {/* Right Column: Actions */}
          <div className="w-1/3">
            <div className="p-4 bg-slate-50 rounded-lg">
              <h3 className="font-semibold text-slate-800">Actions</h3>
              <p className="text-sm text-slate-600 mb-4">Create and manage your assignments.</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full px-4 py-2 font-semibold text-white bg-teal-600 rounded-md shadow-sm hover:bg-teal-700"
              >
                Create New Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* The Modal for Creating an Assignment still works the same */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Assignment">
        <CreateAssignmentForm
          onSubmit={handleCreateAssignment}
          onCancel={() => setIsCreateModalOpen(false)}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default TeacherDashboard;