import React, { useState } from 'react';

const CreateAssignmentForm = ({ onSubmit, onCancel, loading }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('deadline', new Date(deadline).toISOString());
    if (file) {
      formData.append('attachment', file);
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <input type="text" placeholder="Assignment Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md" required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md" required />
        <div>
          <label className="block text-sm font-medium text-slate-600">Deadline</label>
          <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full px-3 py-2 mt-1 border border-slate-300 rounded-md" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600">Attachment (Optional)</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full text-sm text-slate-500 mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" />
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <button type="button" onClick={onCancel} className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200">Cancel</button>
        <button type="submit" disabled={loading} className="px-4 py-2 font-semibold text-white bg-teal-600 rounded-md shadow-sm hover:bg-teal-700 disabled:bg-teal-400">
          {loading ? 'Creating...' : 'Create Assignment'}
        </button>
      </div>
    </form>
  );
};

export default CreateAssignmentForm;