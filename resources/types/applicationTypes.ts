import type { Dispatch } from "react"

export type AuthContextProps = {
  user: UserData | null | undefined
  isAuthenticated: boolean
  currentUser: StoredAuthUser | null
  accessToken: string | null
  refreshToken: string | null
  login: (email: string, password: string) => Promise<LoginResponse>
  register: (data: RegisterParams) => Promise<RegisterResponse>
  logout: () => void
  refreshSession: () => Promise<boolean>
  loading: boolean
  errorMessage: string
  setErrorMessage: Dispatch<React.SetStateAction<string>>
}

export type Role = {
  RoleId: string;
  Role: string;
  Description?: string;
}

/**
 * Auth/Token Types
 */
export type AuthenticationDTO = {
  Email: string;
  Password: string;
}

export type TokenResponseDTO = {
	AccessToken: string
	RefreshToken: string
	TokenType: string
	ExpiresIn: number
}

export type LoginDataResponseDTO = {
	UserType: string
	Token: TokenResponseDTO
}

export type LoginTokenResponseDTO = {
  Success: boolean
  StatusDesc: string
  Result: LoginDataResponseDTO
}

export type RefreshTokenRequest = {
  Value: string
}

export type LoginResponse = {
	Success: boolean
	Result: LoginDataResponseDTO | null
	StatusDesc: string
}

export type RegisterResponse = LoginResponse

export type RegisterRequestDTO = {
  Email: string
  FirstName: string
  LastName: string
  PhoneNumber: string
  Password: string
  Dob: string
  RoleId: string
}

/**
 * User Gateway/Session Types
 */
export type UserGatewayRole = {
  Role: string
}

export type UserGatewayBranch = {
  BranchId?: number
  Branch?: string
}

export type UserGatewayExtraDetails = {
  Branch?: UserGatewayBranch
}

export type UserGateway = {
  UserId: number
  FirstName: string
  LastName: string
  Username: string
  Email: string
  PhoneNumber: string
  ImagePath?: string
  Customer?: UserGatewayExtraDetails
  Status: string
  IsVerified?: boolean
  Role?: UserGatewayRole
  DateRegistered?: string
}

export type UserGatewayResponseDTO = {
  Success: boolean
  Result: UserGateway | null
  StatusDesc: string
}

export type CategoryResponseDTO = {
  Success: boolean
  Result: Category | null
  StatusDesc: string
}

export type FeatureResponseDTO = {
  Success: boolean
  Result: Feature | null
  StatusDesc: string
}

export type PurposeResponseDTO = {
  Success: boolean
  Result: Purpose | null
  StatusDesc: string
}

export type CategoriesResponseDTO = {
  Success: boolean
  Result: Array<Category> | null
  StatusDesc: string
}

export type FeaturesResponseDTO = {
  Success: boolean
  Result: Array<Feature> | null
  StatusDesc: string
}

export type PurposesResponseDTO = {
  Success: boolean
  Result: Array<Purpose> | null
  StatusDesc: string
}

export type Item = {
  ProductId: Number | string
  ProductName: string
  Description: string
  ImagePath: string
  Weight: string
  ProductPrice: number
  ProductCostPrice: number
  Quantity: number
  Branch?: UserGatewayBranch
  Category?: Category
  AvailableSizes?: Array<string>
  AvailableColors?: Array<string>
  Purposes?: Array<Purpose>
  Features?: Array<Feature>
  Status: string
}

export type ItemsData = {
  Count: number
  Data: Array<Item>
}

export type ItemsResponseDTO = {
  Success: boolean
  Result: ItemsData | null
  StatusDesc: string
}

export type ItemResponseDTO = {
  Success: boolean
  Result: Item | null
  StatusDesc: string
}

export type AddCategory = {
  CategoryImage: File | undefined
  CategoryName: string
  CategoryDescription: string
}

export type AddFeature = {
  FeatureImage: File | undefined
  FeatureName: string
  FeatureDescription: string
}

export type AddPurpose = {
  PurposeImage: File | undefined
  PurposeName: string
  PurposeDescription: string
}

export type AddItem = {
  ImagePath: string
  ImagePaths?: Array<string>
  ProductName: string
  Description: string
  Purposes: Array<number> | undefined
  Features: Array<number> | undefined
  AvailableSizes: Array<string> | undefined
  AvailableColors: Array<string> | undefined
  Quantity: number
  CostPrice: number
  SellingPrice: number
  QuantityAlert: number
  Weight: string
  CategoryId?: number
}

export type EditItem = {
  ProductId: Number | string
  ProductName: string
  Description: string
  ImagePath: string
  ImagePaths?: Array<string>
  Purposes: Array<number> | undefined
  Features: Array<number> | undefined
  AvailableSizes: Array<string> | undefined
  AvailableColors: Array<string> | undefined
  Quantity: number
  CostPrice: number
  SellingPrice: number
  QuantityAlert: number
  Weight: string
  CategoryId?: number
}

export type EditItemPayload = {
  ProductName: string
  Description: string
  ImagePath: string
  ImagePaths?: Array<string>
  Purposes: Array<number> | undefined
  Features: Array<number> | undefined
  AvailableSizes: Array<string> | undefined
  AvailableColors: Array<string> | undefined
  Quantity: number
  CostPrice: number
  SellingPrice: number
  QuantityAlert: number
  Weight: string
  CategoryId?: number
}

export type ItemImageUploadResponseDTO = {
  Success: boolean
  Result: string | null
  StatusDesc: string
}

export type StringResponseDTO = {
  Success: boolean
  Result: string | null
  StatusDesc: string
}

// export type LoginResponse = {
//   Success: boolean;
//   StatusDesc: string;
//   Result?: any;
//   Value?: string;
//   User?: {
//     UserId: string;
//     Email: string;
//     FullName: string;
//   };
// }

export type ApplicationContextProps = {
  clearAll: ()=>void
  loading: boolean
  setLoading: Dispatch<React.SetStateAction<boolean>>
  categories: Array<Category>
  languages: Array<Language>
  fetchCategories: () => Promise<void>
  fetchLanguages: () => Promise<void>
  activeMenuItem: string
  setActiveMenu: (menuItem: string) => void
  roles: Array<Role>
  fetchRoles: () => Promise<void>
  error: string
  setError: Dispatch<React.SetStateAction<string>>
  features: Array<Feature>,
  purposes: Array<Purpose>,
  setFeatures: Dispatch<React.SetStateAction<Array<Feature>>>
  setPurposes: Dispatch<React.SetStateAction<Array<Purpose>>>
  setItems: Dispatch<React.SetStateAction<Array<Item>>>
  setCategories: Dispatch<React.SetStateAction<Array<Category>>>
  items: Array<Item>
  fetchItems: () => Promise<void>
  fetchPurposes: () => Promise<void>
  fetchFeatures: () => Promise<void>
  selectedCategory: Category | null
  setSelectedCategory: Dispatch<React.SetStateAction<Category | null>>
  selectedItem: Item | null
  setSelectedItem: Dispatch<React.SetStateAction<Item | null>>
  selectedPurpose: Purpose | null
  setSelectedPurpose: Dispatch<React.SetStateAction<Purpose | null>>
  selectedFeature: Feature | null
  setSelectedFeature: Dispatch<React.SetStateAction<Feature | null>>
  addCategory: (payload: AddCategory) => Promise<CategoryResponseDTO>
  addFeature: (payload: AddFeature) => Promise<FeatureResponseDTO>
  addPurpose: (payload: AddPurpose) => Promise<PurposeResponseDTO>
  addItem: (payload: AddItem) => Promise<ItemResponseDTO>
  uploadItemImage: (file: File) => Promise<ItemImageUploadResponseDTO>
  deleteCategory: (id: string) => Promise<StringResponseDTO>
  deleteFeature: (id: string) => Promise<StringResponseDTO>
  deletePurpose: (id: string) => Promise<StringResponseDTO>
  deleteItem: (id: string) => Promise<StringResponseDTO>
  itemCount: number
  fetchSystemConfigs: (branchId: string) => Promise<SystemConfigsResponseDTO>
  branch: BranchData | null
  updateItem: (payload: EditItem) => Promise<ItemResponseDTO>
}

export interface RegisterParams {
  Email: string;
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  Password: string;
  Dob: string;
  RoleId: string;
}

export type Feature = {
    FeatureId: Number | string
    FeatureName: string
    Description: string
    ImagePath: string
    Active: Number
    Visible: boolean
}

export type Purpose = {
    PurposeId: Number | string
    Purpose: string
    ImagePath: string
    Description: string
    Active: Number
    Visible: boolean
}

export type Category = {
    CategoryId: Number | string
    CategoryName: string
    Description: string
    ImagePath: string
    Icon: string
    Active: Number
}

export type Branch = {
  BranchId: number
  Branch: string
  Country: CountryData
  Location: string
  PhoneNumber: string
  DateCreated: string
}

export type CategoryMin = {
    CategoryId: Number | string
    CategoryName: string
    ImagePath: string
    Icon: string
}

export type Language = {
    languageId: Number
    name: string
    code: string
}

export type Video = {
    videoLogId: Number
    title: string
    description: string
    category: Category
    language: Language
    videoFile: string
    thumbnail: string
    created_at: string
    updated_at: string
}





export type AccountInfo = {
    accountHash: string
    token: string
    accountNumber: string
    accountName: string
  }

export type MerchantDetails = {
  id: string
  applicationReference: string,
  merchantName: string,
  merchantAddress: string,
  digitalAddress: string,
  merchantContact: string,
  merchantEmail: string,
  tin: string,
  natureOfBusiness: string,
  sourceOfFunds: string,
  sourceSystem: string,
  createdDate: string,
  lastModifiedDate: string,
  dateRegistered: string,
  dateEstablished: string,
  status: string,
  tradingName: string,
  individuals: Array<MerchantIndividuals>,
  documents: Array<MerchantDocuments>,
  accounts: Array<MerchantProduct>
  subMerchants: Array<SubAccount>
}

export interface LoginParams {
  email: string;
  password: string;
}

export type StoredAuthUser = {
  userId?: string
  email?: string
  fullName?: string
  username?: string
  phoneNumber?: string
  role?: string
  userType?: string
}

export type UserData = {
  username: string | undefined
  email: string | undefined
  fullName: string | undefined
  id: string | undefined
  phoneNumber: string | undefined
  resetPassword: boolean | undefined
  role: string | undefined
  status: string | undefined
  token: string | undefined
}

export type SortCodes = {
  id: number
  code: string
  description: string
  type: string
  status: string
}

export type TransactionWrapper = {
    txns: Array<Transactions>
  }
  
  export type MerchantAccountsWrapper = {
    merchantAccounts: Array<MerchantAccounts>
  }

  export type MerchantProduct = {
    product: string
    accountNumber: string
    balance: number
    interest: number
    accountStatus: string
  }

  
  export type Transactions = {
    transactionId: string
    transactionType: string
    transactionDate: string
    taxAmount: string
    status: string
    sortCode: string
    feeAmount: string
    amount: string
    destinationAccountNumber: string
    destination: string
    currency: string
  }

  export type TransactionsM = {
    transactionId: string
    transactionType: string
    transactionDate: string
    taxAmount: string
    status: string
    sortCode: string
    feeAmount: string
    amount: string
    sourceAccountNumber: string
    source: string
    destinationAccountNumber: string
    destination: string
    currency: string
  }

  export type Statement = {
    transactionId: string
    transactionType: string
    transactionDate: string
    runningBalance: number
    description: string
    debitAmount: number
    creditAmount: number
    sourceAccountNumber: string
  }


  export type StatementResponse = {
    accountNumber: string,
    statements: Array<Statement>,
  }
  
  export type MerchantAccounts = {
    requestId: string,
    applicationReference: string,
    merchantName: string,
    merchantAddress: string,
    digitalAddress: string,
    merchantContact: string,
    merchantEmail: string,
    tin: string,
    natureOfBusiness: string,
    sourceOfFunds: string,
    sourceSystem: string,
    createdDate: string,
    lastModifiedDate: string,
    dateRegistered: string,
    dateEstablished: string,
    status: string,
    tradingName: string,
    individuals: Array<MerchantIndividuals>,
    documents: Array<MerchantDocuments>,
    accounts: Array<MerchantProducts>
  }
  
  export type MerchantIndividuals = {
    id: number,
    merchantAccountReference: string,
    individualName:string,
    individualType:string,
    idNumber:string,
    phoneNumber: string,
    email: string,
    role: string,
    status: string
  }
  
  export type MerchantProducts = {
    product: string,
    accountNumber: string,
    balance: number,
    interest: number, 
    accountStatus: string
  }
  
  export type MerchantDocuments = {
    id: number,
    documentName: string,
    extension: string,
    contentType: string
  }
  
  export type Props = {
    merchantAccountsWrapper: MerchantAccountsWrapper
    transactionsWrapper: TransactionWrapper
  }

  export type PayrollType = {
    id: string
    title: string
    customerAccountNumber: string
    totalAmount: number | undefined
    totalCharge: number | undefined
    status: string
    username: string
    comments: string
    createdDate: string
    dateProcessed: string | undefined
    chargeStatus: string | undefined
    earmarkReference: string | undefined
    taxAmount: number | undefined
    taxStatus: string | undefined
    type: string
    recipients: Array<PayrollRecipient>
  }

  export type PayrollRecipient = {
    id: string
    institution: string
    sortCode: string
    accountNumber: string
    accountName: string
    amount: number
    charge: number
    narrative: string
    status: string
    taxAmount: number | undefined
    taxStatus: string | undefined
    transactionId: string | undefined
  }

export type SubAccount = {
  firstName: string
  lastName: string
  paymentLink: string
  status: string
  phoneNumber: string
  uniqueId: string
  accountNumber: string
  createdDate: string
}

export type CreateSubAccount = {
  firstName: string
  lastName: string
  merchantReference: string
  phoneNumber: string
  uniqueId: string
}

export type CurrencyData = {
  Symbol: string
  Currency: string
}

export type CountryData = {
  Country: string
  CountryCode: string
  Currency: CurrencyData
}

export type BranchData = {
  BranchId: number
  Branch: string
  Country: CountryData
  Location: string
  PhoneNumber: string
  DateCreated: string
}

export type SystemData = {
  Branch: BranchData
}

export type SystemConfigsResponseDTO = {
  Success: boolean
  Result: SystemData | null
  StatusDesc: string
}
