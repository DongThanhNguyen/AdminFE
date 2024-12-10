import { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { getMethod, uploadSingleFile, uploadMultipleFile, postMethodPayload } from '../../services/request';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { Editor } from '@tinymce/tinymce-react';
import React, { useRef } from 'react';


var token = localStorage.getItem("token");

var linkbanner = '';
const AdminEditNhanVien = () => {
    const [item, setItem] = useState(null);
    const [label, setLabel] = useState("Thêm nhân viên");
    const [gender, setGender] = useState(null);
    const [role, setRole] = useState(1);
    const [status, setStatus] = useState(1);

    useEffect(() => {
        const getNhanVien = async () => {
            var uls = new URL(document.URL)
            var id = uls.searchParams.get("id");
            if (id != null) {
                setLabel("Cập nhật thông tin nhân viên")
                var response = await getMethod('/api/nhan-vien/' + id);
                var result = await response.json();
                setItem(result);
                setGender(result.gioiTinh);
                setRole(result.vaiTro);
                setStatus(result.trangThai);
                linkbanner = result.anh
            }
        };
        getNhanVien();
    }, []);



    async function handleAddNhanVien(event) {
        event.preventDefault();

        // Lấy dữ liệu từ form
        const maNhanVien = event.target.elements.manv.value.trim();
        const hoVaTen = event.target.elements.hoten.value.trim();
        const gioiTinh = gender;
        const ngaySinh = event.target.elements.ngsinh.value;
        const queQuan = event.target.elements.queQuan.value.trim();
        const cccd = event.target.elements.cccd.value.trim();
        const soDienThoai = event.target.elements.Sdt.value.trim();
        const email = event.target.elements.email.value.trim();

        // Kiểm tra trống từng trường
        if (!maNhanVien) {
            toast.error("Mã nhân viên không được để trống");
            return;
        }
        if (!hoVaTen) {
            toast.error("Họ tên không được để trống");
            return;
        }
        if (!ngaySinh) {
            toast.error("Ngày sinh không được để trống");
            return;
        }
        // Validate ngày sinh phải là ngày quá khứ
        const selectedDate = new Date(ngaySinh);
        const currentDate = new Date();
        if (selectedDate >= currentDate) {
            toast.error("Ngày sinh phải là ngày quá khứ.");
            return;
        }

        if (!queQuan) {
            toast.error("Quê quán không được để trống");
            return;
        }
        if (!cccd) {
            toast.error("Căn cước công dân không được để trống");
            return;
        }
        // cccd phải bắt đầu bằng "0" và có 12 chữ số
        const cccdRegex = /^0\d{11}$/;
        if (!cccdRegex.test(cccd)) {
            toast.error("Căn cước công dân phải bắt đầu bằng số 0 và có 12 chữ số.");
            return;
        }

        if (!soDienThoai) {
            toast.error("Số điện thoại không được để trống");
            return;
        }
        // Validate số điện thoại
        const phoneRegex = /^(09|08|05|02|03|01)\d{7,9}$/; // Đầu số (09, 08, 05, 02, 03) + 9-11 số
        if (!phoneRegex.test(soDienThoai)) {
            toast.error("Số điện thoại không đúng định dạng. Đầu số hợp lệ: 09, 08, 05, 02, 03, 01 và độ dài từ 9-11 số.");
            return;
        }

        if (!email) {
            toast.error("Email không được để trống");
            return;
        }
        // Validate email đúng định dạng
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Email không đúng định dạng. Đảm bảo email có ký tự '@' và '.'");
            return;
        }

        // Kiểm tra trùng số điện thoại và email qua API
        try {
            const phoneExistsResponse = await getMethod(`/api/nhan-vien/exists/soDienThoai?soDienThoai=${soDienThoai}`);
            const emailExistsResponse = await getMethod(`/api/nhan-vien/exists/email?email=${email}`);

            const phoneExists = await phoneExistsResponse.json();
            const emailExists = await emailExistsResponse.json();

            if (phoneExists && (!item || item?.soDienThoai !== soDienThoai)) {
                toast.error("Số điện thoại đã tồn tại.");
                return;
            }

            if (emailExists && (!item || item?.email !== email)) {
                toast.error("Email đã tồn tại.");
                return;
            }
        } catch (error) {
            toast.error("Lỗi khi kiểm tra thông tin nhân viên.");
            return;
        }

        var user = JSON.parse(localStorage.getItem("user"))
        var ims = await uploadSingleFile(document.getElementById("imgbanner"))
        if (ims != null) {
            linkbanner = ims
        }
        const payload = {
            maNhanVien: event.target.elements.manv.value,
            anh: linkbanner,
            hoVaTen: event.target.elements.hoten.value,
            ngaySinh: event.target.elements.ngsinh.value,
            gioiTinh: gioiTinh,
            queQuan: event.target.elements.queQuan.value,
            cccd: event.target.elements.cccd.value,
            soDienThoai: event.target.elements.Sdt.value,
            email: event.target.elements.email.value,
            // taiKhoan: event.target.elements.taiKhoan.value,
            // matKhau: event.target.elements.password.value,
            vaiTro: role,
            nguoiTao: user.maNhanVien,
            nguoiCapNhat: user.maNhanVien,
            trangThai: status,
        };
        if (item != null) {
            payload.nguoiTao = item.nguoiTao
        }
        var url = '/api/nhan-vien';
        if (item != null) {
            url += '/' + item.id
        }
        const res = await postMethodPayload(url, payload)
        if (res.status < 300) {
            toast.success('Cập nhật thành công!');
            await new Promise(resolve => setTimeout(resolve, 1000));
            window.location.href = 'user'
        }
        if (res.status == 417) {
            var result = await res.json()
            toast.error(result.defaultMessage);
        }
        if (res.status > 300) {
            toast.error("Thất bại");
        }
    };

    return (
        <div>
            <div class="col-sm-12 header-sps d-flex justify-content-center align-items-center">
                <div class="title-add-admin">
                    <h4>{label}</h4>
                </div>
            </div>
            <div class="col-sm-12 d-flex justify-content-center align-items-center">
                <form onSubmit={handleAddNhanVien} class="form-add row">
                    <div class="col-sm-5">
                        <label class="lb-form">Mã nhân viên</label>
                        <input name='manv' defaultValue={item?.maNhanVien} class="form-control" />

                        <label class="lb-form">Họ tên</label>
                        <input name='hoten' defaultValue={item?.hoVaTen} class="form-control" />

                        <label class="lb-form">Giới tính</label>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name="gioitinh"
                                    value="true"
                                    checked={gender === true}
                                    onChange={() => setGender(true)}
                                />
                                Nam
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="gioitinh"
                                    value="false"
                                    checked={gender === false}
                                    onChange={() => setGender(false)}
                                />
                                Nữ
                            </label>
                        </div>

                        <label class="lb-form">Ngày sinh</label>
                        <input name='ngsinh' defaultValue={item?.ngaySinh} type='date' class="form-control" />

                        <label class="lb-form">Quê quán</label>
                        <input name='queQuan' defaultValue={item?.queQuan} class="form-control" />

                        <br />
                        <button class="form-control btn btn-primary">{label}</button>
                    </div>
                    <div className='col-sm-5'>
                        <label class="lb-form">Ảnh</label>
                        <input id='imgbanner' type='file' class="form-control" />

                        <label class="lb-form">Căn cước công dân</label>
                        <input name='cccd' defaultValue={item?.cccd} class="form-control" />

                        <label class="lb-form">Vai trò</label>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name="vaiTro"
                                    value="1"
                                    checked={role === 1}
                                    onChange={() => setRole(1)}
                                />
                                Admin
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="vaiTro"
                                    value="0"
                                    checked={role === 0}
                                    onChange={() => setRole(0)}
                                />
                                Nhân viên
                            </label>
                        </div>


                        <label class="lb-form">Số điện thoại</label>
                        <input name='Sdt' defaultValue={item?.soDienThoai} class="form-control" />


                        <label class="lb-form">Email</label>
                        <input name='email' defaultValue={item?.email} class="form-control" />


                        <label class="lb-form">Trạng thái</label>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name="trangThai"
                                    value="1"
                                    checked={status === 1}
                                    onChange={() => setStatus(1)}
                                />
                                Đang làm việc
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="trangThai"
                                    value="0"
                                    checked={status === 0}
                                    onChange={() => setStatus(0)}
                                />
                                Nghỉ việc
                            </label>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
}


export default AdminEditNhanVien;