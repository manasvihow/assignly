import React, { useState, useEffect, useMemo } from 'react';
import { getSubmissionsForAssignment } from '../services/assignmentService';
import { format } from 'date-fns'; 

const AssignmentDetail = ({ assignment, onBack }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const filteredSubmissions = useMemo(() => {
    const deadline = new Date(assignment.deadline);
    return submissions
      .filter(submission => {
      
        if (showOnlyLate) {
          return new Date(submission.submitted_at) > deadline;
        }
        return true;
      })
      .filter(submission => {
      
        return submission.student.username.toLowerCase().includes(searchTerm.toLowerCase());
      });
  }, [submissions, searchTerm, showOnlyLate, assignment.deadline]);

  if (!assignment) return null;
  
  const inputStyle = "w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500";

  return (
    <div>
  
      <div className="flex justify-between items-center mb-4">
        <button onClick={onBack} className="cursor-pointer inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        {/* Assignment Info Section */}
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">{assignment.title}</h2>
          <p className="text-sm text-slate-600 mt-2">{assignment.description}</p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
             <p className="text-slate-500">
                <span className="font-medium text-slate-600">Deadline:</span> {format(new Date(assignment.deadline), "PPpp")}
            </p>
             <p className="text-slate-500">
                <span className="font-medium text-slate-600">Submissions:</span> {submissions.length}
            </p>
          </div>
          {assignment.attachment_url && (
            <a 
              href={`http://127.0.0.1:8000/${assignment.attachment_url}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-slate-600 hover:underline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              Download Attachment
            </a>
          )}
        </div>

        {/* Submissions Section */}
        <div className="p-6">
          <h3 className="font-semibold text-slate-700 mb-4">Submissions</h3>
          
          {/* Filter controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by student name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${inputStyle} sm:col-span-2`}
            />
            <label className="flex items-center justify-start sm:justify-center whitespace-nowrap bg-slate-50 p-2 rounded-lg border border-slate-200">
              <input
                type="checkbox"
                checked={showOnlyLate}
                onChange={(e) => setShowOnlyLate(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500"
              />
              <span className="ml-2 text-sm font-medium text-slate-700">Show only late</span>
            </label>
          </div>

          {/* Submissions List */}
          {loading && <p className="text-center p-4 text-sm text-slate-500">Loading submissions...</p>}
          {error && <p className="text-center p-4 text-red-500">{error}</p>}
          {!loading && filteredSubmissions.length === 0 && <div className="text-center p-8 border border-dashed rounded-lg bg-slate-50"><p className="text-sm font-medium text-slate-600">No matching submissions found.</p><p className="text-xs text-slate-500">Try adjusting your filters.</p></div>}
          
          <div className="max-h-[28rem] overflow-y-auto pr-2 -mr-2">
            <ul className="space-y-3">
              {filteredSubmissions.map(submission => {
                const isLate = new Date(submission.submitted_at) > new Date(assignment.deadline);
                return (
                  <li key={submission.id} className="p-3 bg-white border border-slate-200 rounded-lg flex justify-between items-center transition hover:border-slate-300 hover:shadow-sm">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-800">{submission.student.username}</p>
                        {isLate && (
                           <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-rose-100 text-rose-800">
                             Late
                           </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Submitted: {format(new Date(submission.submitted_at), "PPp")}</p>
                    </div>
                    {submission.attachment_url && (
                      <a href={`http://127.0.0.1:8000/${submission.attachment_url}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 px-3 py-1 rounded-full hover:bg-slate-100">
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