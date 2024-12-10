import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod ,postMethodPayload, deleteMethod} from '../../services/request';
import Swal from 'sweetalert2';



const AdminTrademark = ()=>{
    const [items, setItems] = useState([]);
    const [cate, setCate] = useState(null);
    useEffect(()=>{
        getCategrory();
    }, []);

    async function saveCategory(event) {
        event.preventDefault();
        var id = event.target.elements.idcate.value;
        var user = JSON.parse(localStorage.getItem("user"))
        const payload = {
            tenThuongHieu: event.target.elements.catename.value,
            nguoiTao: user.maNhanVien,
            nguoiCapNhat: user.maNhanVien,
            trangThai: 1,
        };
        if(id != ""){
            payload.nguoiTao = cate.nguoiTao
        }
        var url = '/api/thuong-hieu';
        if(cate != null){
            url += '/'+cate.id
        }
        const res = await postMethodPayload(url, payload)
        if(res.status < 300){
            toast.success('Success!');
            await new Promise(resolve => setTimeout(resolve, 1000));
            window.location.reload();
        }
        if (res.status == 417) {
            var result = await res.json()
            toast.error(result.defaultMessage);
        }
    };
    

    async function getCategrory() {
        var response = await getMethod('/api/thuong-hieu');
        var result = await response.json();
        setItems(result)
    }

    async function deleteCategory(id){
        var con = window.confirm("Confirm?");
        if (con == false) {
            return;
        }
        const response = await deleteMethod('/api/thuong-hieu/' + id)
        if (response.status < 300) {
            toast.success("Delete success!");
            getCategrory();
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }

    function clearInput(){
        setCate(null);
    }



    return (
        <>
            <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-list'></i> Quản lý thương hiệu</strong>
                <div class="search-wrapper d-flex align-items-center">
                    <div class="search-container">
                    </div>
                    <button onClick={()=>clearInput()} data-bs-toggle="modal" data-bs-target="#addcate" class="btn btn-primary ms-2"><i className='fa fa-plus'></i></button>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách thương hiệu</span>
                </div>
                <div class="divcontenttable">
                    <table id="example" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>Tên thương hiệu</th>
                                <th>Người tạo</th>
                                <th>Người cập nhật</th>
                                <th class="sticky-col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                    return  <tr>
                                    <td>{item.id}</td>
                                    <td>{item.tenThuongHieu}</td>
                                    <td>{item.nguoiTao}</td>
                                    <td>{item.nguoiCapNhat}</td>
                                    <td class="sticky-col">
                                        <a onClick={()=>setCate(item)} data-bs-toggle="modal" data-bs-target="#addcate" class="edit-btn"><i className='fa fa-edit'></i></a>
                                        <button onClick={()=>deleteCategory(item.id)} class="delete-btn"><i className='fa fa-trash'></i></button>
                                    </td>
                                </tr>
                            }))}
                        </tbody>
                    </table>
                </div>
            </div>

        <div class="modal fade" id="addcate" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
            <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header"><h5 class="modal-title" id="exampleModalLabel">Thêm hoặc cập nhật thương hiệu</h5> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                <div class="modal-body">
                    <form class="col-sm-5 marginauto" onSubmit={saveCategory} method='post'>
                        <input defaultValue={cate==null?'':cate.id} name="idcate" id='idcate' type="hidden" />
                        <label>Tên thương hiệu</label>
                        <input defaultValue={cate==null?'':cate.tenThuongHieu} name="catename" id='catename' type="text" class="form-control" />
                        <br/><br/>
                        <button class="btn btn-success form-control action-btn">Xác nhận</button>
                    </form>
                </div>
            </div>
            </div>
        </div>
        </>
    );
}

export default AdminTrademark;