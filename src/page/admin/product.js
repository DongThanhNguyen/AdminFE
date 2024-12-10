import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod, deleteMethod ,uploadSingleFile} from '../../services/request';
import Swal from 'sweetalert2';
import { formatMoney } from '../../services/money';
import * as XLSX from "xlsx";
import { saveAs } from 'file-saver';


var size = 5
var url = '/api/san-pham/public/all?&size='+size+'&sort=id,desc&page=';
const AdminProduct = ()=>{
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    useEffect(()=>{
        getProduct1(currentPage);
    }, [currentPage]);

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(items);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, `DanhSachSanPham.xlsx`);
    };
    async function getProduct() {
        const response = await getMethod('/api/san-pham');
        let result = await response.json();
        if (searchTerm.trim() !== '') {
            result = result.filter(item =>
                item.tenKichCo.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setItems(result);
    }

    const getProduct1 = async() =>{
        var response = await getMethod('/api/san-pham/public/all?&size='+size+'&sort=id,desc&page='+0)
        var result = await response.json();
        console.log(result);
        setItems(result.content)
        setPageCount(result.totalPages)
        url = '/api/san-pham/public/all?&size='+size+'&sort=id,desc&page='
    };

    async function deleteProduct(id){
        Swal.fire({
            title: "Xác nhận xóa",
            text: "Bạn có chắc chắn muốn xóa mục này không?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await deleteMethod('/api/san-pham/' + id);  // Cập nhật lại đường dẫn API nếu cần
                if (response.status < 300) {
                    toast.success("Xóa thành công!");
                    getProduct();  // Cập nhật lại hàm lấy dữ liệu nếu cần
                } else if (response.status === 417) {
                    const result = await response.json();
                    toast.warning(result.defaultMessage);
                } else {
                    toast.warning("Xóa thất bại");
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                console.log("Hủy thao tác xóa.");
            }
        });
    }
    function handleShowAllClick() {
        setSearchTerm(''); // Đặt lại từ khóa tìm kiếm
        setCurrentPage(0);
        getProduct1(); // Lấy lại toàn bộ dữ liệu
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
            <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-list'></i> Quản Lý Sản Phẩm</strong>
                <div class="search-wrapper d-flex align-items-center">
                    <div class="search-container">
                    </div>
                    <button className="btn btn-secondary ms-2" onClick={handleShowAllClick}>
                        <i className="fa fa-list"></i> Làm mới
                    </button>
                    <a href='add-product' class="btn btn-primary ms-2"><i className='fa fa-plus'></i></a>
                    <a href='#' onClick={() => exportToExcel()} className="btn btn-success ms-2">
                        <i className='fa fa-excel-o'></i>Excel</a>
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
                            <th>STT</th>
                            <th>Ảnh</th>
                            <th>Mã sản phẩm</th>
                            <th>Tên sản phẩm</th>
                            {/*<th>Giá bán</th>*/}
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
                        {items.map(((item, index) => {
                            const stt = currentPage * size + index + 1;
                            return <tr>
                                <td>{stt}</td>
                                <td><img src={item.anh} className='imgtable'/></td>
                                <td>{item.maSanPham}</td>
                                <td>{item.tenSanPham}</td>
                                {/*<td>{item.giaBan}</td>*/}
                                <td>{item.thuongHieu?.tenThuongHieu}</td>
                                <td>{item.chatLieu?.tenChatLieu}</td>
                                <td>{item.deGiay?.tenDeGiay}</td>
                                <td>{item.ngayTao}</td>
                                <td>{item.nguoiTao}</td>
                                <td>{item.nguoiCapNhat}</td>
                                <td class="sticky-col">
                                    <a href={"add-product?id=" + item.id} class="edit-btn"><i
                                        className='fa fa-edit'></i></a>
                                    <a target='_blank' href={"sanphamchitiet?sanpham=" + item.id}
                                       class="edit-btn"><i className='fa fa-eye'></i></a>
                                    <button onClick={() => deleteProduct(item.id)} class="delete-btn"><i
                                        className='fa fa-trash'></i></button>
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

        </>
    );
}

export default AdminProduct;