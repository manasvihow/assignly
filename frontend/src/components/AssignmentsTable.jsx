import React from 'react';

const AssignmentsTable = ({ assignments, onRowClick }) => {
  if (!assignments || assignments.length === 0) {
    return <p className="text-slate-500">No assignments to display.</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
      <table className="min-w-full divide-y divide-[#E5E7EB] text-sm text-[#1E1E1E]">
        <thead className="bg-[#F7F8FC] text-left text-xs font-semibold text-[#4C5FD5] uppercase tracking-wider">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Details</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Due Date</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-[#E5E7EB]">
          {assignments.map((assignment, i) => (
            <tr key={assignment.id} onClick={() => onRowClick(assignment)} className={`cursor-pointer ${i % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]'} hover:bg-[#F0F2FF] transition`}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{assignment.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{assignment.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 truncate max-w-xs">{assignment.description}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(assignment.deadline).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentsTable;