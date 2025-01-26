'use client';

import { useEffect, useState, ChangeEvent, FormEvent } from 'react';

// Definição dos tipos
type User = {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone_number?: string;
  street_address?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  password: string;
};

export default function Login() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    name: '',
    surname: '',
    email: '',
    phone_number: '',
    street_address: '',
    postal_code: '',
    city: '',
    country: '',
    password: '',
  });

  // Fetch users when the page loads
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/users');
        const data: User[] = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      const newUser: User = await response.json();

      // Atualiza a lista de usuários com o novo usuário criado
      setUsers((prevUsers) => [...prevUsers, newUser]);

      // Limpa o formulário
      setFormData({
        name: '',
        surname: '',
        email: '',
        phone_number: '',
        street_address: '',
        postal_code: '',
        city: '',
        country: '',
        password: '',
      });
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  // Atualiza os valores do formulário
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div>
      <h1>Users</h1>

      {/* Lista de usuários */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} {user.surname} - {user.email}
            </li>
          ))}
        </ul>
      )}

      {/* Formulário para adicionar um novo usuário */}
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="surname"
          placeholder="Surname"
          value={formData.surname}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
        />
        <input
          type="text"
          name="street_address"
          placeholder="Street Address"
          value={formData.street_address}
          onChange={handleChange}
        />
        <input
          type="text"
          name="postal_code"
          placeholder="Postal Code"
          value={formData.postal_code}
          onChange={handleChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Add User</button>
      </form>
    </div>
  );
}
