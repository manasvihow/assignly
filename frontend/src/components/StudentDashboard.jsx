import React, { useState, useEffect } from 'react';
import { getAllAssignments, getMySubmissions, submitAssignment } from '../services/assignmentService';
import Modal from './Modal';
import SubmissionForm from './SubmissionForm';

const StudentDashboard = () => {
  // Raw data from the API
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  
  // State for the final, processed data to be rendered
  const [processedAssignments, setProcessedAssignments] = useState([]);

  // UI State
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [viewingAssignment, setViewingAssignment] = useState(null);
  const [selectedAssignmentForSubmit, setSelectedAssignmentForSubmit] = useState(null);

  // --- Data Fetching ---
  const fetchData = async () => {
    try {
      setLoading(true);
      const [assignmentsData, submissionsData] = await Promise.all([
        getAllAssignments(),
        getMySubmissions(),
      ]);
      setAssignments(assignmentsData);
      setSubmissions(submissionsData);
    } catch (err) {
      setError('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- THIS IS THE KEY CHANGE ---
  // This useEffect will run WHENEVER the raw assignments or submissions data changes.
  // It processes the raw data and puts it into a final state for rendering.
  useEffect(() => {
    const submissionMap = new Map(submissions.map(s => [s.assignment_id, s]));
    
    const assignmentsWithStatus = assignments.map(assignment => {
      const submission = submissionMap.get(assignment.id);
      let status = 'Pending';
      if (submission) {
        const deadline = new Date(assignment.deadline);
        const submittedAt = new Date(submission.submitted_at);
        status = submittedAt > deadline ? 'Late' : 'Submitted';
      }
      return { ...assignment, status };
    });

    setProcessedAssignments(assignmentsWithStatus);
  }, [assignments, submissions]); // Dependency array ensures this runs on change

  // --- Modal and Submission Handlers ---
  const handleOpenSubmitModal = (assignment) => {
    setSelectedAssignmentForSubmit(assignment);
    setIsSubmitModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsSubmitModalOpen(false);
    setViewingAssignment(null);
  };

  const handleViewDetails = (assignment) => {
    setViewingAssignment(assignment);
  };

  const handleSubmitWork = async (formData) => {
    if (!selectedAssignmentForSubmit) return;
    setLoading(true);
    try {
      const newSubmission = await submitAssignment(selectedAssignmentForSubmit.id, formData);
      // This is the only state update needed now.
      // It will trigger the processing useEffect above automatically.
      setSubmissions(prevSubmissions => [...prevSubmissions, newSubmission]);
      handleCloseModal();
    } catch (err) {
      console.error("Submission failed", err);
      alert("Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  // Filter the final processed list for display
  const now = new Date();
  const activeAssignments = processedAssignments.filter(a => new Date(a.deadline) > now);
  const pastAssignments = processedAssignments.filter(a => new Date(a.deadline) <= now);
  const assignmentsToDisplay = activeTab === 'active' ? activeAssignments : pastAssignments;

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      {/* Tabs */}
      <div className="border-b border-slate-200 mb-4">
        <nav className="-mb-px flex gap-6">
           <button onClick={() => setActiveTab('active')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'active' ? 'text-teal-600 border-teal-500' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            Active Assignments
          </button>
          <button onClick={() => setActiveTab('past')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'past' ? 'text-teal-600 border-teal-500' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            Past Assignments
          </button>
        </nav>
      </div>

      {/* Assignments Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Assigned By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {assignmentsToDisplay.map((assignment) => (
              <tr key={assignment.id}  className="hover:bg-slate-50">
                <td onClick={() => handleViewDetails(assignment)} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  <span className="cursor-pointer hover:underline">
                    {assignment.title}
                  </span>
                </td>
                <td onClick={() => handleViewDetails(assignment)} className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{assignment.owner.username}</td>
                <td onClick={() => handleViewDetails(assignment)} className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(assignment.deadline).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    assignment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    assignment.status === 'Submitted' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {assignment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {assignment.status === 'Pending' ? (
                    <button onClick={() => handleOpenSubmitModal(assignment)} className="font-medium text-teal-600 hover:text-teal-800">
                      Submit Work
                    </button>
                  ) : (
                    <span className="text-slate-400">None</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

       {/* Modals */}
       <Modal isOpen={isSubmitModalOpen} onClose={handleCloseModal} title={`Submit for: ${selectedAssignmentForSubmit?.title}`}>
        <SubmissionForm onSubmit={handleSubmitWork} onCancel={handleCloseModal} loading={loading} />
      </Modal>

      {viewingAssignment && (
        <Modal isOpen={!!viewingAssignment} onClose={() => setViewingAssignment(null)} title="Assignment Details">
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-slate-800">{viewingAssignment.title}</h4>
            <p className="text-sm text-slate-600">{viewingAssignment.description}</p>
            <p className="text-xs text-slate-500">Deadline: {new Date(viewingAssignment.deadline).toLocaleString()}</p>
            {viewingAssignment.attachment_url && (
              <a href={`http://127.0.0.1:8000/${viewingAssignment.attachment_url}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-teal-600 hover:underline pt-2 inline-block">
                Download Attachment
              </a>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentDashboard;