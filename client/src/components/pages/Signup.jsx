import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import OAuth from '../OAuth';

const Signup = () => {
  const [formdata, setFormdata] = useState({});
  const [loading, setLoading] = useState(false);
  const [signupStatus, setSignupStatus] = useState(null);

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formdata),
      });

      const data = await res.json();

      if (res.ok) {
        // Successful signup
        setSignupStatus('success');
      } else {
        // Unsuccessful signup
        if (data.error === 'Email already registered') {
          setSignupStatus('emailExists');
        } else {
          setSignupStatus('failed');
        }
      }
    } catch (error) {
      console.log(error);
      setSignupStatus('failed');
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

            <form onSubmit={handleSubmit}>
              <input id='username' onChange={handleChange} type="text" placeholder="Username" name="Username" required={true} />
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
          {signupStatus === 'success' && (
            <p className='text-green-500'>User added successfully!</p>
          )}
          {signupStatus === 'emailExists' && (
            <p className='text-red-500'>Email already exists. Please use a different email.</p>
          )}
          {signupStatus === 'failed' && (
            <p className='text-red-500'>Signup failed. Please try again later.</p>
          )}
          <p className="login-bottom-p">
            Already have an account? <Link to='/login'>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
