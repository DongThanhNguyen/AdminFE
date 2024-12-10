import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod, deleteMethod ,uploadSingleFile, postMethod} from '../../services/request';
import Swal from 'sweetalert2';
import { formatMoney } from '../../services/money';
import Select from 'react-select';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';



var size = 8
var url = '';
const AdminDonHang = ()=>{
    const [trangThai, setTrangThai] = useState([]);
    const [selectTrangThai, setSelectTrangThai] = useState(null);
    const [pageCount, setpageCount] = useState(0);
    const [items, setItems] = useState([]);
    const [item, setItem] = useState(null);
    const [chiTietDonHang, setChiTietDonHang] = useState([]);
    const [lichSuHoaDon, setLichSuHoaDon] = useState([]);
    useEffect(()=>{
        getStatusInvoice();
        getDonHang();
    }, []);

    const getDonHang = async() =>{
        var response = await getMethod('/api/v1/hoa-don/all?&size='+size+'&sort=id,desc&page='+0)
        var result = await response.json();
        console.log(result);
        setItems(result.content)
        setpageCount(result.totalPages)
        url = '/api/v1/hoa-don/all?&size='+size+'&sort=id,desc&page='
    };

    const locDonHang = async() =>{
        var response = await getMethod('/api/v1/hoa-don/all?&size='+size+'&sort=id,desc&trangthai='+selectTrangThai.value+'&page='+0)
        var result = await response.json();
        console.log(result);
        setItems(result.content)
        setpageCount(result.totalPages)
        url = '/api/v1/hoa-don/all?&size='+size+'&sort=id,desc&trangthai='+selectTrangThai.value+'&page='
    };

    const getStatusInvoice = async() =>{
        var response = await getMethod("/api/v1/hoa-don/danh-sach-trang-thai");
        var list = await response.json();
        setTrangThai(list)
    };

    function getTrangThai(tt) {
        for(var i=0; i<trangThai.length; i++){
            if(trangThai[i].value == tt){
                return trangThai[i].tenTrangThai
            }
        }
        return "Không xác định";
    }

    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        var response = await getMethod(url+currentPage)
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
    }
    
    async function capNhatTrangThai(iddonhang, trangthai) {
        var con = window.confirm("Xác nhận cập nhật trạng thái")
        if(con == false){
            return;
        }
        if(trangthai < 6){
            var ttup = (Number(trangthai)+Number(1))
            if(trangthai == 5){
                ttup = 8;
            }
            var res = await postMethod("/api/v1/hoa-don/update-trang-thai?hoaDonId="+iddonhang+'&trangThai='+ttup)
            if(res.status < 300){
                toast.success("Thành công")
                getDonHang();
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
    }

    async function capNhatTT(iddonhang, trangthai) {
        Swal.fire({
            title: "Thông báo",
            text: "Chọn hành động bên dưới!",
            icon: "warning",
            showCancelButton: true, // Nút Hủy
            showDenyButton: true, // Nút Cancel để chỉ đóng Swal
            confirmButtonText: "Không nhận hàng", // Văn bản nút xác nhận
            cancelButtonText: "Hủy đơn", // Văn bản nút Hủy
            denyButtonText: "Đóng", // Văn bản nút Cancel
            reverseButtons: true, // Đảo thứ tự nút
          }).then((result) => {
            if (result.isConfirmed) {
                if(trangthai != 4){
                    toast.error("Đơn hàng chưa được gửi đi, không thể cập nhật trạng thái này")
                    return;
                }
                chuyenTrangThai(iddonhang,7)
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                chuyenTrangThai(iddonhang, 6)
            } else if (result.isDenied) {
              console.log("Đóng cửa sổ");
            }
        });
    }

    async function chuyenTrangThai(iddonhang, trangthai) {
        var res = await postMethod("/api/v1/hoa-don/update-trang-thai?hoaDonId="+iddonhang+'&trangThai='+trangthai)
        if(res.status < 300){
            toast.success("Thành công")
            getDonHang();
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

    async function getChiTietDonHang(item) {
        var response = await getMethod('/api/hoa-don-chi-tiet/find-by-hoa-don?hoaDonId='+item.id)
        var result = await response.json();
        setChiTietDonHang(result)
        var response = await getMethod('/api/lich-su-hoa-don/find-by-hoa-don?hoaDonId='+item.id)
        var result = await response.json();
        setLichSuHoaDon(result)
    }

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(items);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array',
        });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, `data.xlsx`);
      };

    return (
        <>
            <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-list'></i> Quản Lý Đơn Hàng</strong>
                <div class="search-wrapper d-flex align-items-center">
                    <div className='d-flex divngayadmin'>
                        <Select
                            className="select-container ms-2" 
                            options={trangThai}
                            value={selectTrangThai}
                            onChange={setSelectTrangThai}
                            getOptionLabel={(option) => option.tenTrangThai} 
                            getOptionValue={(option) => option.value}    
                            name='trangthai'
                            placeholder="Chọn trạng thái"
                        />
                    </div>
                    <button onClick={()=>locDonHang()} class="btn btn-primary ms-2"><i className='fa fa-filter'></i> Lọc</button>
                    <a href='add-product' class="btn btn-primary ms-2"><i className='fa fa-plus'></i></a>
                    <a href='#' onClick={()=>exportToExcel()} class="btn btn-primary ms-2"><i className='fa fa-excel-o'></i> xuất file</a>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách đơn hàng</span>
                </div>
                <div class="divcontenttable">
                    <table id="example" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Mã hóa đơn</th>
                                <th>Tên khách hàng</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Địa chỉ</th>
                                <th>Tổng tiền</th>
                                <th>Phí vận chuyển</th>
                                <th>Loại hóa đơn</th>
                                <th>Thanh toán</th>
                                <th>Ngày tạo</th>
                                <th>Trạng thái</th>
                                <th class="sticky-col">Cập nhật trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                    return  <tr>
                                    <td onClick={()=>getChiTietDonHang(item)} data-bs-toggle="modal" data-bs-target="#addcate" className='pointer' style={{color:'blue', fontWeight:'bold'}}>{item.id}</td>
                                    <td onClick={()=>getChiTietDonHang(item)} data-bs-toggle="modal" data-bs-target="#addcate" className='pointer' style={{color:'blue', fontWeight:'bold'}}>{item.maHoaDon}</td>
                                    <td>{item.tenKhachHang}</td>
                                    <td>{item.email}</td>
                                    <td>{item.soDienThoai}</td>
                                    <td>{item.diaChi}</td>
                                    <td>{formatMoney(item.tongTien)}</td>
                                    <td>{formatMoney(item.phiVanChuyen)}</td>
                                    <td>{item.loaiHoaDon == true?'Đặt hàng online':'Thanh toán tại quầy'}</td>
                                    <td>{item.daThanhToan == true?'Đã thanh toán':'Thanh toán khi nhận hàng'}</td>
                                    <td>{item.ngayTao}</td>
                                    <td>{getTrangThai(item.trangThai, trangThai)}</td>
                                    <td>
                                        <div className='d-flex'>
                                        {item.trangThai < 6 ? <button onClick={()=>capNhatTrangThai(item.id, item.trangThai)} class="edit-btn"><i class="fa fa-arrow-right"></i></button>:''}
                                        {item.trangThai < 5 ? <button onClick={()=>capNhatTT(item.id, item.trangThai)} class="delete-btn"><i class="fa fa-times-circle"></i></button>:''}
                                        </div>
                                    </td>
                                </tr>
                            }))}
                        </tbody>
                    </table>
                    <ReactPaginate 
                        marginPagesDisplayed={2} 
                        pageCount={pageCount} 
                        onPageChange={handlePageClick}
                        containerClassName={'pagination'} 
                        pageClassName={'page-item'} 
                        pageLinkClassName={'page-link'}
                        previousClassName='page-item'
                        previousLinkClassName='page-link'
                        nextClassName='page-item'
                        nextLinkClassName='page-link'
                        breakClassName='page-item'
                        breakLinkClassName='page-link' 
                        previousLabel='Trang trước'
                        nextLabel='Trang sau'
                        activeClassName='active'/>
                </div>
            </div>

            <div class="modal fade" id="addcate" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
                <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header"><h5 class="modal-title" id="exampleModalLabel">Thông tin đơn hàng</h5> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                    <div class="modal-body">
                    <h5>Lịch sử hóa đơn</h5>
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th>Ngày cập nhật</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lichSuHoaDon.map((stt, index)=>{
                                return <tr>
                                    <td>{stt.ngayTao}</td>
                                    <td>{getTrangThai(stt.trangThai)}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                    <table class="table table-cart table-order" id="detailInvoice">
                        <thead class="thead-default theaddetail">
                            <tr>
                                <th>Ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Giá bán</th>
                                <th>Số lượng</th>
                            </tr>
                        </thead>
                        <tbody>
                        {chiTietDonHang.map((item, index)=>{
                            return <tr>
                            <td><img src={item.sanPhamChiTiet.anhs.length > 0?item.sanPhamChiTiet.anhs[0].tenAnh:''} className='imgtable'/></td>
                            <td>{item.sanPhamChiTiet.sanPham.tenSanPham}</td>
                            <td>{formatMoney(item.giaSanPham)}</td>
                            <td>{item.soLuong}</td>
                        </tr>
                        })}
                        </tbody>
                    </table><br/><br/>
                </div>
                </div>
                </div>
            </div>
        </>
    );
}

export default AdminDonHang;