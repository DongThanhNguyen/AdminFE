import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { getMethod, postMethodPayload, deleteMethod } from '../../services/request';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';


var size = 5
var url = '/api/nhan-vien/all?&size=' + size + '&sort=id,desc&page=';
const AdminUser = () => {
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageCount, setPageCount] = useState(0);

    useEffect(() => {
        getUser2();
    }, []);

    const exportToExcel = async () => {
        try {
            // Gọi API lấy toàn bộ dữ liệu nhân viên
            const response = await getMethod('/api/nhan-vien/all?size=1000');
            const result = await response.json();

            // Chuyển đổi dữ liệu thành định dạng Excel
            const worksheet = XLSX.utils.json_to_sheet(result.content); // `result.content` chứa danh sách nhân viên
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách nhân viên');

            // Tạo file Excel
            const excelBuffer = XLSX.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
            });
            const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

            // Tải xuống file Excel
            saveAs(blob, `DanhSachNhanVien.xlsx`);
            toast.success('Xuất file Excel thành công!');
        } catch (error) {
            toast.error('Lỗi khi xuất file Excel!');
            console.error('Error exporting to Excel:', error);
        }
    };

    const getUser = async () => {
        setLoading(true);
        try {
            const response = await getMethod('/api/nhan-vien');
            const result = await response.json();
            setItems(result);
        } catch (error) {
            toast.error('Lỗi khi tải dữ liệu!');
        } finally {
            setLoading(false);
        }
    };
    const getUser2 = async () => {
        var response = await getMethod('/api/nhan-vien/all?&size=' + size + '&sort=id,desc&page=' + 0)
        var result = await response.json();
        console.log(result);
        setItems(result.content)
        setPageCount(result.totalPages)
        url = '/api/nhan-vien/all?&size=' + size + '&sort=id,desc&page='
    };

    const searchUsers = async () => {
        if (!searchQuery.trim()) {
            toast.error('Bạn cần nhập thông tin bạn muốn tìm kiếm');
            return;
        }
        try {
            setLoading(true);
            const response = await getMethod(`/api/nhan-vien/search?hoVaTen=${searchQuery}&soDienThoai=${searchQuery}`);
            const result = await response.json();
            setItems(result);
        } catch (error) {
            toast.error('Lỗi khi tìm kiếm nhân viên!');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchKeyPress = (event) => {
        if (event.key === 'Enter') {
            searchUsers();
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
                <strong className="text-left"><i className="fa fa-users"></i> Quản lý nhân viên</strong>
                <div className="search-wrapper d-flex align-items-center">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm theo tên hoặc số điện thoại"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleSearchKeyPress}
                    />
                    <button className="btn btn-primary ms-2" onClick={searchUsers}>
                        <i className="fa fa-search"></i>
                    </button>
                    <a href="add-nhan-vien" className="btn btn-primary ms-2">
                        <i className="fa fa-plus"></i>
                    </a>
                    <a href="#" onClick={() => exportToExcel()} className="btn btn-success ms-2">
                        <i className="fa fa-excel-o"></i>Excel
                    </a>
                </div>
            </div>
            <div className="tablediv">
                <div className="headertable">
                    <span className="lbtable">Danh sách tài khoản</span>
                </div>
                <div className="divcontenttable">
                    {loading ? (
                        <p>Đang tải dữ liệu...</p>
                    ) : (
                        <table id="example" className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Ảnh</th>
                                    <th>Mã nhân viên</th>
                                    <th>Họ tên</th>
                                    <th>Ngày sinh</th>
                                    <th>Số điện thoại</th>
                                    <th>Email</th>
                                    <th>Vai trò</th>
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
                                            <td><img src={item.anh} className='imgtable' /></td>
                                            <td>{item.maNhanVien}</td>
                                            <td>{item.hoVaTen}</td>
                                            <td>{item.ngaySinh}</td>
                                            <td>{item.soDienThoai}</td>
                                            <td>{item.email}</td>
                                            <td>{item.vaiTro == 1 ? 'ADMIN' : 'Nhân viên'}</td>
                                            <td>{item.trangThai == 1 ? 'Đang làm việc' : 'Nghỉ việc'}</td>
                                            <td className="sticky-col">
                                                <a href={'edit-nhan-vien?id=' + item.id}
                                                    className="edit-btn">
                                                    <i className="fa fa-edit"></i> Sửa</a>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10">Không có dữ liệu</td>
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

export default AdminUser;
