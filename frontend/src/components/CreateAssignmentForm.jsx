import React, { useState } from 'react';

const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const CreateAssignmentForm = ({ onSubmit, onCancel, loading, dateError }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

  
    const formData = {
        title,
        description,
        deadline,
        attachment: file,
    };
    onSubmit(formData);
  };

  const inputStyle = "w-full px-3 py-2 mt-1 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500";

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-6">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700">
            Title
          </label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputStyle} required />
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputStyle} min-h-[100px]`} required />
        </div>

        {/* Deadline Field */}
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-slate-700">
            Deadline
          </label>
          <input type="datetime-local" id="deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={inputStyle} required />
          
          {dateError && (
            <p className="mt-2 text-sm text-red-600">{dateError}</p>
          )}
        </div>

        <div>
          <span className="block text-sm font-medium text-slate-700">
            Attachment (Optional)
          </span>

          <div className="mt-2 flex items-center gap-4">
            <label
              htmlFor="attachment"
              className="cursor-pointer rounded-md bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
            >
              Choose File
            </label>

            <input
              type="file"
              id="attachment"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />

            <span className="text-sm text-slate-500">
              {file ? file.name : 'No file chosen'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-slate-200">
        <button type="button" onClick={onCancel} disabled={loading} className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 cursor-pointer">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="inline-flex items-center px-4 py-2 font-semibold text-white bg-slate-700 rounded-lg shadow-sm hover:bg-slate-800 disabled:bg-slate-500 disabled:cursor-not-allowed cursor-pointer">
          {loading && <Spinner />}
          {loading ? 'Creating...' : 'Create Assignment'}
        </button>
      </div>
    </form>
  );
};

export default CreateAssignmentForm;