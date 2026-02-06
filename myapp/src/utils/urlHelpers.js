/**
 * Utility functions for URL formatting and navigation
 */

/**
 * Convert a full name to a URL-friendly slug
 * @param {string} fullName - The user's full name
 * @returns {string} - URL-friendly slug (e.g., "anugrah-singh")
 */
export const formatNameForUrl = (fullName) => {
  if (!fullName) return '';
  
  return fullName
    .toLowerCase()                    // Convert to lowercase
    .trim()                           // Remove leading/trailing spaces
    .replace(/\s+/g, '-')             // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '')       // Remove special characters except hyphens
    .replace(/-+/g, '-')              // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');           // Remove leading/trailing hyphens
};

/**
 * Generate a complete profile URL with name before ID
 * @param {string} userId - The user's database ID
 * @param {string} fullName - The user's full name
 * @returns {string} - Complete profile URL (name-first format)
 */
export const generateProfileUrl = (userId, fullName) => {
  const nameSlug = formatNameForUrl(fullName);
  return `/NetworkProfile/${nameSlug}/${userId}`;
};

/**
 * Extract user ID from URL parameters
 * Handles both old format (/NetworkProfile/:userId) and new format (/NetworkProfile/:name/:userId)
 * @param {object} params - Route parameters from useParams()
 * @returns {string|null} - User ID or null if not found
 */
export const extractUserIdFromParams = (params) => {
  // New format: /NetworkProfile/:name/:userId
  if (params.name && params.userId) {
    return params.userId;
  }
  
  // Old format: /NetworkProfile/:userId
  if (params.userId) {
    return params.userId;
  }
  
  return null;
};

/**
 * Validate if a URL parameter is a valid MongoDB ObjectId
 * @param {string} id - The ID to validate
 * @returns {boolean} - True if valid ObjectId format
 */
export const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};