import logo from './logo.svg';
import './App.css';


import { Routes, Route } from 'react-router-dom'
import Home from './components/pages/Home';
import About from './components/pages/About';
import Login from './components/pages/Login';
import Signup from './components/pages/Signup';
import Profile from './components/pages/Profile';
import Dashboard from './components/pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/dashboard' element={<Dashboard />} /> {/* Add this line for the dashboard route */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
