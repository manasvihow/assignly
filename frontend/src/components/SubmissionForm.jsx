import React, { useState } from 'react';

const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const UploadIcon = () => (
    <svg className="w-8 h-8 mx-auto text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const SubmissionForm = ({ onSubmit, onCancel, loading }) => {
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    if (!file) {
      alert("Please select a file to submit.");
      return;
    }
    const formData = new FormData();
    formData.append('attachment', file);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="submission-file" className="block text-sm font-medium text-slate-700 mb-2">
          Submission File
        </label>
        
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-300 px-6 py-10">
          <div className="text-center">
            <UploadIcon />
            <div className="mt-4 flex text-sm leading-6 text-slate-600">
              <label
                htmlFor="submission-file"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-slate-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-slate-600 focus-within:ring-offset-2 hover:text-slate-500"
              >
                <span>Upload a file</span>
                <input id="submission-file" name="submission-file" type="file" className="sr-only" onChange={(e) => setFile(e.target.files[0])} required />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-slate-500">Any file type up to 10MB</p>
           
            {file && (
                <p className="text-sm font-medium text-emerald-600 mt-4">
                    Selected: {file.name}
                </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-slate-200">
        <button type="button" onClick={onCancel} disabled={loading} className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50">
          Cancel
        </button>
        <button type="submit" disabled={loading || !file} className="inline-flex items-center px-4 py-2 font-semibold text-white bg-slate-700 rounded-lg shadow-sm hover:bg-slate-800 disabled:bg-slate-500 disabled:cursor-not-allowed">
          {loading && <Spinner />}
          {loading ? 'Submitting...' : 'Submit Work'}
        </button>
      </div>
    </form>
  );
};

export default SubmissionForm;