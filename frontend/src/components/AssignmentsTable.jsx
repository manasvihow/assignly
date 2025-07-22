import React from 'react';
import { format } from 'date-fns';

const AssignmentsTable = ({ assignments, onRowClick }) => {

  if (!assignments || assignments.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg bg-white">
        <p className="text-sm font-medium text-slate-600">No assignments to display.</p>
        <p className="text-xs text-slate-500 mt-1">Click "Create New Assignment" to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Details</th>
            <th className="px-6 py-3">Due Date</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {assignments.map((assignment) => (
            <tr
              key={assignment.id}
              onClick={() => onRowClick(assignment)}
              className="cursor-pointer hover:bg-slate-50 transition-colors duration-150"
            >
              <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-800">{assignment.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-slate-500 truncate max-w-sm">{assignment.description}</td>
             
              <td className="px-6 py-4 whitespace-nowrap text-slate-500">{format(new Date(assignment.deadline), "PPp")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentsTable;