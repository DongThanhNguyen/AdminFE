import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'
import {getMethod,postMethodPayload, deleteMethod, postMethod} from '../../services/request';
import {formatMoney} from '../../services/money';



const AdminDotGiamGia = ()=>{
    const [items, setItems] = useState([]);
    useEffect(()=>{
        getDotGiamGia();
    }, []);

    const getDotGiamGia = async() =>{
        var response = await getMethod('/api/dot-giam-gia')
        var result = await response.json();
        setItems(result)
    };

    async function ketThuc(id){
        var con = window.confirm("Confirm?");
        if (con == false) {
            return;
        }
        const response = await postMethod('/api/dot-giam-gia/ket-thuc?id=' + id)
        if (response.status < 300) {
            var result = await response.text();
            toast.success(result);
            getDotGiamGia();
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }
    
    
    async function deleteDotGiamGia(id){
        var con = window.confirm("Confirm?");
        if (con == false) {
            return;
        }
        const response = await deleteMethod('/api/dot-giam-gia/xoa?id=' + id)
        if (response.status < 300) {
            var result = await response.text();
            toast.success(result);
            getDotGiamGia();
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }
    
    
    return (
        <>
            <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-ticket'></i> Quản lý đợt giảm giá</strong>
                <div class="search-wrapper d-flex align-items-center">
                    <div class="search-container">
                    </div>
                    <a href='add-dot-giam-gia' class="btn btn-primary ms-2"><i className='fa fa-plus'></i></a>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách đợt giảm giá</span>
                </div>
                <div class="divcontenttable">
                    <table id="example" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>Giá trị giảm</th>
                                <th>Ngày bắt đầu</th>
                                <th>Ngày kết thúc</th>
                                <th>Trạng thái</th>
                                <th>Ngày tạo</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                return  <tr>
                                    <td>{item.id}</td>
                                    <td>{formatMoney(item.giaTriGiam)}</td>
                                    <td>{item.ngayBatDau}</td>
                                    <td>{item.ngayKetThuc}</td>
                                    <td>{item.trangThai == 1?'Đang hoạt động':'Đã kết thúc'}</td>
                                    <td>{item.ngayTao}</td>
                                    <td class="sticky-col">
                                        {item.trangThai == 1?<button onClick={()=>ketThuc(item.id)} className='edit-btn'>Kết thúc</button>:''}
                                        <button onClick={()=>deleteDotGiamGia(item.id)} className='delete-btn'><i className='fa fa-trash'></i></button>
                                        <a href={'update-dot-giam-gia?id='+item.id} className='edit-btn'><i className='fa fa-edit'></i></a>
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

export default AdminDotGiamGia;