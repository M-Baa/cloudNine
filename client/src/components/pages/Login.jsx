import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice";
import OAuth from '../OAuth';

const Login = () => {
  const [formdata, setFormdata] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.user.error);

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      dispatch(signInStart());

      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(signInSuccess(data)); // Pass the user data to signInSuccess
        if (data.role === 'admin') { // Check if the user is an admin
          navigate("/dashboard"); // Redirect admin to the dashboard
        } else {
          navigate("/"); // Redirect non-admin users to the home page
        }
      } else {
        dispatch(signInFailure("Invalid credentials")); // Pass an error message
        setLoginStatus("invalidCredentials");
      }
    } catch (error) {
      console.log(error);
      dispatch(signInFailure("Login failed. Please try again later."));
      setLoginStatus("failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="register-main">

      <div className="register-right">
        <div className="register-right-container">
          <div className="register-logo">
            {/* <img src={Logo} alt="" /> */}
          </div>
          <div className="register-center">
            <h2>Welcome to our website!</h2>
            <p>Please enter your details</p>
            <form onSubmit={handleSubmit}>
              {/* <input id='username' onChange={handleChange} type="text" placeholder="Username" name="Username" required={true} /> */}
              {/* <input type="text" placeholder="Lastname" name="lastname" required={true} /> */}
              <input onChange={handleChange} id='email' type="email" placeholder="Email" name="email" required={true} />
              <div className="pass-input-div">
                <input type='password'
                  placeholder='Password'
                  id='password'
                  onChange={handleChange} />

              </div>
              <div className="pass-input-div">


              </div>
              <div className="register-center-buttons">
                <button type="submit">Sign Up</button>
                <button disabled={loading} type="submit">{loading ? 'Signing Up...' : 'Sign Up'}
                  {/* <img src={GoogleSvg} alt="" /> */}
                  Sign Up with Google
                  <OAuth />
                </button>
              </div>
            </form>
          </div>
          {loginStatus === 'success' && (
            <p className='text-green-500'>Login successful!</p>
          )}
          {loginStatus === 'invalidCredentials' && (
            <p className='text-red-500'>Invalid email or password. Please try again.</p>
          )}
          {loginStatus === 'failed' && (
            <p className='text-red-500'>Login failed. Please try again later.</p>
          )}
          <p className="login-bottom-p">
            Already have an account? <Link to='/signup'>Login</Link>
          </p>
        </div>
      </div>
    </div>








  );
};

export default Login;
