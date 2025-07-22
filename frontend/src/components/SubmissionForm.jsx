import React, { useState } from 'react';

const SubmissionForm = ({ onSubmit, onCancel, loading }) => {
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
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
        <label className="block text-sm font-medium text-slate-600">Submission File</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full text-sm text-slate-500 mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
          required
        />
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <button type="button" onClick={onCancel} className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200">Cancel</button>
        <button type="submit" disabled={loading} className="px-4 py-2 font-semibold text-white bg-teal-600 rounded-md shadow-sm hover:bg-teal-700 disabled:bg-teal-400">
          {loading ? 'Submitting...' : 'Submit Work'}
        </button>
      </div>
    </form>
  );
};

export default SubmissionForm;