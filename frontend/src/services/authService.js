import apiClient from '../api/apiClient';

const login = async (username, password) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  const response = await apiClient.post('/auth/token', formData);
  return response.data;
};

export { login };