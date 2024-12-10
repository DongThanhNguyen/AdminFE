import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod ,postMethodPayload, deleteMethod} from '../../services/request';
import Swal from 'sweetalert2';
import * as XLSX from "xlsx";
import { saveAs } from 'file-saver';


var size = 5
var url = '/api/thuong-hieu/all?&size='+size+'&sort=id,desc&page=';
const AdminTrademark = ()=>{
    const [items, setItems] = useState([]);
    const [cate, setCate] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    useEffect(()=>{
        getThuongHieu();
    }, []);

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(items);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, `DanhSachThuongHieu.xlsx`);
    };

    async function saveCategory(event) {
        event.preventDefault();
        var id = event.target.elements.idcate.value;
        var brandName = event.target.elements.catename.value;
        var status = 1; // Trạng thái đang sử dụng mặc định

        // Kiểm tra tên thương hiệu
        if (!brandName.trim()) {
            toast.error("Tên thương hiệu không được để trống.");
            return;
        }
        if (brandName.length > 255) {
            toast.error("Tên thương hiệu không được quá 255 ký tự.");
            return;
        }

        // Lấy thông tin người dùng từ localStorage
        var user = JSON.parse(localStorage.getItem("user"));

        const payload = {
            tenThuongHieu: brandName,
            nguoiTao: user.maNhanVien,
            nguoiCapNhat: user.maNhanVien,
            trangThai: status,  // Trạng thái đang sử dụng mặc định là 1 (đang sử dụng)
        };

        // Nếu có ID (tức là đang cập nhật), lấy thông tin người tạo từ item cũ
        if (id != "") {
            payload.nguoiTao = cate.nguoiTao;
        }

        var url = '/api/thuong-hieu';
        if (cate != null) {
            url += '/' + cate.id; // Thêm ID vào URL để cập nhật thương hiệu
        }

        try {
            const res = await postMethodPayload(url, payload);

            if (res.status < 300) {
                toast.success('Thành công!');
                await new Promise(resolve => setTimeout(resolve, 1000));
                window.location.reload();
            } else if (res.status === 417) {
                const result = await res.json();
                toast.error(result.defaultMessage);  // Hiển thị thông báo lỗi từ backend
            } else {
                const result = await res.json();
                toast.error(result.message);  // Hiển thị lỗi chung
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi lưu dữ liệu.");
        }
    }



    async function getCategrory() {
        var response = await getMethod('/api/thuong-hieu');
        var result = await response.json();
        setItems(result)
    }

    const getThuongHieu = async() =>{
        var response = await getMethod('/api/thuong-hieu/all?&size='+size+'&sort=id,desc&page='+0)
        var result = await response.json();
        console.log(result);
        setItems(result.content)
        setPageCount(result.totalPages)
        url = '/api/thuong-hieu/all?&size='+size+'&sort=id,desc&page='
    };

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

    async function getData(searchTerm = '') {
        const response = await getMethod('/api/thuong-hieu');
        let result = await response.json();
        if (searchTerm.trim() !== '') {
            result = result.filter(item =>
                item.tenThuongHieu.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setItems(result);
    }
    function handleShowAllClick() {
        setSearchTerm(''); // Đặt lại từ khóa tìm kiếm
        setCurrentPage(0);
        getThuongHieu(); // Lấy lại toàn bộ dữ liệu
    }
    function handleSearchClick() {
        if (searchTerm.trim() === '') {
            toast.warning("Vui lòng nhập từ khóa để tìm kiếm."); // Hiển thị thông báo nếu không có từ khóa
        } else {
            getData(searchTerm); // Gọi API với từ khóa tìm kiếm
        }
    }
    function clearInput(){
        setCate(null);
    }
    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        var response = await getMethod(url+currentPage)
        var result = await response.json();
        setItems(result.content)
        setPageCount(result.totalPages)
        setCurrentPage(currentPage);
    }


    return (
        <>
            <div className="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong className="text-left"><i className='fa fa-list'></i> Quản lý thương hiệu</strong>
                <div className="search-wrapper d-flex align-items-center justify-content-between">
                    <div className="search-container d-flex align-items-center bg-light p-2 rounded shadow-sm">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên"
                            className="form-control border-0 shadow-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{flex: 1}}
                        />
                        <button className="btn btn-primary ms-2" onClick={handleSearchClick}>
                            <i className="fa fa-search"></i> Tìm kiếm
                        </button>
                        <button className="btn btn-secondary ms-2" onClick={handleShowAllClick}>
                            <i className="fa fa-list"></i> Làm Mới
                        </button>
                    </div>
                    <button onClick={() => clearInput()} data-bs-toggle="modal" data-bs-target="#addcate"
                            className="btn btn-success ms-3">
                        <i className='fa fa-plus'></i> Thêm mới
                    </button>
                    <a href='#' onClick={() => exportToExcel()} className="btn btn-success ms-2">
                        <i className='fa fa-excel-o'></i>Excel</a>
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
                            <th>STT</th>
                            <th>Tên thương hiệu</th>
                            <th>Người tạo</th>
                            <th>Người cập nhật</th>
                            <th class="sticky-col">Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map(((item, index) => {
                            const stt = currentPage * size + index + 1;
                            return <tr>
                                <td>{stt}</td>
                                <td>{item.tenThuongHieu}</td>
                                <td>{item.nguoiTao}</td>
                                <td>{item.nguoiCapNhat}</td>
                                <td class="sticky-col" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <a onClick={() => setCate(item)} data-bs-toggle="modal" data-bs-target="#addcate"
                                       class="edit-btn"><i className='fa fa-edit'></i></a>
                                    {/*<button onClick={() => deleteCategory(item.id)} class="delete-btn"><i*/}
                                    {/*    className='fa fa-trash'></i></button>*/}
                                </td>
                            </tr>
                        }))}
                        </tbody>
                    </table>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
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
                            activeClassName='active'
                            forcePage={currentPage}
                        />
                    </div>
                </div>
            </div>

            <div class="modal fade" id="addcate" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header"><h5 class="modal-title" id="exampleModalLabel">Thêm hoặc cập nhật
                            thương hiệu</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form class="col-sm-5 marginauto" onSubmit={saveCategory} method='post'>
                                <input defaultValue={cate == null ? '' : cate.id} name="idcate" id='idcate'
                                       type="hidden"/>
                                <label>Tên thương hiệu</label>
                                <input defaultValue={cate == null ? '' : cate.tenThuongHieu} name="catename"
                                       id='catename' type="text" class="form-control"/>
                                <br/>
                                <label>Trạng thái</label>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="status"
                                        id="status1"
                                        value="1"
                                        defaultChecked={cate?.trangThai === 1 || !cate}
                                    />
                                    <label className="form-check-label" htmlFor="status1">
                                        Đang sử dụng
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="status"
                                        id="status0"
                                        value="0"
                                        defaultChecked={cate?.trangThai === 0}
                                    />
                                    <label className="form-check-label" htmlFor="status0">
                                        Không sử dụng
                                    </label>
                                </div>
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