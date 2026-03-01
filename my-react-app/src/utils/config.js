// Application configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Get full URL for an image path
 * @param {string} path - Image path (e.g., '/uploads/models/image.glb')
 * @returns {string} Full URL for the image
 */
export const getImageUrl = (path) => {
  if (!path) return '/img/placeholder.png';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
};

/**
 * Get full URL for a model path
 * @param {string} path - Model path (e.g., '/uploads/models/model.glb')
 * @returns {string} Full URL for the model
 */
export const getModelUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
};
