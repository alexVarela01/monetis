'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ClipLoader } from 'react-spinners';
import "./styles.css";
import logoImage from '@/public/Logo.png'
import { ToastContainer, toast } from 'react-toastify';

// Definição dos tipos
type LoginData = {
  email: string;
  password: string;
};

export default function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Omit<LoginData, 'id'>>({
    email: '',
    password: ''
  });

  useEffect(() => {
    document.title = 'MONETIS | Login';
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
  const tryToLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await fetch('/api/auth/login', {
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

      // redirects to dashboard
      window.location.href = '/dashboard';
    } catch (error: unknown) {
      
      let errorMessage = 'An unknown error occurred';
      // Cast the error to Error
      if (error instanceof Error) {
        errorMessage = error.message; // Log the error message if needed
      } 

      toast.dismiss();
      toast.error(errorMessage, {
        position: "bottom-left",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
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
    <div className='loginContainer'>

      <Link href="/" className='logo'><Image src={logoImage} alt="Register"></Image></Link>

      <div className='login'>

        <h2>Log in</h2>
        <form onSubmit={tryToLogin}>
          <label htmlFor="email">Email address</label>
          <div className="row">
            <input
              type="text"
              name="email"
              style={{ flex: '1' }}
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <label htmlFor="password">Password</label>
            <div className="row" > 
              <input
                type="password"
                style={{ flex: '1' }}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          <button type="submit" disabled={loading}>
            {loading ? <ClipLoader color="#fff" size={11}/> : 'Log in'}
          </button>

          <a className='signUp' href="/register">Don&apos;t have an account? Sign up today!</a>
        </form>
      </div>

      <div className='info'>
        <Image src="/login.svg" alt="Login" width={500} height={300}></Image>
        <h2>MONETIS, Seamless Banking, Anytime, Anywhere.</h2>
        <p>Manage your finances with ease. Accounts, savings and more, all in one place.</p>
      </div>

      <ToastContainer />
    </div>
  );
}

