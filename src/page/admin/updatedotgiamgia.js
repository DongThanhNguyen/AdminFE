import { useState, useEffect } from 'react'
import {toast } from 'react-toastify';
import { getMethod ,uploadSingleFile, uploadMultipleFile, postMethodPayload} from '../../services/request';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { Editor } from '@tinymce/tinymce-react';
import React, { useRef } from 'react';


const AdminUpdateDotGiamGia = ()=>{
    const [item, setItem] = useState(null);
    const [products, setProducts] = useState([]);
    const [productDaThem, setProductDaThem] = useState([]);
    const [productSelect, setproductSelect] = useState([]);
    const [label, setLabel] = useState("Thêm đợt giảm giá");
    useEffect(()=>{
        const getPhieuGiamGia= async() =>{
            var uls = new URL(document.URL)
            var id = uls.searchParams.get("id");
            if(id != null){
                var response = await getMethod('/api/dot-giam-gia/' + id);
                var result = await response.json();
                setItem(result)
                var response = await getMethod('/api/dot-giam-gia/san-pham-add?id=' + id);
                var result = await response.json();
                setProductDaThem(result)
            }
        };
        getPhieuGiamGia();
        const getProducts= async() =>{
            var response = await getMethod('/api/san-pham');
            var result = await response.json();
            setProducts(result)
        };
        getProducts();
    }, []);


    async function handleAddPhieuGG(event) {
        event.preventDefault();
        var user = JSON.parse(localStorage.getItem("user"))
        var arr = [];
        for(var i=0; i< productSelect.length; i++){
            arr.push(productSelect[i].id)
        }
        if(arr.length == 0){
            toast.error("Hãy chọn ít nhất 1 sản phẩm")
            return;
        }
        const payload = {
            giaTriGiam: event.target.elements.giatrigiam.value,
            ngayBatDau: event.target.elements.ngaybatdau.value,
            ngayKetThuc: event.target.elements.ngayketthuc.value,
            nguoiTao: user.hoVaTen,
            listIdSp: arr,
            trangThai:1
        };
        console.log(payload);
        
        const res = await postMethodPayload('/api/dot-giam-gia', payload)
        if(res.status < 300){
            toast.success('Success!');
            await new Promise(resolve => setTimeout(resolve, 1000));
            window.location.href = 'dot-giam-gia'
        }
        if (res.status == 417) {
            var result = await res.json()
            toast.error(result.defaultMessage);
        }
        if(res.status > 300){
            toast.error("Thất bại");
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
                <form onSubmit={handleAddPhieuGG} class="form-add row">
                    <div class="col-sm-5">
                        <label class="lb-form">Giá trị giảm</label>
                        <input name='giatrigiam' defaultValue={item?.giaTriGiam} class="form-control"/>

                        <label class="lb-form">Ngày bắt đầu</label>
                        <input type='datetime-local' name='ngaybatdau' defaultValue={item?.ngayBatDau} class="form-control"/>

                        <label class="lb-form">Ngày kết thúc</label>
                        <input type='datetime-local' name='ngayketthuc' defaultValue={item?.ngayKetThuc} class="form-control"/>

                        <label class="lb-form">Chọn sản phẩm thêm vào phiếu giảm giá</label>
                        <Select
                            className="select-container ms-2" 
                            options={products}
                            value={productSelect}
                            onChange={setproductSelect}
                            getOptionLabel={(option) => option.tenSanPham} 
                            getOptionValue={(option) => option.id}    
                            name='sanpham'
                            placeholder="Chọn sản phẩm"
                            isMulti
                        />
                        <br/>
                        <button class="form-control btn btn-primary">{label}</button>
                    </div>
                    <div class="col-sm-5">
                        <h5>Các sản phẩm đã add đợt giảm giá này</h5>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>Id sản phẩm</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Xóa</th>
                                </tr>
                            </thead>
                            <tbody>
                            {productDaThem.map((item=>{
                                return  <tr>
                                    <td>{item.id}</td>
                                    <td>{item.tenSanPham}</td>
                                    <td class="sticky-col">
                                        <button className='delete-btn'><i className='fa fa-trash'></i></button>
                                    </td>
                                </tr>
                            }))}
                            </tbody>
                        </table>
                    </div>
                </form>
            </div>
        </div>
    );
}


export default AdminUpdateDotGiamGia;