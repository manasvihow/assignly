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

  const [dateError, setDateError] = useState('');

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
    setDateError(''); 
    if (!formData.deadline) {
        setDateError('Please select a deadline.');
        return;
    }
    
    const deadline = new Date(formData.deadline);
    const now = new Date();


    if (deadline < now) {
      setDateError('The deadline cannot be in the past.');
      return; 
    }

    setLoading(true);
    try {
      const dataToSubmit = new FormData();
      dataToSubmit.append('title', formData.title);
      dataToSubmit.append('description', formData.description);
      dataToSubmit.append('deadline', deadline.toISOString());
      if (formData.attachment) {
        dataToSubmit.append('attachment', formData.attachment);
      }

      await createAssignment(dataToSubmit);
      setIsCreateModalOpen(false);
      fetchAssignments();
    } catch (err) {
      console.error("Failed to create assignment", err);
      alert("Failed to create assignment. Please check the details and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {

    setDateError('');
    setIsCreateModalOpen(true);
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

  const tabBaseStyle = "py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200";
  const tabInactiveStyle = "text-slate-500 border-transparent hover:text-slate-600 hover:border-slate-300";
  const tabActiveStyle = "text-slate-700 border-slate-700";

  return (
    <div>
      {viewingAssignment ? (
        <AssignmentDetail 
          assignment={viewingAssignment} 
          onBack={() => setViewingAssignment(null)} 
        />
      ) : (
        <div className="flex gap-8">
          {/* Left Column: Tabs and Table */}
          <div className="w-2/3">
            <div className="border-b border-slate-200 mb-4">
              <nav className="-mb-px flex gap-6" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('active')}
                  className={`cursor-pointer ${tabBaseStyle} ${activeTab === 'active' ? tabActiveStyle : tabInactiveStyle}`}
                >
                  Active Assignments
                </button>
                <button
                  onClick={() => setActiveTab('past')}
                  className={`cursor-pointer ${tabBaseStyle} ${activeTab === 'past' ? tabActiveStyle : tabInactiveStyle}`}
                >
                  Past Assignments
                </button>
              </nav>
            </div>
            <div>
              {activeTab === 'active' ? (
                <AssignmentsTable assignments={activeAssignments} onRowClick={handleRowClick} />
              ) : (
                <AssignmentsTable assignments={pastAssignments} onRowClick={handleRowClick} />
              )}
            </div>
          </div>

          {/* Right Column: Actions */}
          <div className="w-1/3">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-semibold text-slate-800">Actions</h3>
              <p className="text-sm text-slate-500 mb-4">Create and manage your assignments.</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="cursor-pointer w-full px-4 py-2 font-semibold text-white bg-slate-700 rounded-lg shadow-sm hover:bg-slate-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
              >
                Create New Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* The Modal for Creating an Assignment */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Assignment">
        <CreateAssignmentForm
          onSubmit={handleCreateAssignment}
          onCancel={() => setIsCreateModalOpen(false)}
          loading={loading}
          dateError={dateError}
        />
      </Modal>
    </div>
  );
};

export default TeacherDashboard;