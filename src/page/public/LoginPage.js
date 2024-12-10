import React, { useState, useEffect } from 'react';
import {toast } from 'react-toastify';
import '../../layout/user/loginlayout/Login.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import {postMethodPayload, postMethod} from '../../services/request'
import Swal from 'sweetalert2'




 const LoginPage = () => {
  useEffect(() => {
  }, []);

  async function getNhanVien(token) {
    const res = await fetch('http://localhost:8080/api/nhan-vien/dang-dang-nhap', {
      method: 'POST',
      headers: new Headers({
          'Authorization': 'Bearer ' + token
      })
    });
    var result = await res.json();
    localStorage.setItem("user", JSON.stringify(result));
  }

  async function handleLogin(event) {
    event.preventDefault();
    const payload = {
        email: event.target.elements.email.value,
        password: event.target.elements.password.value,
    };
    const res = await postMethodPayload('/api/v1/auth/public/login', payload);
    
    var result = await res.json()
    console.log(result);
    if (res.status == 417) {
      toast.warning(result.defaultMessage);
    }
    if(res.status < 300){
      if(result.role == "ROLE_CUSTOMER"){
        toast.warning("Không được đăng nhập tài khoản khách hàng");
        return;
      }
      else if(result.role == "ROLE_ADMIN"){
        toast.success('Đăng nhập thành công!');
        await new Promise(resolve => setTimeout(resolve, 1000));
        localStorage.setItem("token", result.token);
        await getNhanVien(result.token);
        window.location.href = '/admin/trademark'
      }
      else if(result.role == "ROLE_EMPLOYEE"){
        toast.success('Đăng nhập thành công!');
        await new Promise(resolve => setTimeout(resolve, 100));
        localStorage.setItem("token", result.token);
        await getNhanVien(result.token);
        window.location.href = '/nhanvien/don-hang'
      }
    }
  };
  
   return (
    <section className="login_section layout_padding">
    <div className="container">
      <div className="heading_container heading_center">
        <h2>Login</h2>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="login_box">
            <form onSubmit={handleLogin}>
              <div className="input-box">
                <input name='email' type="email" placeholder="Email" required />
              </div>
              <div className="input-box">
                <input name='password' type="password" placeholder="Password" required />
              </div>
              <div className="btn-box">
                <button type="submit" className="login-btn">Login</button>
              </div>
            </form>
            <a href="forgot" class="text-center">forgot password ?</a>
          </div>
        </div>
      </div>
    </div>
  </section>
   )
 }
 
 export default LoginPage
 