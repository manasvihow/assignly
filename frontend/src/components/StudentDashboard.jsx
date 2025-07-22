import React, { useState, useEffect } from 'react';
import { getAllAssignments, getMySubmissions, submitAssignment, getMySubmissionForAssignment } from '../services/assignmentService';
import Modal from './Modal';
import SubmissionForm from './SubmissionForm';
import { format } from 'date-fns'; 

const StudentDashboard = () => {
  
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  
  const [processedAssignments, setProcessedAssignments] = useState([]);

  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); 
  const [activeTab, setActiveTab] = useState('active');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [viewingAssignment, setViewingAssignment] = useState(null);
  const [selectedAssignmentForSubmit, setSelectedAssignmentForSubmit] = useState(null);

  const [viewingSubmission, setViewingSubmission] = useState(null);

  
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  
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
  }, [assignments, submissions]);

  
  const handleOpenSubmitModal = (assignment) => {
    setSelectedAssignmentForSubmit(assignment);
    setIsSubmitModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsSubmitModalOpen(false);
    setViewingAssignment(null);
    
    setSelectedAssignmentForSubmit(null);
  };
  
  const handleViewDetails = (assignment) => {
    setViewingAssignment(assignment);
  };

  const handleViewSubmission = async (assignment) => {
    setLoading(true);
    try {
      const submission = await getMySubmissionForAssignment(assignment.id);
      setViewingSubmission({
        assignmentTitle: assignment.title,
        submittedAt: submission.submitted_at,
        attachmentUrl: submission.attachment_url,
      });
    } catch (err) {
      console.error("Failed to fetch submission", err);
      alert("Could not load your submission.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitWork = async (formData) => {
    if (!selectedAssignmentForSubmit) return;
    setLoading(true);
    try {
      const newSubmission = await submitAssignment(selectedAssignmentForSubmit.id, formData);
      setSubmissions(prevSubmissions => [...prevSubmissions, newSubmission]);
      handleCloseModal();
    } catch (err) {
      console.error("Submission failed", err);
      alert("Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  
  
 
  const tabBaseStyle = "py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200";
  const tabInactiveStyle = "text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300";
  const tabActiveStyle = "text-slate-700 border-slate-700";

  const now = new Date();
  const activeAssignments = processedAssignments.filter(a => new Date(a.deadline) > now);
  const pastAssignments = processedAssignments.filter(a => new Date(a.deadline) <= now);
  const assignmentsToDisplay = activeTab === 'active' ? activeAssignments : pastAssignments;

  if (loading) return <p>Loading assignments...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 sm:p-6">
      {/* Tabs */}
      <div className="border-b border-slate-200 mb-4">
        <nav className="-mb-px flex gap-6" aria-label="Tabs">
          <button onClick={() => setActiveTab('active')} className={`${tabBaseStyle} ${activeTab === 'active' ? tabActiveStyle : tabInactiveStyle}`}>
            Active Assignments
          </button>
          <button onClick={() => setActiveTab('past')} className={`${tabBaseStyle} ${activeTab === 'past' ? tabActiveStyle : tabInactiveStyle}`}>
            Past Assignments
          </button>
        </nav>
      </div>

      {/* Assignments Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-slate-200">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Assigned By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {assignmentsToDisplay.map((assignment) => (
              <tr key={assignment.id} className="hover:bg-slate-50 cursor-pointer">
                <td onClick={() => handleViewDetails(assignment)} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  <span className="cursor-pointer hover:underline">
                    {assignment.title}
                  </span>
                </td>
                <td onClick={() => handleViewDetails(assignment)} className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{assignment.owner.username}</td>
                <td onClick={() => handleViewDetails(assignment)} className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{format(new Date(assignment.deadline), "PPpp")}</td>
                <td onClick={() => handleViewDetails(assignment)} className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    assignment.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                    assignment.status === 'Submitted' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {assignment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  {assignment.status === 'Pending' ? (
                    <button onClick={() => handleOpenSubmitModal(assignment)} className="cursor-pointer font-medium text-slate-600 hover:text-slate-800">
                      Submit
                    </button>
                  ) : (
                    <span onClick={() => handleViewSubmission(assignment)} className="text-slate-600 font-medium cursor-pointer hover:text-slate-800">View Assignment</span>
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
          <div className="space-y-3">
            <h4 id="modal-title" className="text-lg font-bold text-slate-800">{viewingAssignment.title}</h4>
            <p className="text-sm text-slate-600">{viewingAssignment.description}</p>
            <div>
              <p className="text-sm font-medium text-slate-700">Deadline</p>
              <p className="text-sm text-slate-500">{format(new Date(viewingAssignment.deadline), "PPpp")}</p>
            </div>
            {viewingAssignment.attachment_url && (
              <a href={`http://127.0.0.1:8000/${viewingAssignment.attachment_url}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:underline pt-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                Download Attachment
              </a>
            )}
          </div>
        </Modal>
      )}

{viewingSubmission && (
  <Modal isOpen={!!viewingSubmission} onClose={() => setViewingSubmission(null)} title="Your Submission">
    <div className="space-y-3">
      <h4 className="text-lg font-bold text-slate-800">{viewingSubmission.assignmentTitle}</h4>
      <div>
        <p className="text-sm font-medium text-slate-700">Submitted At</p>
        <p className="text-sm text-slate-500">{format(new Date(viewingSubmission.submittedAt), "PPpp")}</p>
      </div>
      {viewingSubmission.attachmentUrl && (
        <a href={`http://127.0.0.1:8000/${viewingSubmission.attachmentUrl}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:underline pt-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          Download Submitted File
        </a>
      )}
    </div>
  </Modal>
)}
    </div>
  );
};

export default StudentDashboard;