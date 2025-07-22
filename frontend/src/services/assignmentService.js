import apiClient from '../api/apiClient';

const getAllAssignments = async () => {
  const response = await apiClient.get('/assignments/');
  return response.data;
};

const createAssignment = async (formData) => {
  const response = await apiClient.post('/assignments/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const getSubmissionsForAssignment = async (assignmentId) => {
  const response = await apiClient.get(`/assignments/${assignmentId}/submissions`);
  return response.data;
};

const getMySubmissions = async () => {
  const response = await apiClient.get('/submissions/me');
  return response.data;
};

const submitAssignment = async (assignmentId, formData) => {
  const response = await apiClient.post(`/assignments/${assignmentId}/submit`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const getMySubmissionForAssignment = async (assignmentId) => {
  const response = await apiClient.get(`/assignments/${assignmentId}/my-submission`);
  return response.data;
};

export {
  getAllAssignments,
  createAssignment,
  getSubmissionsForAssignment,
  getMySubmissions,
  submitAssignment,
  getMySubmissionForAssignment, // ← include this in the export
};
