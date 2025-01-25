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


          <label htmlFor="email">Email address</label>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
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

