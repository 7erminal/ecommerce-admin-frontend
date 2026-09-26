import React, { type ReactNode, useState } from 'react';
import ApplicationContext from './ApplicationContext';
import Api from '../apis';
import type { AddCategory, AddFeature, AddItem, AddPurpose, Branch, Category, EditItem, Feature, Item, Language, Purpose, Role, SystemConfigsResponseDTO, SystemData, Order, PlaceOrderPayload, TransactionsResponseDTO, User, AddCustomer, AddUser, AddApplication, ApplicationResp, UpdateApplication, AddTheme, UpdateApplicationThemePayload, AddThemeConfigPayload, ThemeResp, ShopResp, BranchResp, ShopRequestDTO, BranchRequestDTO, ShopBranchRequestDTO, ApplicationShopRequest, ApplicationShopFullResponseData } from '../types/applicationTypes';
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
  const [applications, setApplications] = useState<Array<ApplicationResp>>([]);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationResp | null>(null);
  const [themes, setThemes] = useState<Array<ThemeResp>>([]);
  const [selectedTheme, setSelectedTheme] = useState<ThemeResp | null>(null);
  const [shops, setShops] = useState<Array<ShopResp>>([]);
  const [shop, setShop] = useState<ShopResp | null>(null);
  const [branches, setBranches] = useState<Array<BranchResp>>([]);
  const [applicationShops, setApplicationShops] = useState<Array<ApplicationShopFullResponseData>>([]);


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

  const uploadSystemImage = async (file: File, systemName: string) => {
    try {
      const response = await applicationService.uploadSystemImage(file, systemName);
      return response;
    } catch (err) {
      console.error('Error uploading system image: ', err);
      setError('Failed to upload system image');
      return { Success: false, StatusDesc: 'Failed to upload system image', Result: null };
    }
  }

  const fetchApplications = async () => {
    try {
      const response = await applicationService.fetchApplications();
      if (response.Success === true) {
        setApplications(response.Result?.Data || []);
      }
      return response;
    } catch (err) {
      console.error('Error fetching applications: ', err);
      setError('Failed to fetch applications');
      return { Success: false, StatusDesc: 'Failed to fetch applications', Result: null };
    }
  }

  const fetchThemes = async () => {
    try {
      const response = await applicationService.fetchThemes();
      if (response.Success === true) {
        console.log("About to set themes: ", response.Result);
        setThemes(response.Result || []);
        console.log("Themes set successfully.");
      }
      return response;
    } catch (err) {
      console.error('Error fetching themes: ', err);
      setError('Failed to fetch themes');
      return { Success: false, StatusDesc: 'Failed to fetch themes', Result: null };
    }
  }

  const addApplication = async (payload: AddApplication) => {
    try {
      const response = await applicationService.addApplication(payload);
      if (response.Success === true) {
        await fetchApplications();
      }
      return response;
    } catch (err) {
      console.error('Error adding application: ', err);
      setError('Failed to add application');
      return { Success: false, StatusDesc: 'Failed to add application', Result: null };
    }
  }

  const updateApplication = async (id: string, payload: UpdateApplication) => {
    try {
      const response = await applicationService.updateApplication(id, payload);
      if (response.Success === true) {
        await fetchApplications();
      }
      return response;
    } catch (err) {
      console.error('Error updating application: ', err);
      setError('Failed to update application');
      return { Success: false, StatusDesc: 'Failed to update application', Result: null };
    }
  }

  const updateApplicationTheme = async (id: string, payload: UpdateApplicationThemePayload) => {
  try {
    const response = await applicationService.updateApplicationTheme(id, payload);
    if (response.Success === true) {
    await fetchApplications();
    }
    return response;
  } catch (err) {
    console.error('Error updating application theme: ', err);
    setError('Failed to update application theme');
    return { Success: false, StatusDesc: 'Failed to update application theme', Result: null };
  }
  }

  const deleteApplication = async (id: string) => {
    try {
      const response = await applicationService.deleteApplication(id);
      if (response.Success === true) {
        await fetchApplications();
      }
      return response;
    } catch (err) {
      console.error('Error deleting application: ', err);
      setError('Failed to delete application');
      return { Success: false, StatusDesc: 'Failed to delete application', Result: null };
    }
  }

  const addTheme = async (payload: AddTheme) => {
    try {
      const response = await applicationService.addTheme(payload);
      if (response.Success === true) {
        await fetchThemes();
      }
      return response;
    } catch (err) {
      console.error('Error adding theme: ', err);
      setError('Failed to add theme');
      return { Success: false, StatusDesc: 'Failed to add theme', Result: null };
    }
  }

  const addThemeConfig = async (themeId: string, payload: AddThemeConfigPayload) => {
    try {
      const response = await applicationService.addThemeConfig(themeId, payload);
      if (response.Success === true) {
        await fetchThemes();
      }
      return response;
    } catch (err) {
      console.error('Error adding theme config: ', err);
      setError('Failed to add theme config');
      return { Success: false, StatusDesc: 'Failed to add theme config', Result: null };
    }
  }

  const removeTheme = async (id: string) => {
  try {
    const response = await applicationService.removeTheme(id);
    if (response.Success === true) {
      await fetchThemes();
    }
    return response;
  } catch (err) {
    console.error('Error removing theme: ', err);
    setError('Failed to remove theme');
    return { Success: false, StatusDesc: 'Failed to remove theme', Result: null };
  }
  }

  const fetchShops = async () => {
    try {
      const response = await applicationService.fetchShops();
      if (response.Success === true) {
        setShops(response.Result || []);
      }
      return response;
    } catch (err) {
      console.error('Error fetching shops: ', err);
      setError('Failed to fetch shops');
      return { Success: false, StatusDesc: 'Failed to fetch shops', Result: [] };
    }
  }

  const fetchShop = async (id: string) => {
    try {
      const response = await applicationService.fetchShop(id);
      if (response.Success === true) {
        setShop(response.Result || null);
      }
      return response;
    } catch (err) {
      console.error('Error fetching shop: ', err);
      setError('Failed to fetch shop');
      return { Success: false, StatusDesc: 'Failed to fetch shop', Result: null };
    }
  }

  const addShop = async (payload: ShopRequestDTO) => {
    try {
      const response = await applicationService.addShop(payload);
      if (response.Success === true) {
        await fetchShops();
      }
      return response;
    } catch (err) {
      console.error('Error adding shop: ', err);
      setError('Failed to add shop');
      return { Success: false, StatusDesc: 'Failed to add shop', Result: null };
    }
  }

  const updateShop = async (payload: ShopRequestDTO) => {
    try {
      const response = await applicationService.updateShop(payload);
      if (response.Success === true) {
        await fetchShops();
      }
      return response;
    } catch (err) {
      console.error('Error updating shop: ', err);
      setError('Failed to update shop');
      return { Success: false, StatusDesc: 'Failed to update shop', Result: null };
    }
  }

  const deleteShop = async (payload: { ShopId: string }) => {
    try {
      const response = await applicationService.deleteShop(payload);
      if (response.Success === true) {
        await fetchShops();
      }
      return response;
    } catch (err) {
      console.error('Error deleting shop: ', err);
      setError('Failed to delete shop');
      return { Success: false, StatusDesc: 'Failed to delete shop', Result: null };
    }
  }

  const fetchBranches = async () => {
    try {
      const response = await applicationService.fetchBranches();
      if (response.Success === true) {
        setBranches(response.Result?.Data || []);
      }
      return response;
    } catch (err) {
      console.error('Error fetching branches: ', err);
      setError('Failed to fetch branches');
      return { Success: false, StatusDesc: 'Failed to fetch branches', Result: null };
    }
  }

  const addBranch = async (payload: BranchRequestDTO) => {
    try {
      const response = await applicationService.addBranch(payload);
      if (response.Success === true) {
        await fetchBranches();
      }
      return response;
    } catch (err) {
      console.error('Error adding branch: ', err);
      setError('Failed to add branch');
      return { Success: false, StatusDesc: 'Failed to add branch', Result: null };
    }
  }

  const updateBranch = async (id: string, payload: BranchRequestDTO) => {
    try {
      const response = await applicationService.updateBranch(id, payload);
      if (response.Success === true) {
        await fetchBranches();
      }
      return response;
    } catch (err) {
      console.error('Error updating branch: ', err);
      setError('Failed to update branch');
      return { Success: false, StatusDesc: 'Failed to update branch', Result: null };
    }
  }

  const deleteBranch = async (id: string) => {
    try {
      const response = await applicationService.deleteBranch(id);
      if (response.Success === true) {
        await fetchBranches();
      }
      return response;
    } catch (err) {
      console.error('Error deleting branch: ', err);
      setError('Failed to delete branch');
      return { Success: false, StatusDesc: 'Failed to delete branch', Result: null };
    }
  }

  const addShopBranch = async (payload: ShopBranchRequestDTO) => {
    try {
      const response = await applicationService.addShopBranch(payload);
      if (response.Success === true) {
        await fetchShops();
      }
      return response;
    } catch (err) {
      console.error('Error adding branch to shop: ', err);
      setError('Failed to add branch to shop');
      return { Success: false, StatusDesc: 'Failed to add branch to shop', Result: null };
    }
  }

  const removeShopBranch = async (payload: ShopBranchRequestDTO) => {
    try {
      const response = await applicationService.removeShopBranch(payload);
      if (response.Success === true) {
        await fetchShops();
      }
      return response;
    } catch (err) {
      console.error('Error removing branch from shop: ', err);
      setError('Failed to remove branch from shop');
      return { Success: false, StatusDesc: 'Failed to remove branch from shop', Result: null };
    }
  }

  const addApplicationShop = async (payload: ApplicationShopRequest) => {
    try {
      const response = await applicationService.addApplicationShop(payload);
      if (response.Success === true) {
        await fetchApplications();
        await fetchApplicationShops();
      }
      return response;
    } catch (err) {
      console.error('Error adding shop to application: ', err);
      setError('Failed to add shop to application');
      return { Success: false, StatusDesc: 'Failed to add shop to application', Result: null };
    }
  }

  const removeApplicationShop = async (payload: ApplicationShopRequest) => {
    try {
      const response = await applicationService.removeApplicationShop(payload);
      if (response.Success === true) {
        await fetchApplications();
        await fetchApplicationShops();
      }
      return response;
    } catch (err) {
      console.error('Error removing shop from application: ', err);
      setError('Failed to remove shop from application');
      return { Success: false, StatusDesc: 'Failed to remove shop from application', Result: null };
    }
  }

  const fetchApplicationShops = async () => {
    try {
      const response = await applicationService.fetchApplicationShops();
      if (response.Success === true) {
        setApplicationShops(response.Result || []);
      }
      return response;
    } catch (err) {
      console.error('Error fetching application shops: ', err);
      setError('Failed to fetch application shops');
      return { Success: false, StatusDesc: 'Failed to fetch application shops', Result: [] };
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
        uploadSystemImage,
        applications,
        setApplications,
        selectedApplication,
        setSelectedApplication,
        fetchApplications,
        addApplication,
        updateApplication,
        updateApplicationTheme,
        deleteApplication,
        addTheme,
        addThemeConfig,
        removeTheme,
        themes,
        setThemes,
        selectedTheme,
        setSelectedTheme,
        fetchThemes,
        shops,
        setShops,
        fetchShops,
        fetchShop,
        addShop,
        updateShop,
        deleteShop,
        branches,
        setBranches,
        fetchBranches,
        addBranch,
        updateBranch,
        deleteBranch,
        addShopBranch,
        removeShopBranch,
        addApplicationShop,
        removeApplicationShop,
        applicationShops,
        setApplicationShops,
        fetchApplicationShops,
        shop,
        setShop,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
