import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod, deleteMethod ,postMethodPayload, uploadMultipleFile} from '../../services/request';
import Swal from 'sweetalert2';
import { formatMoney } from '../../services/money';
import Select from 'react-select';


const AdminSanPhamChiTiet = ()=>{
    const [items, setItems] = useState([]);
    const [kichco, setKichCo] = useState([]);
    const [mausac, setMauSac] = useState([]);
    const [selectedKichCo, setSelectedKichCo] = useState(null);
    const [selectedMauSac, setSelectedMauSac] = useState(null);
    const [sanpham, setSanPham] = useState(null);
    const [item, setItem] = useState(null);
    useEffect(()=>{
        getChiTietSanPham();
        getSanPham();
        getSelect();
    }, []);

    async function getChiTietSanPham() {
        var uls = new URL(document.URL)
        var sanpham = uls.searchParams.get("sanpham");
        if(sanpham == null){
            window.location.href = 'product'
        }
        var response = await getMethod('/api/san-pham-chi-tiet/findBySanPham?sanpham='+sanpham);
        var result = await response.json();
        setItems(result)
    }

    async function getSanPham() {
        var uls = new URL(document.URL)
        var sanpham = uls.searchParams.get("sanpham");
        var response = await getMethod('/api/san-pham/'+sanpham);
        var result = await response.json();
        setSanPham(result)
    }

    const getSelect= async() =>{
        var response = await getMethod("/api/mau-sac");
        var list = await response.json();
        setMauSac(list)
        var response = await getMethod("/api/kich-co");
        var list = await response.json();
        setKichCo(list)
    };

    function setItemSelect(item){
        setSelectedKichCo(item.kichCo)
        setSelectedMauSac(item.mauSac)
        setItem(item)
    }


    async function deleteChiTiet(id){
        var con = window.confirm("Confirm?");
        if (con == false) {
            return;
        }
        const response = await deleteMethod('/api/san-pham-chi-tiet/' + id)
        if (response.status < 300) {
            toast.success("Xóa thành công!");
            getChiTietSanPham();
        }
        if (response.status > 300) {
            var result = await response.json()
            toast.warning(result.message);
        }
    }

    async function saveData(event) {
        event.preventDefault();
        var user = JSON.parse(localStorage.getItem("user"))
        const payload = {
            maSanPhamChiTiet: event.target.elements.maSanPhamChiTiet.value,
            soLuong: event.target.elements.soLuong.value,
            giaTien: event.target.elements.giaTien.value,
            idSanPham: sanpham.id,
            idKichCo: selectedKichCo.id,
            idMauSac: selectedMauSac.id,
            trangThai: event.target.elements.trangThai.value,
            nguoiTao: user.maNhanVien,
            nguoiCapNhat: user.maNhanVien,
            trangThai: 1,
        };
        console.log(payload);
        
        if(item != null){
            payload.nguoiTao = item.nguoiTao
        }
        var url = '/api/san-pham-chi-tiet';
        
        if(item != null){
            url += '/'+item.id
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
        if(res.status > 300){
            var result = await res.json();
            toast.error(result.message);
        }
    };

    async function uploadAnh(item) {
        var listFile = []
        var files = document.getElementById("choosefile"+item.id).files;
        for (var i = 0; i < files.length; i++) {
            listFile.push(files[i]);
        }
        console.log(listFile);
        
        var listLink = await uploadMultipleFile(listFile)
        const res = await postMethodPayload('/api/anh?chiTietSanPhamId='+item.id, listLink)
        if(res.status < 300){
            toast.success("upload ảnh thành công");
            getChiTietSanPham();
        }
        if (res.status == 417) {
            var result = await res.json()
            toast.error(result.defaultMessage);
        }
        if(res.status > 300){
            var result = await res.json();
            toast.error(result.message);
        }
    }


    return (
        <>
            <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-list'></i> Quản Lý Sản Phẩm Chi tiết - {sanpham?.tenSanPham} - {sanpham?.maSanPham}</strong>
                <div class="search-wrapper d-flex align-items-center">
                    <div class="search-container">
                    </div>
                    <button onClick={()=>setItem(null)} data-bs-toggle="modal" data-bs-target="#addcate" class="btn btn-primary ms-2"><i className='fa fa-plus'></i></button>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách sản phẩm chi tiết</span>
                </div>
                <div class="divcontenttable">
                    <table id="example" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Ảnh</th>
                                <th>Qr</th>
                                <th>Mã chi tiết</th>
                                <th>Kích cỡ</th>
                                <th>Màu sắc</th>
                                <th>Số lượng</th>
                                <th>Gía tiền</th>
                                <th>Ngày tạo</th>
                                <th>Người tạo</th>
                                <th>Người cập nhật</th>
                                <th class="sticky-col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                    return  <tr>
                                    <td>{item.id}</td>
                                    <td>{item.anhs.length == 0 ? '':<img src={item.anhs[0].tenAnh} className='imgtable'/>}</td>
                                    <td><img src={item.qrCode} className='imgtable'/></td>
                                    <td>{item.maSanPhamChiTiet}</td>
                                    <td>{item.kichCo?.tenKichCo}</td>
                                    <td>{item.mauSac?.tenMauSac}</td>
                                    <td>{item.soLuong}</td>
                                    <td>{formatMoney(item.giaTien)}</td>
                                    <td>{item.ngayTao}</td>
                                    <td>{item.nguoiTao}</td>
                                    <td>{item.nguoiCapNhat}</td>
                                    <td class="sticky-col">
                                        <button onClick={()=>setItemSelect(item)} data-bs-toggle="modal" data-bs-target="#addcate" class="edit-btn"><i className='fa fa-edit'></i></button>
                                        <button onClick={()=>deleteChiTiet(item.id)} class="delete-btn"><i className='fa fa-trash'></i></button>
                                        <input onChange={()=>uploadAnh(item)} multiple={true} id={'choosefile'+item.id} type='file' style={{display:'none'}}/>
                                        <button onClick={()=>document.getElementById("choosefile"+item.id).click()} class="edit-btn"><i className='fa fa-image'></i></button>
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
                <div class="modal-header"><h5 class="modal-title" id="exampleModalLabel">Thêm hoặc cập nhật màu sắc</h5> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                <div class="modal-body">
                    <form class="col-sm-5 marginauto" onSubmit={saveData} method='post'>
                        <label class="lb-form">Mã sản phẩm chi tiết</label>
                        <input defaultValue={item?.maSanPhamChiTiet} name="maSanPhamChiTiet" type="text" class="form-control" />
                        <label class="lb-form">Số lượng</label>
                        <input defaultValue={item?.soLuong} name="soLuong" type="text" class="form-control" />
                        <label class="lb-form">Giá tiền</label>
                        <input defaultValue={item?.giaTien} name="giaTien" type="text" class="form-control" />
                        <label class="lb-form">Trạng thái</label>
                        <input defaultValue={item?.trangThai} name="trangThai" type="text" class="form-control" />
                        <label class="lb-form">Màu sắc</label>
                        <Select
                            className="select-container" 
                            options={mausac}
                            value={selectedMauSac}
                            onChange={setSelectedMauSac}
                            getOptionLabel={(option) => option.tenMauSac} 
                            getOptionValue={(option) => option.id}    
                            name='mausac'
                            placeholder="Chọn màu sắc"
                        />
                        <label class="lb-form">Kích cỡ</label>
                        <Select
                            className="select-container" 
                            options={kichco}
                            value={selectedKichCo}
                            onChange={setSelectedKichCo}
                            getOptionLabel={(option) => option.tenKichCo} 
                            getOptionValue={(option) => option.id}    
                            name='kichco'
                            placeholder="Chọn kích cỡ"
                        />
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

export default AdminSanPhamChiTiet;