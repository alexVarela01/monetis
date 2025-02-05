'use client';

import { useAuth } from '@/app/hooks/useAuth';
import Navigation from '@/app/Components/Navigation/Navigation';
import './styles.css';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { ClipLoader, GridLoader } from 'react-spinners';
import StaticLoader from '../Components/StaticLoader/StaticLoader';
import CountrySelector from '../Components/CountrySelector/CountrySelector';
import { RiUserSettingsLine, RiLockPasswordLine, RiDeleteBin7Line } from "react-icons/ri";
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface UserData {
  id: number;
  name: string,
  surname: string,
  email: string,
  phone_number?: string,
  street_address: string,
  postal_code: string,
  city: string,
  country: string
  confirmPassword: string
}

interface ChangePassword {
  oldPassword: string,
  newPassword: string,
  confirmNewPassword: string
}

interface DeleteAccount {
  confirmDeletePassword: string
}

export default function Settings() {
  useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState("");
  const [userData, setUserData] = useState<Omit<UserData, 'id'>>({
    name: '',
    surname: '',
    email: '',

    phone_number: '',

    street_address: '',
    postal_code: '',
    city: '',
    country: '',
    confirmPassword: ''
  });

  const [passwordData, setPasswordData] = useState<Omit<ChangePassword, 'id'>>({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [deleteAccountData, setDeleteAccountData] = useState<Omit<DeleteAccount, 'id'>>({
    confirmDeletePassword: ''
  });

  useEffect(() => {
    document.title = 'Monetis | Settings';
    setCurrentTab("settings");
      
    setLoading(true);
    setIsClient(true);
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const response = await fetch(`/api/users/userData`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const accountData = await response.json();
      const tempUserData = accountData.user;
      tempUserData.confirmPassword = '';
      setUserData(tempUserData);
      setPasswordData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // check if the value is a number
    if (isNaN(Number(value))) return;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  }

  const updateSettings = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingAction(true);
    sendRequest('/api/users/updateSettings', userData, "Settings updated!");
  };

  const updatePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingAction(true);
    sendRequest('/api/users/updatePassword', passwordData, "Password changed!", true);
  };

  const deleteAccount = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingAction(true);
    sendRequest('/api/users/deleteAccount', deleteAccountData, "Account deleted", true);
  };

  async function sendRequest(url: string, data: object, successMessage: string, logout?: boolean) {
    try {
      const requestResponse = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const requestData = await requestResponse.json();
      if (requestResponse.status !== 200) {
        toast.dismiss();
        for (const error of requestData.errors) {
          toast.error(error, {
            position: "bottom-right",
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "light",
          });
        }

        return;
      }

      if(!logout){
        await fetchSettings(); 
        toast.dismiss();
        toast.success(successMessage, {
          position: "bottom-right",
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
      }


      if(logout){
        fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
        .then((response) => response.json())
        .then(() => {
          router.push('/login');
        })
      }

    } catch (error: unknown) {
      console.error('An unexpected error happened:', error);
    } finally {
      setLoadingAction(false);
    }
  }

  return (
    <div className='settings'>
      <Navigation />

      <div className='content'>
        <h1>Settings</h1>

        <div className='tabs'>
          <div onClick={() => setCurrentTab('settings')} className={currentTab === 'settings' ? 'active' : ''}>
            <RiUserSettingsLine />
            <span>Personal information</span>
          </div>
          <div onClick={() => setCurrentTab('password')} className={currentTab === 'password' ? 'active' : ''}>
            <RiLockPasswordLine />
            <span>Change Password</span>
          </div>
          <div onClick={() => setCurrentTab('deleteAccount')} className={currentTab === 'deleteAccount' ? 'active' : ''}>
            <RiDeleteBin7Line />
            <span>Delete account</span>
          </div>
        </div>

        {currentTab === 'settings' && (
          <form onSubmit={updateSettings} autoComplete="off">
            <hr/>
            <h3>User information</h3>
    
            <div className='row'>
              <div className='column required'>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  maxLength={20}
                  placeholder="John"
                  value={userData?.name}
                  onChange={handleChange}
                  required
                />
              </div>
    
              <div className='column required'>
                <label htmlFor="surname">Surname</label>
                <input
                  type="text"
                  name="surname"
                  maxLength={20}
                  placeholder="Doe"
                  value={userData?.surname}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
    
            <div className='row'>
              <div className='column required'>
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  name="email"
                  maxLength={50}
                  placeholder="johndoe@me.com"
                  value={userData?.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='column'>
                <label htmlFor="phone_number">Phone number</label>
                <input
                  type="text"
                  name="phone_number"
                  placeholder="123456789"
                  value={userData?.phone_number}
                  onChange={handlePhoneChange}
                />
              </div>
            </div>
    
            <h3>Address information</h3>
            <div className='row'>
              <div className='column required' style={{ flex: '0.7' }}>
                <label htmlFor="street_address">Street address</label>
                <input
                  type="text"
                  name="street_address"
                  maxLength={50}
                  placeholder="Sttr. Example, 123"
                  value={userData?.street_address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='column required' style={{ flex: '0.3' }}>
                <label htmlFor="postal_code">Postal code</label>
                <input
                  type="text"
                  name="postal_code"
                  maxLength={20}
                  placeholder="12345-678"
                  value={userData?.postal_code}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
    
    
            <div className='row'>
              <div className='column required'>
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="London"
                  maxLength={20}
                  value={userData?.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='column required disabled'>
                <label htmlFor="country">Country</label>
                <CountrySelector
                  required
                  value={userData?.country}
                  onChange={() => {}}
                />
              </div>
            </div>
    
            <h3>Security information</h3>
            <div className='row'>
              <div className='column required'>
                <label htmlFor="confirmPassword">Confirm your password to make changes</label>
                <input
                  type="password"
                  name="confirmPassword"
                  autoComplete='OFF'
                  value={userData?.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
    
            <button type="submit" disabled={loadingAction}>
              {loadingAction ? <ClipLoader color="#fff" size={11} /> : 'Save settings'}
            </button>
          </form>
        )}

        {currentTab === 'password' && (
          <form onSubmit={updatePassword} autoComplete="off">
            <hr/>
            <h3>Security information</h3>
            <div className='row'>
              <div className='column required'>
                <label htmlFor="confirmPassword">Current password</label>
                <input
                  type="password"
                  name="oldPassword"
                  autoComplete='new-password'
                  value={passwordData?.oldPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
            </div>

            <div className='row'>
            <div className='column required'>
                <label htmlFor="confirmPassword">New password</label>
                <input
                  type="password"
                  name="newPassword"
                  autoComplete='new-password'
                  value={passwordData?.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className='column required'>
                <label htmlFor="confirmPassword">Confirm password</label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  autoComplete='new-password'
                  value={passwordData?.confirmNewPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
            </div>
            <span className='helpText'>Password must be 8+ characters with a letter, number, and one special character: @$!%*?&+=#^()-</span>
            <span className='helpText'>After changing your password, you will be logged out!</span>
    
            <button type="submit" disabled={loadingAction}>
              {loadingAction ? <ClipLoader color="#fff" size={11} /> : 'Update password'}
            </button>
          </form>
        )}

        {currentTab === 'deleteAccount' && (
          <form onSubmit={deleteAccount} autoComplete="off">
            <hr/>
            <h3>Delete account</h3>
            <div className='row'>
              <div className='column required'>
                <label htmlFor="confirmDeletePassword">Confirm password</label>
                <input
                  type="password"
                  name="confirmDeletePassword"
                  autoComplete='new-password'
                  value={deleteAccountData?.confirmDeletePassword}
                  onChange={(e) => {setDeleteAccountData((prevData) => ({ ...prevData, confirmDeletePassword: e.target.value }));}}
                  required
                />
              </div>
            </div>

            <span className='helpText'>This action is irreversible. After deleting your account, you will be logged out! Type your password to confirm deletion</span>
    
            <button type="submit" disabled={loadingAction} className='delete'>
              {loadingAction ? <ClipLoader color="#fff" size={11} /> : 'Confirm delete'}
            </button>
          </form>
        )}
      </div>
      <div className={`loading_screen ${!loading ? "hidden" : ""}`}>
        {isClient ? (
          <GridLoader color="#4d8bf7" size={10} />
        ) : (
          <StaticLoader/>
        )}
      </div>

      <ToastContainer/>
    </div>
  );
}
