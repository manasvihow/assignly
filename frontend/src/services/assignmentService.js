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

export { getAllAssignments, createAssignment, getSubmissionsForAssignment };