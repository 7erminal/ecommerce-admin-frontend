import type { Dispatch } from "react"

export type AuthContextProps = {
  user: UserData | null | undefined
  loginMethod_: (e: React.FormEvent<HTMLFormElement> | undefined, username: string, password: string, type_: string) => Promise<string>
  logout: ()=>void
  loading: boolean
  errorMessage: string
  username: string
  password: string
  changeLoginStatus: ()=>void
  updateIsLoggedInFunc: (newState: boolean)=>void
  isLoggedIn: boolean
  resendOTP: (mobileNumber: string) => Promise<boolean>
  validateOTP: (value: string, mobileNumber: string) => Promise<boolean>
  setLoadingFunc: (value: boolean) => void,
  successMessage: string,
  setUsername: Dispatch<React.SetStateAction<string>>,
  setPassword: Dispatch<React.SetStateAction<string>>,
  forgotPassword: (username: string) => Promise<boolean>
}

export type ApplicationContextProps = {
  clearAll: ()=>void
  loading: boolean
  setLoading: Dispatch<React.SetStateAction<boolean>>
  courses: Array<Video>
  categories: Array<Category>
  languages: Array<Language>
  getCourses: (languageId?: string | null | undefined, categoryId?: string | null | undefined) => Promise<void>
  fetchCategories: () => Promise<void>
  fetchLanguages: () => Promise<void>
  activeMenuItem: string
  setActiveMenu: (menuItem: string) => void

}

export type Category = {
    categoryId: Number
    name: string
    description: string
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
