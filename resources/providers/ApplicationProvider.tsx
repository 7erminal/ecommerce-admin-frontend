import React, { type ReactNode, useState } from 'react';
import ApplicationContext from './ApplicationContext';
import Api from '../apis';
import type { AddCategory, AddFeature, AddItem, AddPurpose, Branch, Category, EditItem, Feature, Item, Language, Purpose, Role, SystemConfigsResponseDTO, SystemData, Order, PlaceOrderPayload, TransactionsResponseDTO, User, AddCustomer, AddUser } from '../types/applicationTypes';
import { API_ENDPOINTS } from '../../src/config/api.config';
import { applicationService } from '../../src/services/applicationService';

export const ApplicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
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
  const [branch, setBranch] = useState<Branch | null>(null);
  const [orders, setOrders] = useState<Array<Order>>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [users, setUsers] = useState<Array<User>>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [customers, setCustomers] = useState<Array<any>>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [idTypes, setIdTypes] = useState<Array<any>>([]);


  const clearAll = () => {
    setCategories([]);
    setLanguages([]);
    setRoles([]);
    setItems([]);
    setFeatures([]);
    setPurposes([]);
    setError('');
  };

  const setActiveMenu = (menuItem: string) => {
    setActiveMenuItem(menuItem);
  };

  const fetchSystemConfigs = async (branchId: string) => {
    try {
        var success = false;
        var data_: SystemData = {} as SystemData;
        var message = '';
        var resp: SystemConfigsResponseDTO = {} as SystemConfigsResponseDTO;
        const data = await applicationService.fetchSystemConfigs(branchId);
        
        if (!data.Success || !data.Result) {
            message = data.StatusDesc || 'Failed to fetch system configs';
        } else {
            success = true;
            data_ = data.Result;
        }
        setBranch(data_.Branch);
        resp = {
            Success: success,
            StatusDesc: message,
            Result: data_,
        };
    } catch (err) {
      console.error('Error fetching system configs: ', err);
      setError('Failed to fetch system configs');
      resp = {
        Success: false,
        StatusDesc: 'Failed to fetch system configs',
        Result: {} as SystemData,
      };
    }

    return resp;
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

  const fetchIdTypes = async () => {
    try {
        console.log("About to fetch ID types")
        const data = await applicationService.fetchIdTypes();
      
        console.log("Data returned is ")
        console.log(data)
        if (!data.Success || !data.Result) {
            return;
        }

        setIdTypes(data.Result);
    } catch (err) {
      console.error('Error fetching ID types: ', err);
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

  const fetchOrders = async (order?: string) => {
    try {
        const data = await applicationService.fetchOrders(order);
      
        if (!data.Success || !data.Result) {
            return;
        }

        setOrders(data.Result);
    } catch (err) {
      console.error('Error fetching orders: ', err);
    }
  };

  const fetchOrder = async (orderId: string) => {
    try {
        const data = await applicationService.fetchOrder(orderId);
      
        if (!data.Success || !data.Result) {
            return;
        }

        setOrder(data.Result);
    } catch (err) {
      console.error('Error fetching order: ', err);
    }
  };

  const placeOrder = async (payload: PlaceOrderPayload): Promise<TransactionsResponseDTO> => {
    try {
      const response = await applicationService.placeOrder(payload);
      if (response.Success === true) {
        await fetchOrders();
      }
      return response;
    } catch (err) {
      console.error('Error placing order: ', err);
      setError('Failed to place order');
      return { Success: false, StatusDesc: 'Failed to place order', Result: null };
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

  const addCustomer = async (payload: AddCustomer) => {
    try {
      payload.Category = 'GEN';
      const response = await applicationService.addCustomer(payload);
      if (response.Success === true) {
        await fetchCustomers();
      }

      return response;
    } catch (err) {
      console.error('Error adding customer: ', err);
      setError('Failed to add customer');
      return { Success: false, StatusDesc: 'Failed to add customer', Result: null };
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await applicationService.fetchCustomers();
      if (response.Success === true) {
        setCustomers(response.Result ?? []);
      }
    } catch (err) {
      console.error('Error fetching customers: ', err);
    }
  };

  const addUser = async (payload: AddUser) => {
    try {
      const response = await applicationService.addUser(payload);
      if (response.Success === true) {
        await fetchUsers();
      }

      return response;
    } catch (err) {
      console.error('Error adding user: ', err);
      setError('Failed to add user');
      return { Success: false, StatusDesc: 'Failed to add user', Result: null };
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await applicationService.fetchUsers();
      if (response.Success === true) {
        setUsers(response.Result ?? []);
      }
    } catch (err) {
      console.error('Error fetching users: ', err);
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

  const updateItem = async (payload: EditItem) => {
    try {
      const response = await applicationService.updateItem(payload);
      if (response.Success === true) {
        await fetchItems();
      }
      return response;
    } catch (err) {
      console.error('Error updating item: ', err);
      setError('Failed to update item');
      return { Success: false, StatusDesc: 'Failed to update item', Result: null };
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
        categories,
        setCategories,
        languages,
        fetchSystemConfigs,
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
        branch,
        updateItem,
        fetchOrders,
        fetchOrder,
        placeOrder,
        orders,
        order,
        users,
        setUsers,
        selectedUser,
        setSelectedUser,
        customers,
        setCustomers,
        selectedCustomer,
        setSelectedCustomer,
        fetchCustomers,
        addCustomer,
        fetchUsers,
        addUser,
        idTypes,
        setIdTypes,
        fetchIdTypes,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
