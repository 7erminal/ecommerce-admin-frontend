import React, { type ReactNode, useState } from 'react';
import ApplicationContext from './ApplicationContext';
import Api from '../apis';
import type { AddCategory, AddFeature, AddItem, AddPurpose, Category, Feature, Item, Language, Purpose, Role, Video } from '../types/applicationTypes';
import { API_ENDPOINTS } from '../../src/config/api.config';
import { applicationService } from '../../src/services/applicationService';

export const ApplicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [courses, setCourses] = useState<Array<Video>>([]);
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [languages, setLanguages] = useState<Array<Language>>([]);
  const [roles, setRoles] = useState<Array<Role>>([]);
  const [activeMenuItem, setActiveMenuItem] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [features, setFeatures] = useState<Array<Feature>>([]);
  const [purposes, setPurposes] = useState<Array<Purpose>>([]);
  const [items, setItems] = useState<Array<Item>>([]);
  const [itemCount, setItemCount] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState<Purpose | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  const clearAll = () => {
    setCourses([]);
    setCategories([]);
    setLanguages([]);
    setRoles([]);
    setError('');
  };

  const setActiveMenu = (menuItem: string) => {
    setActiveMenuItem(menuItem);
  };

  const getCourses = async (languageId: string | null | undefined = null, categoryId: string | null | undefined = null) => {
    try {
      let url = '/api/portal/videos/';
      const params = new URLSearchParams();

      if (languageId) params.append('language', languageId);
      if (categoryId) params.append('category', categoryId);
      if (params.toString()) {
        url += '?' + params.toString();
      }

      const response = await Api.GET_(url);
      if (response.status === 200 && response.data.StatusCode === 200) {
        setCourses(response.data.Result);
      }
    } catch (err) {
      console.error('Error fetching videos: ', err);
    }
  };

  const fetchCategories = async () => {
    try {
        const data = await applicationService.fetchCategories();
      
        if (!data.Success || !data.Result) {
            return;
        }

        setCategories(data.Result);
    } catch (err) {
      console.error('Error fetching categories: ', err);
    }
  };

  const fetchFeatures = async () => {
    try {
        const data = await applicationService.fetchFeatures();
      
        if (!data.Success || !data.Result) {
            return;
        }

        setFeatures(data.Result);
    } catch (err) {
      console.error('Error fetching features: ', err);
    }
  };

  const fetchPurposes = async () => {
    try {
        const data = await applicationService.fetchPurposes();
      
        if (!data.Success || !data.Result) {
            return;
        }

        setPurposes(data.Result);
    } catch (err) {
      console.error('Error fetching purposes: ', err);
    }
  };

  const fetchItems = async () => {
    try {
        const data = await applicationService.fetchItems();
      
        if (!data.Success || !data.Result) {
            return;
        }

        setItems(data.Result.Data);
        setItemCount(data.Result.Count);
    } catch (err) {
      console.error('Error fetching items: ', err);
    }
  };

  const fetchLanguages = async () => {
    try {
      const response = await Api.GET_('/api/portal/languages/');
      if (response.status === 200 && response.data.StatusCode === 200) {
        setLanguages(response.data.Result);
      }
    } catch (err) {
      console.error('Error fetching languages: ', err);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await Api.GET_(API_ENDPOINTS.ROLES.GET_ALL);
      if (response.status === 200 && response.data.Success === true) {
        setRoles(response.data.Result);
      }
    } catch (err) {
      console.error('Error fetching roles: ', err);
      setError('Failed to fetch roles');
    }
  };

  const addCategory = async (payload: AddCategory) => {
    try {
      const response = await applicationService.addCategory(payload);
      if (response.Success === true) {
        await fetchCategories();
      }

      return response;
    } catch (err) {
      console.error('Error adding category: ', err);
      setError('Failed to add category');
      return { Success: false, StatusDesc: 'Failed to add category', Result: null };
    }
  };

  const addFeature = async (payload: AddFeature) => {
    try {
      const response = await applicationService.addFeature(payload);
      if (response.Success === true) {
        await fetchFeatures();
      }
      return response;
    } catch (err) {
      console.error('Error adding feature: ', err);
      setError('Failed to add feature');
      return { Success: false, StatusDesc: 'Failed to add feature', Result: null };
    }
  }

  const addPurpose = async (payload: AddPurpose) => {
    try {
      const response = await applicationService.addPurpose(payload);
      if (response.Success === true) {
        await fetchPurposes();
      }

      return response;
    } catch (err) {
      console.error('Error adding purpose: ', err);
      setError('Failed to add purpose');
      return { Success: false, StatusDesc: 'Failed to add purpose', Result: null };
    }
  }

  const addItem = async (payload: AddItem) => {
    try {
      const response = await applicationService.addItem(payload);
      if (response.Success === true) {
        await fetchItems();
      }
      return response;
    } catch (err) {
      console.error('Error adding item: ', err);
      setError('Failed to add item');
      return { Success: false, StatusDesc: 'Failed to add item', Result: null };
    }
  }

  const uploadItemImage = async (file: File) => {
    try {
      const response = await applicationService.uploadItemImage(file);
      return response;
    } catch (err) {
      console.error('Error uploading item image: ', err);
      setError('Failed to upload item image');
      return { Success: false, StatusDesc: 'Failed to upload item image', Result: null };
    }
  }

  const deleteItem = async (id: string) => {
    try {
      const response = await applicationService.deleteItem(id);
      if (response.Success === true) {
        await fetchItems();
      }
      return response;
    } catch (err) {
      console.error('Error deleting item: ', err);
      setError('Failed to delete item');
      return { Success: false, StatusDesc: 'Failed to delete item', Result: null };
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      const response = await applicationService.deleteCategory(id);
      if (response.Success === true) {
        await fetchCategories();
      }
      return response;
    } catch (err) {
      console.error('Error deleting category: ', err);
      setError('Failed to delete category');
      return { Success: false, StatusDesc: 'Failed to delete category', Result: null };
    }
  }

  const deleteFeature = async (id: string) => {
    try {
      const response = await applicationService.deleteFeature(id);
      if (response.Success === true) {
        await fetchFeatures();
      }
      return response;
    } catch (err) {
      console.error('Error deleting feature: ', err);
      setError('Failed to delete feature');
      return { Success: false, StatusDesc: 'Failed to delete feature', Result: null };
    }
  }

  const deletePurpose = async (id: string) => {
    try {
      const response = await applicationService.deletePurpose(id);
      if (response.Success === true) {
        await fetchPurposes();
      }
      return response;
    } catch (err) {
      console.error('Error deleting purpose: ', err);
      setError('Failed to delete purpose');
      return { Success: false, StatusDesc: 'Failed to delete purpose', Result: null };
    }
  }

  return (
    <ApplicationContext.Provider
      value={{
        clearAll,
        loading,
        setLoading,
        courses,
        categories,
        setCategories,
        languages,
        getCourses,
        fetchCategories,
        fetchLanguages,
        activeMenuItem,
        setActiveMenu,
        roles,
        fetchRoles,
        error,
        setError,
        features,
        setFeatures,
        purposes,
        setPurposes,
        items,
        setItems,
        itemCount,
        selectedItem,
        setSelectedItem,
        selectedCategory,
        setSelectedCategory,
        selectedPurpose,
        setSelectedPurpose,
        selectedFeature,
        setSelectedFeature,
        fetchFeatures,
        fetchPurposes,
        fetchItems,
        addCategory,
        addFeature,
        addPurpose,
        addItem,
        uploadItemImage,
        deleteCategory,
        deleteFeature,
        deletePurpose,
        deleteItem,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
