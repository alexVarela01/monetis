'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import { ClipLoader } from 'react-spinners';
import "./styles.css";
import logoImage from './../../public/Logo.png'

// Definição dos tipos
type RegisterData = {
  name: string,
  surname: string,
  email: string,
  phone_number: number,
  street_address: string,
  postal_code: string,
  city: string,
  state: string,
  country: string,
  password: string,
  confirmPassword: string,
};

export default function Register() {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [formData, setFormData] = useState<Omit<RegisterData, 'id'>>({
    name: '',
    surname: '',
    email: '',
    phone_number: 0,

    street_address: '',
    postal_code: '',
    city: '',
    state: '',
    country: '',

    password: '',
    confirmPassword: '',
  });

  // Handle user already logged in
  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      window.location.href = '/dashboard';
    }
  }, []);

  // Handle form submission
  const tryToRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  

  
      // Create new session using session storage
      const data = await response.json();

      if (response.status !== 200) {
        const errMessage = response.status === 401 ? data.error : "Unexpected error, please try again later!"; 
        throw new Error(errMessage);
      }

      // Create new session using session storage
      sessionStorage.setItem('authToken', data.token);
      sessionStorage.setItem('userEmail', formData.email);
      sessionStorage.setItem('userName', data.userName);
      
      // redirects to dashboard
      window.location.href = '/dashboard';
    } catch (error: unknown) {
      // Cast the error to Error
      if (error instanceof Error) {
        setErrorMessage(error.message); // Log the error message if needed
      } else {
        setErrorMessage('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  // Atualiza os valores do formulário
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className='registerContainer'>

      <Image src={logoImage} alt="Register" className='logo'></Image>

      <div className='register'>

        <h2>Create an account</h2>
        <form onSubmit={tryToRegister}>
        <hr />

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
                type="text"
                name="email"
                placeholder="Email"
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
                placeholder="Phone number"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </div>
          </div>

          <h3>Address information</h3>
          <div className='row'>
            <div className='column required' style={{flex: '0.7'}}>
              <label htmlFor="street_address">Street address</label>
              <input
                type="text"
                name="street_address"
                placeholder="Street address"
                value={formData.street_address}
                onChange={handleChange}
                required
              />
            </div>
            <div className='column' style={{flex: '0.3'}}>
              <label htmlFor="postal_code">Postal code</label>
              <input
                type="text"
                name="postal_code"
                placeholder="Postal code"
                value={formData.postal_code}
                onChange={handleChange}
              />
            </div>
          </div>


          <div className='row'>
           <div className='column' style={{width:'calc(35% - 20px)'}}>
              <label htmlFor="city">City</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div className='column' style={{width:'calc(35% - 20px)'}}>
              <label htmlFor="state">State</label>
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
            <div className='column' style={{width:'calc(30% - 20px)'}}>
              <label htmlFor="country">Country</label>
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
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
          
          <button type="submit" disabled={loading}>
            {loading ? <ClipLoader color="#fff" size={11}/> : 'Sign up'}
          </button>

          <a className='signUp' href="/login">Already have an account? Sign in!</a>
          <p className='error'>{errorMessage}</p>
        </form>
      </div>

      <div className='info'>
        <Image src="/register.svg" alt="Register" width={500} height={300}></Image>
        <h2>Fill out the form to get started</h2>
        <p>Start managing your finances today with our easy-to-use platform.</p>
      </div>
    </div>
  );
}

