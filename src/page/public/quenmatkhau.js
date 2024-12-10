import React, { useState, useEffect } from 'react';
import {toast } from 'react-toastify';
import {postMethodPayload, postMethod} from '../../services/request'
import Swal from 'sweetalert2'


function QuenMatKhau(){

    async function handleQuenPass(event) {
        event.preventDefault();
        const res = await postMethodPayload('/api/v1/auth/public/quen-mat-khau?email='+event.target.elements.email.value);
        var result = await res.json()
        if (res.status == 417) {
          toast.warning(result.defaultMessage);
        }
        if(res.status < 300){
            Swal.fire({
                title: "Thông báo",
                text: "Mật khẩu đã được gửi về email của bạn!",
                preConfirm: () => {
                    window.location.href = 'login'
                }
            });
        }
      };

    return(
        <section className="login_section layout_padding">
        <div className="container">
          <div className="heading_container heading_center">
            <h2>Quên Mật Khẩu</h2>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="login_box">
                <form onSubmit={handleQuenPass}>
                  <div className="input-box">
                    <input name='email' type="email" placeholder="Email" required />
                  </div>
                  <div className="btn-box">
                    <button type="submit" className="login-btn">Xác nhận</button>
                  </div>
                </form>
                <a href="login" class="text-center">Login</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}
export default QuenMatKhau;