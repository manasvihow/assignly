import React, { useState, useEffect, useMemo } from 'react';
import { getAllAssignments, getMySubmissions, submitAssignment } from '../services/assignmentService';
import Modal from './Modal';
import SubmissionForm from './SubmissionForm';

const StudentDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State for the submission modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const fetchData = async () => {
    try {
      const [assignmentsData, submissionsData] = await Promise.all([
        getAllAssignments(),
        getMySubmissions(),
      ]);
      setAssignments(assignmentsData);
      setSubmissions(submissionsData);
    } catch (err) {
      setError('Failed to fetch data.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenSubmitModal = (assignment) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAssignment(null);
  };

  const handleSubmitWork = async (formData) => {
    if (!selectedAssignment) return;
    setLoading(true);
    try {
      await submitAssignment(selectedAssignment.id, formData);
      handleCloseModal();
      fetchData(); // Refresh data to update status
    } catch (err) {
      console.error("Submission failed", err);
      alert("Submission failed. You may have already submitted for this assignment.");
    } finally {
      setLoading(false);
    }
  };

  const assignmentsWithStatus = useMemo(() => {
    const submissionMap = new Map(submissions.map(s => [s.assignment_id, s]));
    return assignments.map(assignment => {
      const submission = submissionMap.get(assignment.id);
      let status = 'Pending';
      if (submission) {
        const deadline = new Date(assignment.deadline);
        const submittedAt = new Date(submission.submitted_at);
        status = submittedAt > deadline ? 'Late' : 'Submitted';
      }
      return { ...assignment, status };
    });
  }, [assignments, submissions]);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-700 mb-4">Your Assignments</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {assignmentsWithStatus.map((assignment) => (
              <tr key={assignment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{assignment.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(assignment.deadline).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    assignment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    assignment.status === 'Submitted' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {assignment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {assignment.status === 'Pending' ? (
                    <button 
                      onClick={() => handleOpenSubmitModal(assignment)}
                      className="font-medium text-teal-600 hover:text-teal-800"
                    >
                      Submit Work
                    </button>
                  ) : (
                    <span className="text-slate-400">Submitted</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Submission Modal */}
      {selectedAssignment && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          title={`Submit for: ${selectedAssignment.title}`}
        >
          <SubmissionForm
            onSubmit={handleSubmitWork}
            onCancel={handleCloseModal}
            loading={loading}
          />
        </Modal>
      )}
    </div>
  );
};

export default StudentDashboard;