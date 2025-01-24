'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { signIn } from 'next-auth/react';

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

  // Handle form submission using next-auth
  const tryToLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const result = await signIn('credentials', {
        redirect: false, // Prevent page redirection to the callback URL
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Redirect to dashboard or another page on success
      window.location.href = '/dashboard';
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
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
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}
