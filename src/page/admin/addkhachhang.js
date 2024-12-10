import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getMethod, uploadSingleFile, postMethodPayload } from '../../services/request';
import Swal from 'sweetalert2';

var token = localStorage.getItem("token");
var linkbanner = '';

const AdminAddKhachHang = () => {
    const [item, setItem] = useState(null);
    const [label, setLabel] = useState("Thêm khách hàng");
    const [gender, setGender] = useState(true);

    useEffect(() => {
        const getKhachHang = async () => {
            var uls = new URL(document.URL);
            var id = uls.searchParams.get("id");
            if (id != null) {
                setLabel("Cập nhật thông tin khách hàng");
                var response = await getMethod('/api/khachhang/' + id);
                var result = await response.json();
                setItem(result);
                setGender(result.gioiTinh);
                linkbanner = result.anh;
            }
        };
        getKhachHang();
    }, []);

    async function handleAddKhachHang(event) {
        event.preventDefault();

        // Lấy dữ liệu từ form
        const maKhachHang = event.target.elements.makh.value.trim();
        const hoVaTen = event.target.elements.hoten.value.trim();
        const gioiTinh = gender;
        const ngaySinh = event.target.elements.ngsinh.value;
        const soDienThoai = event.target.elements.Sdt.value.trim();
        const email = event.target.elements.email.value.trim();

        // Kiểm tra trống từng trường
        if (!maKhachHang) {
            toast.error("Mã KH Không đc để trống");
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
        
        if (!soDienThoai) {
            toast.error("Sđt không được để trống");
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
            const phoneExistsResponse = await getMethod(`/api/khachhang/exists/soDienThoai?soDienThoai=${soDienThoai}`);
            const emailExistsResponse = await getMethod(`/api/khachhang/exists/email?email=${email}`);

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
            toast.error("Lỗi khi kiểm tra thông tin khách hàng.");
            return;
        }

        var user = JSON.parse(localStorage.getItem("user"));
        var ims = await uploadSingleFile(document.getElementById("imgbanner"));
        if (ims != null) {
            linkbanner = ims;
        }
        const payload = {
            maKhachHang: maKhachHang,
            anh: linkbanner,
            hoVaTen: hoVaTen,
            ngaySinh: ngaySinh,
            soDienThoai: soDienThoai,
            gioiTinh: gioiTinh,
            email: email,
            nguoiTao: user.maNhanVien,
            nguoiCapNhat: user.maNhanVien,
            trangThai: 1, // Mặc định trạng thái là "Đang hoạt động"
        };
        if (item != null) {
            payload.nguoiTao = item.nguoiTao;
        }
        var url = '/api/khachhang';
        if (item != null) {
            url += '/' + item.id;
        }
        const res = await postMethodPayload(url, payload);
        if (res.status < 300) {
            toast.success('Thêm thành công!');
            await new Promise(resolve => setTimeout(resolve, 1000));
            window.location.href = 'khach-hang';
        }
        if (res.status == 417) {
            var result = await res.json();
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
            <div class="col-sm-12" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <form onSubmit={handleAddKhachHang} class="form-add row">
                    <div class="col-sm-5">
                        <label class="lb-form">Mã khách hàng</label>
                        <input name='makh' defaultValue={item?.maKhachHang} class="form-control" />

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

                        <br />
                        <button class="form-control btn btn-primary">{label}</button>
                    </div>
                    <div className='col-sm-5'>
                        <label class="lb-form">Ảnh</label>
                        <input id='imgbanner' type='file' class="form-control" />

                        <label class="lb-form">Số điện thoại</label>
                        <input name='Sdt' defaultValue={item?.soDienThoai} class="form-control" />

                        <label class="lb-form">Email</label>
                        <input name='email' defaultValue={item?.email} class="form-control" />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminAddKhachHang;
