import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod, deleteMethod ,uploadSingleFile} from '../../services/request';
import Swal from 'sweetalert2';
import { formatMoney } from '../../services/money';



const AdminProduct = ()=>{
    const [items, setItems] = useState([]);
    useEffect(()=>{
        getProduct();
    }, []);

    async function getProduct() {
        var response = await getMethod('/api/san-pham');
        var result = await response.json();
        setItems(result)
    }



    async function deleteProduct(id){
        var con = window.confirm("Confirm?");
        if (con == false) {
            return;
        }
        const response = await deleteMethod('/api/san-pham/' + id)
        if (response.status < 300) {
            toast.success("Xóa thành công!");
            getProduct();
        }
        if (response.status > 300) {
            var result = await response.json()
            toast.warning(result.message);
        }
    }



    return (
        <>
            <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-list'></i> Quản Lý Sản Phẩm</strong>
                <div class="search-wrapper d-flex align-items-center">
                    <div class="search-container">
                    </div>
                    <a href='add-product' class="btn btn-primary ms-2"><i className='fa fa-plus'></i></a>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">List product</span>
                </div>
                <div class="divcontenttable">
                    <table id="example" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Ảnh</th>
                                <th>Mã sản phẩm</th>
                                <th>Tên sản phẩm</th>
                                <th>Giá bán</th>
                                <th>Thương hiệu</th>
                                <th>Chất liệu</th>
                                <th>Đế giày</th>
                                <th>Ngày tạo</th>
                                <th>Người tạo</th>
                                <th>Người cập nhật</th>
                                <th class="sticky-col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                var linkanh = '';
                                var giaban = 0;
                                if(item.sanPhamChiTiets.length > 0){
                                    giaban = item.sanPhamChiTiets[0].giaTien
                                }
                                for(var i=0; i< item.sanPhamChiTiets.length; i++){
                                    if(item.sanPhamChiTiets[i].giaTien < giaban && item.sanPhamChiTiets[i].giaTien != null && item.sanPhamChiTiets[i].giaTien > 0){
                                        giaban = item.sanPhamChiTiets[i].giaTien;
                                    }
                                    if(item.sanPhamChiTiets[i].anhs != null && item.sanPhamChiTiets[i].anhs.length > 0){
                                        linkanh = item.sanPhamChiTiets[i].anhs[0].tenAnh
                                        break;
                                    }
                                }
                                return  <tr>
                                    <td>{item.id}</td>
                                    <td><img src={linkanh} className='imgtable'/></td>
                                    <td>{item.maSanPham}</td>
                                    <td>{item.tenSanPham}</td>
                                    <td>{formatMoney(giaban)}</td>
                                    <td>{item.thuongHieu?.tenThuongHieu}</td>
                                    <td>{item.chatLieu?.tenChatLieu}</td>
                                    <td>{item.deGiay?.tenDeGiay}</td>
                                    <td>{item.ngayTao}</td>
                                    <td>{item.nguoiTao}</td>
                                    <td>{item.nguoiCapNhat}</td>
                                    <td class="sticky-col">
                                        <a href={"add-product?id="+item.id} class="edit-btn"><i className='fa fa-edit'></i></a>
                                        <a target='_blank' href={"sanphamchitiet?sanpham="+item.id} class="edit-btn"><i className='fa fa-eye'></i></a>
                                        <button onClick={()=>deleteProduct(item.id)} class="delete-btn"><i className='fa fa-trash'></i></button>
                                    </td>
                                </tr>
                            }))}
                        </tbody>
                    </table>

                </div>
            </div>

        </>
    );
}

export default AdminProduct;