import React, { useState } from 'react';
import './login.scss';
import { useHistory } from 'react-router-dom';
import login from '../../image/logo.png';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from '../../pages/ProtectedRoute ';

const Login = () => {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const history = useHistory();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log(data, 'data');
      const res = await axios.post(`${process.env.REACT_APP_DEVELOPMENT}/api/user/loginUser`, data);
      const accessToken = res.data.result.token;
      console.log(accessToken, 'kkk');
      console.log(res, 'res');
  
      if (accessToken) {
        console.log(accessToken, 'acces');
        sessionStorage.setItem('accessToken', accessToken);
        setIsAuthenticated(true);
        setShowLoginForm(false);
        setTimeout(() => {
          history.push('/Home');
        }, 500);
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.log('Error:', error);
      toast(error.response?.data || error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  

  return (
    <>
      <div className='tharb_heading'>
        <h1 className='text-center pt-3 '>Tharb Camel Lab Store</h1>
      </div>
      <div className="login-page">
        {showLoginForm ? (
          <div className="row justify-content-center align-items-center">
            <div className="col-md-6">
              <div className="login-form">
                <ToastContainer />
                <h2 className="text-center mb-4">Welcome Back!</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">User name</label>
                    <input className="form-control" id="email" placeholder="Enter user name" {...register("userName", { required: true })} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" placeholder="Password" required {...register("password", { required: true })} />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">Login</button>
                </form>
              </div>
            </div>
            <div className="col-md-6">
              <img src={login} alt="Login illustration" className="undraw-illustration" />
            </div>
          </div>
        ) : (
          <div className="login-animation">
            <img src={login} alt="Login illustration" className="undraw-illustration-animation" />
          </div>
        )}
      </div>
    </>
  );
};

export default Login;
