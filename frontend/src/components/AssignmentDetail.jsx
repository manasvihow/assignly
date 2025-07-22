import React, { useState, useEffect, useMemo } from 'react';
import { getSubmissionsForAssignment } from '../services/assignmentService';

const AssignmentDetail = ({ assignment, onBack }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for our filters
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyLate, setShowOnlyLate] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!assignment) return;
      try {
        setLoading(true);
        const data = await getSubmissionsForAssignment(assignment.id);
        setSubmissions(data);
      } catch (err) {
        setError('Failed to load submissions.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [assignment]);

  // Filter submissions based on search term and checkbox state
  const filteredSubmissions = useMemo(() => {
    const deadline = new Date(assignment.deadline);
    return submissions
      .filter(submission => {
        // Late filter
        if (showOnlyLate) {
          return new Date(submission.submitted_at) > deadline;
        }
        return true;
      })
      .filter(submission => {
        // Search term filter
        return submission.student.username.toLowerCase().includes(searchTerm.toLowerCase());
      });
  }, [submissions, searchTerm, showOnlyLate, assignment.deadline]);

  if (!assignment) return null;

  return (
    <div>
      {/* Header with close button on the right */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">Assignment Details</h2>
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md">
        {/* Assignment Info Section */}
        <div className="mb-6 pb-6 border-b border-slate-200">
          <h4 className="text-lg font-bold text-slate-800">{assignment.title}</h4>
          <p className="text-sm text-slate-600 mt-1">{assignment.description}</p>
          <p className="text-xs text-slate-500 mt-2">
            Deadline: {new Date(assignment.deadline).toLocaleString()}
          </p>
          {assignment.attachment_url && (
            <a 
              href={`http://127.0.0.1:8000/${assignment.attachment_url}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-teal-600 hover:underline mt-2 inline-block"
            >
              View Attachment
            </a>
          )}
        </div>

        {/* Submissions Section */}
        <div>
          <h5 className="font-semibold text-slate-700 mb-3">Submissions</h5>

          {/* Filter controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4 p-4 bg-slate-50 rounded-lg">
            <input
              type="text"
              placeholder="Filter by student name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
            />
            <label className="flex items-center whitespace-nowrap">
              <input
                type="checkbox"
                checked={showOnlyLate}
                onChange={(e) => setShowOnlyLate(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="ml-2 text-sm text-slate-700">Show only late</span>
            </label>
          </div>

          {loading && <p>Loading submissions...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && filteredSubmissions.length === 0 && <p className="text-sm text-slate-500">No matching submissions found.</p>}
          
          <div className="max-h-96 overflow-y-auto pr-2">
            <ul className="space-y-3">
              {/* Render the FILTERED list of submissions */}
              {filteredSubmissions.map(submission => {
                const isLate = new Date(submission.submitted_at) > new Date(assignment.deadline);
                return (
                  <li key={submission.id} className="p-3 bg-slate-50 rounded-md flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-800">{submission.student.username}</p>
                        {/* Late status badge */}
                        {isLate && (
                           <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800">
                             Late
                           </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">Submitted at: {new Date(submission.submitted_at).toLocaleString()}</p>
                    </div>
                    {submission.attachment_url && (
                      <a href={`http://127.0.0.1:8000/${submission.attachment_url}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white bg-teal-600 px-3 py-1 rounded-full hover:bg-teal-700">
                        View Work
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetail;