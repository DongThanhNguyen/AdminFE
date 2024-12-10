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
        var user = JSON.parse(localStorage.getItem("user"))
        var ims = await uploadSingleFile(document.getElementById("imgbanner"))
        if(ims != null){
            linkbanner = ims
        }
        const payload = {
            maSanPham: event.target.elements.masp.value,
            tenSanPham: event.target.elements.tensp.value,
            idThuongHieu: selectedThuongHieu.id,
            idChatLieu: selectedChatLieu.id,
            idDeGiay: selectedDeGiay.id,
            nguoiTao: user.maNhanVien,
            nguoiCapNhat: user.maNhanVien,
            trangThai: event.target.elements.trangThai.value,
            giaBan: event.target.elements.giaBan.value,
            anh: linkbanner,
        };
        console.log(payload);
        if(product != null){
            payload.nguoiTao = product.nguoiTao
        }
        var url = '/api/san-pham';
        if(product != null){
            url += '/'+product.id
        }
        const res = await postMethodPayload(url, payload)
        if(res.status < 300){
            toast.success('Success!');
            await new Promise(resolve => setTimeout(resolve, 1000));
            window.location.href = 'product'
        }
        if (res.status == 417) {
            var result = await res.json()
            toast.error(result.defaultMessage);
        }
        if(res.status > 300){
            var result = await res.json();
            toast.error(result.message);
        }
    };

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
                                <label class="lb-form">Trạng thái</label>
                                <input name="trangThai" defaultValue={product?.trangThai} class="form-control"/>
                                <label class="lb-form" dangerouslySetInnerHTML={{__html:'&ThinSpace;'}}></label>
                                <button class="btn btn-primary form-control">{label}</button>
                            </div>
                            <div class="col-md-5 col-sm-12 col-12">
                            <label class="lb-form">Chọn ảnh {product != null?' (Bỏ trống để dùng ảnh cũ)':''}</label>
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