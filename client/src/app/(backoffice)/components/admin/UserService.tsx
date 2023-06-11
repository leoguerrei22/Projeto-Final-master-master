import React, { useState, useEffect } from 'react'; 
import apiService from '@/services/api';
import axios from 'axios';

type User = {
  id: number;
  name: string;
  email: string;
  password?: string; // password é agora opcional
  phone?: string;
  role: number;
  deleted: boolean;
};

const initialUserState: User = {
  id: 0,
  name: "",
  email: "",
  phone: "",
  role: 1,
  deleted: false,
};

const UserService: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserRow, setSelectedUserRow] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<User>(initialUserState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getAll('user');
        const usersWithoutPassword = response.map((user: User) => {
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        });
        setUsers(usersWithoutPassword);
        setError(null);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editUser) {
      let value: string | number | boolean;
      if (e.target.name === 'role') {
        value = Number(e.target.value);
      } else if (e.target.name === 'deleted') {
        value = e.target.checked;
      } else {
        value = e.target.value;
      }
      setEditUser({
        ...editUser,
        [e.target.name]: value,
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/user/register', {
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        phone: user.phone,
      });
      setUsers([...users, response.data]);
      setUser(initialUserState);
      setShowForm(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (selectedUser) {
        const updatedUser = { ...selectedUser };
        if (updatedUser.password === "") {
          delete updatedUser.password;
        }
        const response = await apiService.update('user', selectedUser.id, updatedUser);
        const updatedUsers = users.map((u) => u.id === selectedUser.id ? response : u);
        setUsers(updatedUsers);
        setSelectedUser(null);
        setIsUpdateMode(false);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnterPress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = event.target.value.toLowerCase();
    setSearchTerm(searchText);

    if (searchText === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) => {
        return Object.values(user).some((value) =>
          value.toString().toLowerCase().includes(searchText)
        );
      });
      setFilteredUsers(filtered);
    }
  };

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const handleExpand = (user: User) => {
    if (selectedUserRow && selectedUserRow.id === user.id) {
      setSelectedUserRow(null);
    } else {
      setSelectedUserRow(user);
    }
  };

  const handleDelete = async (user: User) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      const updatedUser = {
        ...user,
        deleted: true
      };
      const response = await apiService.update('user', user.id, updatedUser);
      const updatedUsers = users.map((u) => u.id === user.id ? response : u);
      setUsers(updatedUsers);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditUser(user);
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>, id: number) => {
    e.preventDefault();
    if (editUser) {
      setIsLoading(true);
      try {
        const response = await apiService.update('user', id, editUser);
        const updatedUsers = users.map((u) => u.id === id ? response : u);
        setUsers(updatedUsers);
        setEditUser(null); // reset 'editUser' after update
        setSelectedUser(null); // reset 'selectedUser' after update
        setIsUpdateMode(false); // leave update mode
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // restante do seu código...


  return (
    <div className="flex flex-col items-start justify-start w-full h-full">
      <button onClick={() => setShowForm(!showForm)} className="mb-3 p-2 bg-indigo-500 text-white rounded">
        {showForm ? 'Close form' : 'Create new user'}
      </button>
  
      {showForm && !isUpdateMode && (
        <form className="mb-4 w-full" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name">Nome:</label>
            <input
              id="name"
              name="name"
              type="text"
              value={user.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="text"
              value={user.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone">Telefone:</label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={user.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              name="password"
              type="password"
              value={user.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role">Role:</label>
            <input
              id="role"
              name="role"
              type="number"
              value={user.role}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="deleted">Deleted:</label>
            <input
              id="deleted"
              name="deleted"
              type="checkbox"
              checked={user.deleted}
              onChange={(e) => setUser({ ...user, deleted: e.target.checked })}
            />
          </div>
          <button type="submit" className="p-2 bg-green-500 text-white rounded">Submit</button>
        </form>
      )}
  
      <div className="flex flex-row items-center justify-start w-full mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleEnterPress}
          className="p-2 border rounded w-full mr-3"
        />
        <button className="p-2 bg-blue-500 text-white rounded">Search</button>
      </div>
  
      <div className="w-full overflow-auto h-full">
        <table className="table-fixed w-full">
          <thead>
            <tr>
              <th className="w-1/6 text-left">Nome</th>
              <th className="w-1/6 text-left">Email</th>
              <th className="w-1/6 text-left">Telefone</th>
              <th className="w-1/6 text-left">Role</th>
              <th className="w-1/6 text-left">Deleted</th>
              <th className="w-1/6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
          {filteredUsers.map((user, index) => (
      <tr key={index}>
    {selectedUser === user ? (
  <td colSpan={6}>
    <form onSubmit={(e) => handleUpdate(e, user.id)}>
      {/* Campos do formulário de edição */}
      <label htmlFor="editName">Name:</label>
      <input
        id="editName"
        name="name"
        type="text"
        value={editUser?.name || ""}
        onChange={handleEditInputChange}
      />

      <label htmlFor="editEmail">Email:</label>
      <input
 id="editEmail"
 name="email"
 type="text"
 value={editUser?.email || ""}
 onChange={handleEditInputChange}
      />

      <label htmlFor="editPhone">Phone:</label>
      <input
  id="editPhone"
  name="phone"
  type="text"
  value={editUser?.phone || ""}
  onChange={handleEditInputChange}
      />

      <label htmlFor="editRole">Role:</label>
      <input
  id="editRole"
  name="role"
  type="number"
  value={Number(editUser?.role) || ""}
  onChange={handleEditInputChange}
      />

      <label htmlFor="editDeleted">Deleted:</label>
      <input
  id="editDeleted"
  name="deleted"
  type="checkbox"
  checked={editUser?.deleted || false}
  onChange={handleEditInputChange}
      />

      <div>
        <button type="submit" className="p-2 bg-green-500 text-white rounded">Save</button>
        <button type="button" onClick={() => setSelectedUser(null)} className="p-2 bg-gray-500 text-white rounded">Cancel</button>
      </div>
        </form>
      </td>
    ) : (
      <>
        <td className="break-words">{user.name}</td>
        <td className="break-words">{user.email}</td>
        <td className="break-words">{user.phone}</td>
        <td>{user.role}</td>
        <td>{user.deleted ? 'Deleted' : 'Active'}</td>
        <td>
          <button onClick={() => handleEdit(user)} className="mr-3 p-2 bg-yellow-500 text-white rounded">Edit</button>
          <button onClick={() => handleDelete(user)} className="p-2 bg-red-500 text-white rounded">Delete</button>
        </td>
      </>
    )}
  </tr>
))}

          </tbody>
        </table>
      </div>
  
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
  
}  

export default UserService;
