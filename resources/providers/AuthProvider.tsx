import React, { type ReactNode, useEffect, useContext, useState, useRef } from 'react';
import AuthContext from './AuthContext';
// @ts-ignore
import Api from '../apis';
// import { jwtDecode } from 'jwt-decode';
import ApplicationContext from './ApplicationContext';
import type { UserData } from '../types/applicationTypes';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState<UserData | undefined| null>(null);
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [startTimer, setStartTimer] = useState(false)
    // const [role, setRole] = useState("")

    const applicationContext = useContext(ApplicationContext)

    const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(()=>{
      console.log("Logged in value is "+isLoggedIn)
      if(isLoggedIn == true){
        console.log("about to get stuff")
        
        // applicationContext!.getMerchantAccountsData()

        const username = sessionStorage.getItem("username");
        const password = sessionStorage.getItem("password")
        loginMethod_(undefined, username ?? "", password ?? "", "SESSION")
      }
  },[isLoggedIn])

  useEffect(()=>{
    console.log("About to start timer "+startTimer)
    if(isLoggedIn == true){
      console.log("Timer starting...")
      const username = sessionStorage.getItem("username");
      const password = sessionStorage.getItem("password")
      intervalIdRef.current = setInterval(()=>loginMethod_(undefined, username ?? "", password ?? "", "SESSION"), 300000);
      console.log("Timer started")

      // Clear the interval when the component unmounts
      return () => {
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
        }
      };
    }

  },[startTimer])

  // Function to clear the interval manually
  const clearTimer = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null; // Clear the reference
      console.log('Interval cleared manually');
    }
  };

  // interface JwtPayload {
  //   exp?: number; // Expiry time in seconds since the epoch
  // }

  // const isTokenExpired = (token: string): boolean => {
  //   try {
  //     const { exp } = jwtDecode<JwtPayload>(token);
  //     if (!exp) {
  //       return true;
  //     }
  //     return Date.now() >= exp * 1000;
  //   } catch (error) {
  //     return true;
  //   }
  // }

    const changeLoginStatus = () => {
        console.log("About to set login status "+isLoggedIn)
        updateIsLoggedInFunc(!isLoggedIn)
        setStartTimer(!startTimer)
    }
  
    const loginMethod_ = async (e: React.FormEvent<HTMLFormElement> | undefined, username: string, password: string, type_: string)=>{
        console.log("Login method is ")
        console.log(loading)
        setLoading(true)
        const loginResp = await loginMethod(e, username, password, type_)
        setLoading(false)

        console.log("Response from login method is ")
        console.log(loginResp)

        return loginResp
    }

    // Login Method
  const loginMethod = async (e: React.FormEvent<HTMLFormElement> | undefined, username: string, password: string, type_: string) => {
    e != undefined ? e.preventDefault() : ''

    console.log("Submit")

    let resp = "FAILED"

    if(type_=="LOGIN"){
      sessionStorage.clear()
      applicationContext!.clearAll()
    }

    const params = {
        username: username,
        password: password,
    }

    await new Api().POST_(params, username).then((response: any)=>{
        console.log("Login response: ")
        console.log(response)
        console.log(response.status)

        if(response && typeof response === 'object' && 'status' in response && (response.status == 200 || response.status == 204)){
            // setSuccessStatus('success')
            if(response.data.isSuccess == true){
                sessionStorage.setItem("email", response.data.result.email);
                sessionStorage.setItem("partnerId", response.data.result.id);
                sessionStorage.setItem("partnerName", response.data.result.username);
                sessionStorage.setItem("phoneNumber", response.data.result.phoneNumber);
                sessionStorage.setItem("username", response.data.result.username);
                sessionStorage.setItem("role", response.data.result.role);
                sessionStorage.setItem("token", response.data.result.token);
                sessionStorage.setItem("merchantReference", response.data.result.merchantReference);
                

                sessionStorage.setItem("password", password);

                // Hash pin and store
                sessionStorage.setItem("pin", response.data.result.password);

                resp = "SUCCESS"

                console.log("Type is "+type_+" and is logged in is "+isLoggedIn)

                if(type_ == "LOGIN" || (type_ == "SESSION" && !isLoggedIn)){
                  console.log("About to trigger login status change")
                  // applicationContext!.getMerchantDetails()
                  changeLoginStatus()
                }

                setUser(response.data.result);

                
                // setRepassword('')
                // setEmail('')

                // e.target.submit()

                // form_.current?.submit()

                // window.location.replace("/");

            } else {

                resp = response.data.displayMessage
            }
            

           console.log("Successfully added request")
        } else {
          resp = "Invalid credentials provided"
        }
    }).catch((error: any) => {
        resp = "Login Failed due to an internal processing error. Please try again"
        console.log("Error returned is ... ")
        console.log(error)
    })

    return resp
}

const updateIsLoggedInFunc = (newState: boolean) => {
  setIsLoggedIn(newState)
}

const forgotPassword = async (username: string) => {
  let resp = false

  console.log("About to send email to "+username)

  const params = {
    username: username
  }

  const response = await new Api().POST_(params)

  console.log("Response is ...")
  console.log(response)

  if(response && typeof response === 'object' && 'status' in response && (response.status == 200)){
    if(response.data.isSuccess == true){
      console.log("Success response")
      resp = true
    } else {
      console.log("Failed response")
      resp = false
      
    }
  } else {
    resp = false
  }

  // navigate('/')
  return resp
}

const resendOTP = async (mobileNumber: string) => {
  let resp = false

  console.log("About to resend OTP to "+mobileNumber)

  const params = {
    mobileNumber: mobileNumber
  }

  const response = await new Api().POST_(params)

  console.log("Resend OTP Response is ...")
  console.log(response)

  if(response && typeof response === 'object' && 'status' in response && (response.status == 200)){
    if(response.data.isSuccess == true){
      console.log("Success response")
      resp = true
    } else {
      console.log("Failed response")
      resp = false
      
    }
  } else {
    resp = false
  }

  // navigate('/')
  return resp
}

const validateOTP = async (value: string, mobileNumber: string) => {
let resp = false

console.log("About to go validate OTP "+value+" for mobile number "+mobileNumber)
const params = {
  otp: value,
  mobileNumber: mobileNumber
}
await new Api().POST_(params).then((response: any)=>{
    console.log("Response is ...")
    console.log(response)

    if(response.status==200){
      if(response.data.isSuccess == true){
        console.log("Success response")

        resp = true
        setSuccessMessage(response.data.displayMessage)

        
      } else {
        console.log("Failed response")

        setErrorMessage(response.data.displayMessage)
      }
    } else {
      console.log("response has an error")
      setErrorMessage("An error occurred. "+response.data)
    }
}).catch((error: any) => {
    console.log("Error returned is ... ")
    console.log(error)
    setErrorMessage("Something went wrong")
})

// navigate('/')
console.log("Returning OTP validation response as "+resp)
return resp
}

    const setLoadingFunc = (value: boolean) =>{
      setLoading(value)
    }

    const logout = () => {
      sessionStorage.clear()
      applicationContext!.clearAll()
      changeLoginStatus()
      clearTimer()
    };
  
    return (
      <AuthContext.Provider value={
        { 
            user, 
            loginMethod_, 
            logout, 
            loading, 
            username, 
            password, 
            errorMessage, 
            changeLoginStatus,
            isLoggedIn,
            updateIsLoggedInFunc,
            resendOTP,
            validateOTP,
            setLoadingFunc,
            successMessage,
            setUsername,
            setPassword,
            forgotPassword
        }}>
        {children}
      </AuthContext.Provider>
    );
  };

//   export const useAuth = (): AuthContextProps => {
//     const context = useContext(ThemeContext);
//     if (context === undefined) {
//       throw new Error('useTheme must be used within a ThemeProvider');
//     }
//     return context;
//   };