'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';

// Definição dos tipos
type LoginData = {
  email: string;
  password: string;
};

export default function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [formData, setFormData] = useState<Omit<LoginData, 'id'>>({
    email: '',
    password: ''
  });

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');

    if (token) {
      window.location.href = '/dashboard';
    }
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
  
      if (!response.ok) {
        throw new Error('Failed to login');
      }
  
      // Create new session using session storage
      const data = await response.json();

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
    <div>
      <form onSubmit={tryToLogin}>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Log in</button>
      </form>

      {loading && <p>Loading...</p>}
      <h2>{errorMessage}</h2>
    </div>
  );
}

