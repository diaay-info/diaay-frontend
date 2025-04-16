// src/Hooks/useCategories.js

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

/**
 * Simple hook to fetch categories for select fields
 * @returns {Object} - Categories data and loading state
 */
const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  /**
   * Fetch all categories from the API
   */
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/categories`);
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Return empty array on error
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);
  
  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  
  return {
    categories,
    loading,
    refetch: fetchCategories
  };
};

export default useCategories;