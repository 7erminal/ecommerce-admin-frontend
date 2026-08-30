import Api from '../../resources/apis';
import { API_ENDPOINTS } from '../config/api.config';
import type { CategoriesResponseDTO, ItemsResponseDTO, ItemResponseDTO, AddCategory, CategoryResponseDTO, FeaturesResponseDTO, PurposesResponseDTO, AddFeature, AddPurpose, AddItem, FeatureResponseDTO, PurposeResponseDTO, StringResponseDTO, ItemImageUploadResponseDTO, SystemConfigsResponseDTO, EditItem, EditItemPayload, OrdersResponseDTO, OrderResponseDTO, TransactionsResponseDTO, PlaceOrderPayload, CustomerResponse, AddCustomer, CustomersResponse, AddUser, UsersResponseDTO, UserResponse, IdTypesResponseDTO } from '../../resources/types/applicationTypes';

class ApplicationService {
  /**
   * Fetch user session details from backend using access token
   * Called after login/register and after token refresh
   */
  async fetchSystemConfigs(branchId: string): Promise<SystemConfigsResponseDTO> {
    const response = await Api.GET_<SystemConfigsResponseDTO>(API_ENDPOINTS.SYSTEM_CONFIGS.GET_ALL(branchId));
    return response.data;
  }

  async fetchIdTypes(): Promise<IdTypesResponseDTO> {
    console.log("ID Types url is "+API_ENDPOINTS.ID_TYPES.GET_ALL)
    const response = await Api.GET_<IdTypesResponseDTO>(API_ENDPOINTS.ID_TYPES.GET_ALL);
    return response.data;
  }

  async fetchCategories(): Promise<CategoriesResponseDTO> {
    const response = await Api.GET_<CategoriesResponseDTO>(API_ENDPOINTS.CATEGORIES.GET_ALL);
    return response.data;
  }

  async fetchFeatures(): Promise<FeaturesResponseDTO> {
    const response = await Api.GET_<FeaturesResponseDTO>(API_ENDPOINTS.FEATURES.GET_ALL);
    return response.data;
  }

  async fetchPurposes(): Promise<PurposesResponseDTO> {
    const response = await Api.GET_<PurposesResponseDTO>(API_ENDPOINTS.PURPOSES.GET_ALL);
    return response.data;
  }

  // Fetch all items from backend using access token
    async fetchItems(): Promise<ItemsResponseDTO> {
        const response = await Api.GET_<ItemsResponseDTO>(API_ENDPOINTS.ITEMS.GET_ALL);
        console.log('fetchItems response:', response);
        return response.data;
    }

    // Fetch item by ID from backend using access token
    async fetchItemById(id: string): Promise<ItemResponseDTO> {
        const response = await Api.GET_<ItemResponseDTO>(API_ENDPOINTS.ITEMS.GET_BY_ID(id));
        return response.data;
    }

    async addCategory(payload: AddCategory): Promise<CategoryResponseDTO> {
      const formData = new FormData();
      formData.append('CategoryImage', payload.CategoryImage!);
      formData.append('CategoryName', payload.CategoryName);
      formData.append('CategoryDescription', payload.CategoryDescription);
      const response = await Api.POST_FORM_DATA<CategoryResponseDTO>(API_ENDPOINTS.CATEGORIES.ADD_CATEGORY, formData);
      return response.data;
    }

    async addFeature(payload: AddFeature): Promise<FeatureResponseDTO> {
      const formData = new FormData();
      formData.append('FeatureImage', payload.FeatureImage!);
      formData.append('FeatureName', payload.FeatureName);
      formData.append('FeatureDescription', payload.FeatureDescription);
      const response = await Api.POST_FORM_DATA<FeatureResponseDTO>(API_ENDPOINTS.FEATURES.ADD_FEATURE, formData);
      return response.data;
    }

    async addPurpose(payload: AddPurpose): Promise<PurposeResponseDTO> {
      const formData = new FormData();
      formData.append('PurposeImage', payload.PurposeImage!);
      formData.append('PurposeName', payload.PurposeName);
      formData.append('PurposeDescription', payload.PurposeDescription);
      const response = await Api.POST_FORM_DATA<PurposeResponseDTO>(API_ENDPOINTS.PURPOSES.ADD_PURPOSE, formData);
      return response.data;
    }

    async addItem(payload: AddItem): Promise<ItemResponseDTO> {
      const response = await Api.POST_<ItemResponseDTO>(API_ENDPOINTS.ITEMS.ADD_ITEM, payload);
      return response.data;
    }

    async uploadItemImage(file: File): Promise<ItemImageUploadResponseDTO> {
      const formData = new FormData();
      formData.append('Image', file);
      const response = await Api.POST_FORM_DATA<ItemImageUploadResponseDTO>(API_ENDPOINTS.ITEMS.UPLOAD_IMAGE, formData);
      return response.data;
    }

    async updateItem(payload: EditItem): Promise<ItemResponseDTO> {
      const reformedPayload: EditItemPayload = {
        ProductName: payload.ProductName,
        Description: payload.Description,
        ImagePath: payload.ImagePath,
        ImagePaths: payload.ImagePaths,
        Purposes: payload.Purposes,
        Features: payload.Features,
        AvailableSizes: payload.AvailableSizes,
        AvailableColors: payload.AvailableColors,
        Quantity: payload.Quantity,
        CostPrice: payload.CostPrice,
        SellingPrice: payload.SellingPrice,
        QuantityAlert: payload.QuantityAlert,
        Weight: payload.Weight,
        CategoryId: payload.CategoryId
      }
      const response = await Api.POST_<ItemResponseDTO>(API_ENDPOINTS.ITEMS.UPDATE_ITEM(payload.ProductId.toString()), reformedPayload);
      return response.data;
    }

    async deleteItem(id: string): Promise<StringResponseDTO> {
      const response = await Api.DELETE<StringResponseDTO>(API_ENDPOINTS.ITEMS.DELETE_ITEM(id), { Id: id });
      return response.data;
    }

    async deleteCategory(id: string): Promise<StringResponseDTO> {
      const response = await Api.DELETE<StringResponseDTO>(API_ENDPOINTS.CATEGORIES.DELETE_CATEGORY(id), { Id: id });
      return response.data;
    }

    async deleteFeature(id: string): Promise<StringResponseDTO> {
      const response = await Api.DELETE<StringResponseDTO>(API_ENDPOINTS.FEATURES.DELETE_FEATURE(id), { Id: id });
      return response.data;
    }

    async deletePurpose(id: string): Promise<StringResponseDTO> {
      const response = await Api.DELETE<StringResponseDTO>(API_ENDPOINTS.PURPOSES.DELETE_PURPOSE(id), { Id: id });
      return response.data;
    }

    // Fetch all orders from backend using access token
    async fetchOrders(order?: string, sortby: string = "DateCreated"): Promise<OrdersResponseDTO> {
      const endpoint = order
        ? `${API_ENDPOINTS.ORDERS.GET_ALL}?sortby=${encodeURIComponent(sortby)}&order=${encodeURIComponent(order)}`
        : API_ENDPOINTS.ORDERS.GET_ALL;

      const response = await Api.GET_<any>(endpoint);
        console.log('fetchOrders response:', response);
        return response.data;
    }

    // Fetch order by ID from backend using access token
    async fetchOrder(id: string): Promise<OrderResponseDTO> {
        const response = await Api.GET_<any>(API_ENDPOINTS.ORDERS.GET_BY_ID(id));
        console.log('fetchOrder response:', response);
        return response.data;
    }

    async placeOrder(payload: PlaceOrderPayload): Promise<TransactionsResponseDTO> {
      const response = await Api.POST_<TransactionsResponseDTO>(API_ENDPOINTS.ORDERS.ADD_ORDER, payload);
      return response.data;
    }

    async fetchCustomers(): Promise<CustomersResponse> {
        const response = await Api.GET_<any>(API_ENDPOINTS.CUSTOMERS.GET_ALL);
        console.log('fetchCustomers response:', response);
        return response.data;
    }

    async fetchCustomer(id: string): Promise<CustomerResponse> {
        const response = await Api.GET_<any>(API_ENDPOINTS.CUSTOMERS.GET_BY_ID(id));
        console.log('fetchCustomer response:', response);
        return response.data;
    }

    async addCustomer(payload: AddCustomer): Promise<CustomerResponse> {
      const response = await Api.POST_<CustomerResponse>(API_ENDPOINTS.CUSTOMERS.ADD_CUSTOMER, payload);
      return response.data;
    }

    async fetchUsers(): Promise<UsersResponseDTO> {
        const response = await Api.GET_<any>(API_ENDPOINTS.USER.GET_ALL);
        console.log('fetchUsers response:', response);
        return response.data;
    }

    async addUser(payload: AddUser): Promise<UserResponse> {
      const response = await Api.POST_<UserResponse>(API_ENDPOINTS.USER.ADD_USER, payload);
      return response.data;
    }
}

export const applicationService = new ApplicationService();