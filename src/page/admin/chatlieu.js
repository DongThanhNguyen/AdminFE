import { useState, useEffect } from 'react'
import {toast } from 'react-toastify';
import { getMethod ,uploadSingleFile, uploadMultipleFile, postMethodPayload} from '../../services/request';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { Editor } from '@tinymce/tinymce-react';


var linkbanner = '';
const AdminAddProduct = ()=>{
    const [product, setProduct] = useState(null);
    const [thuonghieu, setThuongHieu] = useState([]);
    const [chatlieu, setChatLieu] = useState([]);
    const [degiay, setDeGiay] = useState([]);
    const [selectedThuongHieu, setSelectedThuongHieu] = useState(null);
    const [selectedChatLieu, setSelectedChatLieu] = useState(null);
    const [selectedDeGiay, setSelectedDeGiay] = useState(null);
    const [label, setLabel] = useState("Thêm sản phẩm");
    useEffect(()=>{
        const getProduct= async() =>{
            var uls = new URL(document.URL)
            var id = uls.searchParams.get("id");
            if(id != null){
                setLabel("Cập nhập sản pham")
                var response = await getMethod('/api/san-pham/' + id);
                console.log(response);

                var result = await response.json();
                linkbanner = result.anh
                setProduct(result)
                setSelectedThuongHieu(result.thuongHieu)
                setSelectedChatLieu(result.chatLieu)
                setSelectedDeGiay(result.deGiay)

            }
        };
        getProduct();

        const getSelect= async() =>{
            var response = await getMethod("/api/de-giay");
            var list = await response.json();
            setDeGiay(list)
            var response = await getMethod("/api/thuong-hieu");
            var list = await response.json();
            setThuongHieu(list)
            var response = await getMethod("/api/chat-lieu");
            var list = await response.json();
            setChatLieu(list)
        };
        getSelect();
    }, []);

    async function handleAddSanPham(event) {
        event.preventDefault();

        // Lấy thông tin người dùng từ localStorage
        var user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            toast.error("Người dùng không hợp lệ.");
            return;
        }

        // Lấy giá trị từ form
        const masp = event.target.elements.masp.value.trim();
        const tensp = event.target.elements.tensp.value.trim();
        const trangThai = event.target.elements.trangThai.value; // Lấy giá trị từ radio button
        const giaBan = parseFloat(event.target.elements.giaBan.value);

        // Kiểm tra hợp lệ
        if (!masp) {
            toast.error("Mã sản phẩm không được để trống.");
            return;
        }
        if (!tensp) {
            toast.error("Tên sản phẩm không được để trống.");
            return;
        }
        if (!trangThai || (trangThai !== "1" && trangThai !== "2")) {
            toast.error("Trạng thái không hợp lệ. Vui lòng chọn Còn hàng hoặc Hết hàng.");
            return;
        }
        if (isNaN(giaBan) || giaBan <= 0) {
            toast.error("Giá bán phải là một số hợp lệ và lớn hơn 0.");
            return;
        }

        // Upload hình ảnh
        var ims = await uploadSingleFile(document.getElementById("imgbanner"));
        let linkbanner = ims || null;

        // Tạo payload
        const payload = {
            maSanPham: masp,
            tenSanPham: tensp,
            idThuongHieu: selectedThuongHieu?.id,
            idChatLieu: selectedChatLieu?.id,
            idDeGiay: selectedDeGiay?.id,
            nguoiTao: user.maNhanVien,
            nguoiCapNhat: user.maNhanVien,
            trangThai: parseInt(trangThai), // Chuyển thành số (1 hoặc 2)
            giaBan,
            anh: linkbanner,
        };

        // Kiểm tra các trường ID bắt buộc
        if (!payload.idThuongHieu) {
            toast.error("Vui lòng chọn thương hiệu.");
            return;
        }
        if (!payload.idChatLieu) {
            toast.error("Vui lòng chọn chất liệu.");
            return;
        }
        if (!payload.idDeGiay) {
            toast.error("Vui lòng chọn đế giày.");
            return;
        }

        // Nếu đang cập nhật, giữ nguyên người tạo ban đầu
        if (product != null) {
            payload.nguoiTao = product.nguoiTao;
        }

        // Xác định URL
        var url = '/api/san-pham';
        if (product != null) {
            url += '/' + product.id;
        }

        // Gửi payload qua API
        const res = await postMethodPayload(url, payload);

        // Xử lý phản hồi
        if (res.status < 300) {
            toast.success("Thành công!");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            window.location.href = 'product';
        } else if (res.status === 417) {
            const result = await res.json();
            toast.error(result.defaultMessage);
        } else if (res.status > 300) {
            const result = await res.json();
            toast.error(result.message);
        }
    }


    return (
        <div>
            <div class="col-sm-12 header-sps">
                <div class="title-add-admin">
                    <h4>{label}</h4>
                </div>
            </div>
            <div class="col-sm-12">
                <div class="form-add">
                    <div class="form-add">
                        <form class="row" onSubmit={handleAddSanPham} method='post'>
                            <div class="col-md-5 col-sm-12 col-12">
                                <label class="lb-form">Mã sản phẩm</label>
                                <input name="masp" defaultValue={product?.maSanPham} class="form-control"/>
                                <label class="lb-form">Tên sản phẩm</label>
                                <input name="tensp" defaultValue={product?.tenSanPham} class="form-control"/>
                                <label class="lb-form">Giá bán</label>
                                <input name="giaBan" defaultValue={product?.giaBan} class="form-control"/>
                                <label className="lb-form">Trạng thái</label>
                                <div>
                                    <label className="lb-form">
                                        <input
                                            type="radio"
                                            name="trangThai"
                                            value="1"
                                            defaultChecked={!product?.trangThai || product?.trangThai === 1}
                                        />
                                        Còn hàng
                                    </label>
                                    <label className="lb-form">
                                        <input
                                            type="radio"
                                            name="trangThai"
                                            value="2"
                                            defaultChecked={product?.trangThai === 2}
                                        />
                                        Hết hàng
                                    </label>
                                </div>

                                <label class="lb-form" dangerouslySetInnerHTML={{__html: '&ThinSpace;'}}></label>
                                <button class="btn btn-primary form-control">{label}</button>
                            </div>
                            <div class="col-md-5 col-sm-12 col-12">
                                <label class="lb-form">Chọn
                                    ảnh {product != null ? ' (Bỏ trống để dùng ảnh cũ)' : ''}</label>
                                <input id="imgbanner" type='file' class="form-control"/>
                                <label class="lb-form">Thương hiệu</label>
                                <Select
                                    className="select-container"
                                    options={thuonghieu}
                                    value={selectedThuongHieu}
                                    onChange={setSelectedThuongHieu}
                                    getOptionLabel={(option) => option.tenThuongHieu}
                                    getOptionValue={(option) => option.id}
                                    name='thuonghieu'
                                    placeholder="Chọn thương hiệu"
                                />
                                <label class="lb-form">Chất liệu</label>
                                <Select
                                    className="select-container"
                                    options={chatlieu}
                                    value={selectedChatLieu}
                                    onChange={setSelectedChatLieu}
                                    getOptionLabel={(option) => option.tenChatLieu}
                                    getOptionValue={(option) => option.id}
                                    name='chatlieu'
                                    placeholder="Chọn chất liệu"
                                />
                                <label class="lb-form">Đế giày</label>
                                <Select
                                    className="select-container"
                                    options={degiay}
                                    value={selectedDeGiay}
                                    onChange={setSelectedDeGiay}
                                    getOptionLabel={(option) => option.tenDeGiay}
                                    getOptionValue={(option) => option.id}
                                    name='degiay'
                                    placeholder="Chọn đế giày"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default AdminAddProduct;