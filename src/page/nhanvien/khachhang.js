import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import { getMethod } from '../../services/request';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import ReactPaginate from 'react-paginate';

var size = 10
var url = '/api/khachhang/all?&size=' + size + '&sort=id,desc&page=';
const AdminKhachHang = () => {
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageCount, setPageCount] = useState(0);

    useEffect(() => {
        fetchCustomers2();
    }, []);

    const exportToExcel = async () => {
        try {
            // Gọi API lấy toàn bộ dữ liệu khách hàng
            const response = await getMethod('/api/khachhang/all?size=1000');
            const result = await response.json();

            // Chuyển đổi dữ liệu thành định dạng Excel
            const worksheet = XLSX.utils.json_to_sheet(result.content); // `result.content` chứa danh sách khách hàng
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách khách hàng');

            // Tạo file Excel
            const excelBuffer = XLSX.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
            });
            const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

            // Tải xuống file Excel
            saveAs(blob, `DanhSachKhachHang.xlsx`);
            toast.success('Xuất file Excel thành công!');
        } catch (error) {
            toast.error('Lỗi khi xuất file Excel!');
            console.error('Error exporting to Excel:', error);
        }
    };
    const fetchCustomers2 = async () => {
        var response = await getMethod('/api/khachhang/all?&size=' + size + '&sort=id,desc&page=' + 0)
        var result = await response.json();
        console.log(result);
        setItems(result.content)
        setPageCount(result.totalPages)
        url = '/api/khachhang/all?&size=' + size + '&sort=id,desc&page='
    };

    // Tìm kiếm khách hàng
    const searchCustomers = async () => {
        if (!searchQuery.trim()) {
            toast.error('Bạn cần nhập thông tin bạn muốn tìm kiếm');
            return;
        }
        try {
            setLoading(true);
            const response = await getMethod(`/api/khachhang/search?hoVaTen=${searchQuery}&soDienThoai=${searchQuery}`);
            const result = await response.json();
            setItems(result);
        } catch (error) {
            toast.error('Lỗi khi tìm kiếm khách hàng!');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý khi nhấn Enter trong ô tìm kiếm
    const handleSearchKeyPress = (event) => {
        if (event.key == 'Enter') {
            searchCustomers();
        }
    };

    const handlePageClick = async (data) => {
        var currentPage = data.selected
        var response = await getMethod(url + currentPage)
        var result = await response.json();
        setItems(result.content)
        setPageCount(result.totalPages)
    }

    return (
        <>
            <div className="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong className="text-left"><i className="fa fa-users"></i> Quản lý khách hàng</strong>
                <div className="search-wrapper d-flex align-items-center">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm theo tên hoặc số điện thoại"
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleSearchKeyPress}
                    />
                    <button className="btn btn-primary ms-2" onClick={searchCustomers}>
                        <i className="fa fa-search"></i>
                    </button>
                    <a href="add-khach-hang" className="btn btn-primary ms-2">
                        <i className="fa fa-plus"></i>
                    </a>
                    <a href='#' onClick={() => exportToExcel()} class="btn btn-success ms-2">
                        <i className='fa fa-excel-o'></i>Excel</a>
                </div>
            </div>

            <div className="tablediv">
                <div className="headertable">
                    <span className="lbtable">Danh sách khách hàng</span>
                </div>
                <div className="divcontenttable">
                    {loading ? (
                        <p>Đang tải dữ liệu...</p>
                    ) : (
                        <table id="example" className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã khách hàng</th>
                                    <th>Họ tên</th>
                                    <th>Email</th>
                                    <th>Ngày sinh</th>
                                    <th>Số điện thoại</th>
                                    <th>Giới tính</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.length > 0 ? (
                                    items.map((item, index) => (
                                        <tr key={index}>
                                            {/* <td>{item.id}</td> */}
                                            <td>{index + 1}</td>
                                            <td>{item.maKhachHang}</td>
                                            <td>{item.hoVaTen}</td>
                                            <td>{item.email}</td>
                                            <td>{item.ngaySinh}</td>
                                            <td>{item.soDienThoai}</td>
                                            <td>{item.gioiTinh == 1 ? 'Nam' : 'Nữ'}</td>
                                            <td>{item.trangThai == 1 ? 'Đang hoạt động' : 'Ngưng hoạt động'}</td>
                                            <td className="sticky-col">
                                                <a href={`edit-khach-hang?id=${item.id}`} className="edit-btn">
                                                    <i className="fa fa-edit"></i> Sửa
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8">Không có dữ liệu</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminKhachHang;
