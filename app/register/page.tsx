'use client';

import CountrySelector from '../Components/CountrySelector/CountrySelector';
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ClipLoader } from 'react-spinners';
import "./styles.css";
import logoImage from '@/public/Logo.png'
import { ToastContainer, toast } from 'react-toastify';
import { SingleValue } from 'react-select';

interface CountryOption {
  label: string;
  value: string;
}

// Definição dos tipos
type RegisterData = {
  name: string,
  surname: string,
  email: string,
  phone_number?: string,
  street_address: string,
  postal_code: string,
  city: string,
  country: string,
  password: string,
  confirmPassword: string,
};

export default function Register() {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Omit<RegisterData, 'id'>>({
    name: '',
    surname: '',
    email: '',

    phone_number: '',

    street_address: '',
    postal_code: '',
    city: '',
    country: '',

    password: '',
    confirmPassword: '',
  });

  // Handle user already logged in
  useEffect(() => {
    document.title = 'Monetis | Register';
    fetch('/api/auth/me', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.authenticated) {
        window.location.href = '/dashboard';
      }
    })
  }, []);
  // Handle form submission
  const tryToRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const registerResponse = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // Create new session using session storage
      const registerData = await registerResponse.json();

      if (registerResponse.status !== 200) {
        toast.dismiss();
        for (const error of registerData.errors) {
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

      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // Create new session using session storage
      const loginData = await loginResponse.json();

      if (loginResponse.status !== 200) {
        const errMessage = loginResponse.status === 401 ? loginData.error : "Unexpected error, please try again later!";
        throw new Error(errMessage);
      }

      // redirects to dashboard
      window.location.href = '/dashboard';
    } catch (error: unknown) {
      console.error('An unexpected error happened:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // check if the value is a number
    if (isNaN(Number(value))) return;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  const setSelectedCountry = (country: SingleValue<CountryOption>) => {
    setFormData((prevData) => ({
      ...prevData,
      country: country ? country.value : '', // Ensure that country is not null
    }));
  };

  return (
    <div className='registerContainer'>

      <Link href="/" className='logo'><Image src={logoImage} alt="Register"></Image></Link>

      <div className='register'>

        <h2>Create an account</h2>
        <form onSubmit={tryToRegister}>
          <h3>User information</h3>

          <div className='row'>
            <div className='column required'>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                placeholder="John"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className='column required'>
              <label htmlFor="surname">Surname</label>
              <input
                type="text"
                name="surname"
                placeholder="Doe"
                value={formData.surname}
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
                placeholder="johndoe@me.com"
                value={formData.email}
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
                value={formData.phone_number}
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
                placeholder="Sttr. Example, 123"
                value={formData.street_address}
                onChange={handleChange}
                required
              />
            </div>
            <div className='column required' style={{ flex: '0.3' }}>
              <label htmlFor="postal_code">Postal code</label>
              <input
                type="text"
                name="postal_code"
                placeholder="12345-678"
                value={formData.postal_code}
                onChange={handleChange}
                required
              />
            </div>
          </div>


          <div className='row'>
            <div className='column required' style={{ width: 'calc(35% - 20px)' }}>
              <label htmlFor="city">City</label>
              <input
                type="text"
                name="city"
                placeholder="London"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className='column required' style={{ width: 'calc(30% - 20px)' }}>
              <label htmlFor="country">Country</label>
              <CountrySelector
                required
                value={formData.country}
                onChange={(country) => setSelectedCountry(country)}
              />
            </div>
          </div>

          <h3>Security information</h3>
          <div className='row'>
            <div className='column required'>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className='column required'>
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <span className='helpText'>Password must be 8+ characters with a letter, number, and one special character: @$!%*?&+=#^()-</span>

          <hr />
          <span className='helpText'>By clicking &quot;Sign up&quot; you agree to our <a href="/terms">Terms of Service</a></span>
          
          <button type="submit" disabled={loading}>
            {loading ? <ClipLoader color="#fff" size={11} /> : 'Sign up'}
          </button>

          <a className='signUp' href="/login">Already have an account? Sign in!</a>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
}

