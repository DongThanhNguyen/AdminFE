import layoutAdmin from "../layout/admin/Layout";
import layoutNhanVien from "../layout/nhanvien/Layout";

//admin
import AdminUser from '../page/admin/user'
import AdminTrademark from '../page/admin/trademark'
import AdminProduct from '../page/admin/product'
import AdminAddProduct from '../page/admin/addproduct'
import AdminInvoice from '../page/admin/order'
import AdminAddNhanVien from '../page/admin/addnhanvien'
import AdminEditKhachHang from '../page/admin/editkhachhang'
import AdminEditNhanVien from '../page/admin/editnhanvien'
import AdminAddKhachHang from '../page/admin/addkhachhang'
import AdminDeGiay from '../page/admin/degiay'
import AdminChatLieu from '../page/admin/chatlieu'
import AdminKichCo from '../page/admin/kichco'
import AdminMauSac from '../page/admin/mausac'
import AdminSanPhamChiTiet from '../page/admin/sanphamchitiet'
import AdminDonHang from '../page/admin/donhang'
import AdminPhieuGiamGia from '../page/admin/phieugiamgia'
import AdminAddPhieuGiamGia from '../page/admin/addphieugiamgia'
import AdminDatTaiQuay from '../page/admin/dattaiquay'
import AdminThongKe from '../page/admin/thongke'
import AdminKhachHang from '../page/admin/khachhang'
import AdminDotGiamGia from '../page/admin/dotgiamgia'
import AdminAddDotGiamGia from '../page/admin/adddotgiamgia'
import AdminUpdateDotGiamGia from '../page/admin/updatedotgiamgia'

//nhanvien
import EmployeeTrademark from '../page/nhanvien/trademark'
import EmployeeProduct from '../page/nhanvien/product'
import EmployeeAddProduct from '../page/nhanvien/addproduct'
import EmployeeInvoice from '../page/nhanvien/order'
import EmployeeDeGiay from '../page/nhanvien/degiay'
import EmployeeChatLieu from '../page/nhanvien/chatlieu'
import EmployeeKichCo from '../page/nhanvien/kichco'
import EmployeeMauSac from '../page/nhanvien/mausac'
import EmployeeSanPhamChiTiet from '../page/nhanvien/sanphamchitiet'
import EmployeeDonHang from '../page/nhanvien/donhang'
import EmployeeDatTaiQuay from '../page/nhanvien/dattaiquay'
import EmployeekhachHang from '../page/nhanvien/khachhang'
import EmployeeAddKhachHang from '../page/nhanvien/addkhachhang'
import EmployeeEditKhachHang from '../page/nhanvien/editkhachhang'

//public
import LoginPage from "../page/public/LoginPage";
import QuenMatKhau from '../page/public/quenmatkhau'

const publicRoutes = [
    {path: "/", component: LoginPage},
    {path: "/login", component: LoginPage},
    {path: "/forgot", component: QuenMatKhau},
];

const adminRoutes = [
    // { path: "/admin/index", component: homeAdmin, layout: layoutAdmin },
    { path: "/admin/edit-nhan-vien", component: AdminEditNhanVien, layout: layoutAdmin },
    { path: "/admin/user", component: AdminUser, layout: layoutAdmin },
    { path: "/admin/trademark", component: AdminTrademark, layout: layoutAdmin },
    { path: "/admin/product", component: AdminProduct, layout: layoutAdmin },
    { path: "/admin/add-product", component: AdminAddProduct, layout: layoutAdmin },
    { path: "/admin/order", component: AdminInvoice, layout: layoutAdmin },
    { path: "/admin/add-nhan-vien", component: AdminAddNhanVien, layout: layoutAdmin },
    { path: "/admin/edit-nhan-vien", component: AdminEditNhanVien, layout: layoutAdmin },
    { path: "/admin/add-khach-hang", component: AdminAddKhachHang, layout: layoutAdmin },
    { path: "/admin/edit-khach-hang", component: AdminEditKhachHang, layout: layoutAdmin },
    { path: "/admin/de-giay", component: AdminDeGiay, layout: layoutAdmin },
    { path: "/admin/chat-lieu", component: AdminChatLieu, layout: layoutAdmin },
    { path: "/admin/kich-co", component: AdminKichCo, layout: layoutAdmin },
    { path: "/admin/mau-sac", component: AdminMauSac, layout: layoutAdmin },
    { path: "/admin/sanphamchitiet", component: AdminSanPhamChiTiet, layout: layoutAdmin },
    { path: "/admin/don-hang", component: AdminDonHang, layout: layoutAdmin },
    { path: "/admin/khuyen-mai", component: AdminPhieuGiamGia, layout: layoutAdmin },
    { path: "/admin/add-khuyen-mai", component: AdminAddPhieuGiamGia, layout: layoutAdmin },
    { path: "/admin/dat-tai-quay", component: AdminDatTaiQuay, layout: layoutAdmin },
    { path: "/admin/thong-ke", component: AdminThongKe, layout: layoutAdmin },
    { path: "/admin/khach-hang", component: AdminKhachHang, layout: layoutAdmin },
    { path: "/admin/dot-giam-gia", component: AdminDotGiamGia, layout: layoutAdmin },
    { path: "/admin/add-dot-giam-gia", component: AdminAddDotGiamGia, layout: layoutAdmin },
    { path: "/admin/update-dot-giam-gia", component: AdminUpdateDotGiamGia, layout: layoutAdmin },
];

const nhanvienRoutes = [
    { path: "/nhanvien/trademark", component: EmployeeTrademark, layout: layoutNhanVien },
    { path: "/nhanvien/product", component: EmployeeProduct, layout: layoutNhanVien },
    { path: "/nhanvien/add-product", component: EmployeeAddProduct, layout: layoutNhanVien },
    { path: "/nhanvien/order", component: EmployeeInvoice, layout: layoutNhanVien },
    { path: "/nhanvien/de-giay", component: EmployeeDeGiay, layout: layoutNhanVien },
    { path: "/nhanvien/chat-lieu", component: EmployeeChatLieu, layout: layoutNhanVien },
    { path: "/nhanvien/kich-co", component: EmployeeKichCo, layout: layoutNhanVien },
    { path: "/nhanvien/mau-sac", component: EmployeeMauSac, layout: layoutNhanVien },
    { path: "/nhanvien/sanphamchitiet", component: EmployeeSanPhamChiTiet, layout: layoutNhanVien },
    { path: "/nhanvien/don-hang", component: EmployeeDonHang, layout: layoutNhanVien },
    { path: "/nhanvien/dat-tai-quay", component: EmployeeDatTaiQuay, layout: layoutNhanVien },
    { path: "/nhanvien/khach-hang", component: EmployeekhachHang, layout: layoutNhanVien },
    { path: "/nhanvien/add-khach-hang", component: EmployeeAddKhachHang, layout: layoutNhanVien },
    { path: "/nhanvien/edit-khach-hang", component: EmployeeEditKhachHang, layout: layoutNhanVien }
];




export {publicRoutes, adminRoutes,nhanvienRoutes};
