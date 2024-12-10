import React, { useState, useEffect } from 'react';
import {toast } from 'react-toastify';
import '../login/Login.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import {postMethodPayload} from '../../services/request'
import Swal from 'sweetalert2'


async function processLogin(user, token) {
  toast.success('Login success!');
  await new Promise(resolve => setTimeout(resolve, 1500));
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  if (user.authorities.name === "ROLE_ADMIN") {
      window.location.href = 'admin/user';
  }
  if (user.authorities.name === "ROLE_USER") {
      window.location.href = '/';
  }
}


const LoginPages = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setError(null); 
        },
        (err) => {
          setError(`Error: ${err.message}`);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);
  console.log(location);


  async function handleLogin(event) {
    event.preventDefault();
    const payload = {
        email: event.target.elements.email.value,
        password: event.target.elements.password.value,
        latitude: location.latitude,
        longitude: location.longitude,
    };
    const res = await postMethodPayload('/api/user/login/email', payload);
    
    var result = await res.json()
    console.log(result);
    if (res.status == 417) {
        if (result.errorCode == 300) {
            Swal.fire({
                title: "Notification",
                text: "Active account require!",
                preConfirm: () => {
                    window.location.href = 'confirm?email=' + event.target.elements.email.value
                }
            });
        } else {
            toast.warning(result.defaultMessage);
        }
    }
    if(res.status < 300){
        processLogin(result.user, result.token)
    }
  };
  

  const handleLoginSuccess = async (accessToken) => {
    console.log(accessToken);
    
    var response = await fetch('http://localhost:8080/api/user/login/google?latitude='+location.latitude+'&longitude='+location.longitude, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: accessToken.credential
    })
    var result = await response.json();
    if (response.status < 300) {
        processLogin(result.user, result.token)
    }
    if (response.status == 417) {
        toast.warning(result.defaultMessage);
    }
};

const handleLoginError = () => {
    toast.error("Login error")
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
              <div className="text-center mt-4">
                <p>Don't have an account? <a href="/register">Register here</a></p>
              </div>
              <hr/>
              <p className='text-center'>Or login with google</p>
              <GoogleOAuthProvider clientId="663646080535-l004tgn5o5cpspqdglrl3ckgjr3u8nbf.apps.googleusercontent.com">
              <div className='divcenter' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={handleLoginError}
              />
              </div>
              </GoogleOAuthProvider>
              <a href="forgot" class="text-center">forgot password ?</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPages;
