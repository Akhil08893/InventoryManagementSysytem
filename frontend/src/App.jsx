import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from './components/Table';
import TodoForm from './components/TodoForm';
// Rename TodoForm to ItemForm

function App() {
  const [items, setItems] = useState([]); // Change todos to items
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem('token') || "");
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || "");

  useEffect(() => {
    if (token) {
      fetchData();
      setIsLoggedIn(true);
    }
  }, [token]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/items/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(response.data); // Update todos to items
      setIsLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        await refreshToken1();
      } else {
        console.log(error);
      }
    }
  };

  const refreshToken1 = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
        refresh: refreshToken,
      });
      const newAccessToken = response.data.access;
      localStorage.setItem("token", newAccessToken);
      setToken(newAccessToken);
      fetchData();
    } catch (error) {
      console.log("Refresh token failed", error);
      handleLogout();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        username,
        password,
      });
      const accessToken = response.data.access;
      const refreshToken = response.data.refresh;
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setToken(accessToken);
      setRefreshToken(refreshToken);
      setIsLoggedIn(true);
    } catch (error) {
      console.log('Login failed', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken("");
    setRefreshToken("");
    setIsLoggedIn(false);
    setItems([]); // Clear items on logout
  };

  return (
    <div className='bg-indigo-100 px-8 min-h-screen flex flex-col items-center'>
      <nav className='pt-8'>
        <h1 className='text-6xl text-center pb-6 text-indigo-700 font-bold'>Inventory Management System</h1>
      </nav>

      {!isLoggedIn ? (
        <div className="flex-grow flex justify-center items-center w-full">
          <form onSubmit={handleLogin} className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">Login</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="w-full">
          <TodoForm setItems={setItems} fetchData={fetchData} /> {/* Update to use ItemForm */}
          <Table items={items} setItems={setItems} isLoading={isLoading} fetchData={fetchData} /> {/* Update to use items */}
          <button onClick={handleLogout} className="mt-8 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
