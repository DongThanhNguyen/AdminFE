import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../admin/layout.scss';

function Header({ children }) {
    const location = useLocation();

    const isActive = (pathname) => {
        for (var i = 0; i < pathname.length; i++) {
            if (location.pathname === pathname[i]) {
                return 'activenavbar';
            }
        }
        return '';
    };

    const [isCssLoaded, setCssLoaded] = useState(false);
    useEffect(() => {
        import('../admin/layout.scss').then(() => setCssLoaded(true));
    }, []);

    if (!isCssLoaded) {
        return <></>;
    }

    const usera = JSON.parse(window.localStorage.getItem("user") || "{}");

    const openClose = () => {
        document.getElementById("sidebar").classList.toggle("toggled");
        document.getElementById("page-content-wrapper").classList.toggle("toggled");
        document.getElementById("navbarmain").classList.toggle("navbarmainrom");
    };

    return (
        <div className="d-flex" id="wrapper">
            <nav id="sidebar" className="bg-dark text-white">
                <div className="sidebar-header p-3 text-white">
                    <i className="fa fa-bars pointer" id="iconbaradmin" onClick={openClose}></i>
                    ADMIN
                </div>
                <ul className="list-unstyled components">
                    <li className={isActive(["/admin/thong-ke"])}>
                        <Link to="/admin/thong-ke" className="text-white text-decoration-none">
                            <i className="fa fa-bar-chart me-2"></i> Thống kê
                        </Link>
                    </li>
                    <li className={isActive(["/admin/don-hang", "/admin/dat-tai-quay"])}>
                        <a
                            href="#colstore"
                            data-bs-toggle="collapse"
                            aria-expanded="false"
                            className="dropdown-toggle text-white text-decoration-none"
                        >
                            <i className="fa fa-list me-2"></i> Quản lý đơn hàng
                        </a>
                        <ul className="collapse list-unstyled" id="colstore">
                            <li>
                                <Link to="/admin/don-hang" className="text-white text-decoration-none ps-4">
                                    <i className="fa fa-list me-2"></i> Danh sách đơn hàng
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/dat-tai-quay" className="text-white text-decoration-none ps-4">
                                    <i className="fa fa-plus me-2"></i> Đặt hàng tại quầy
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li className={isActive(["/admin/trademark"])}>
                        <Link to="/admin/trademark" className="text-white text-decoration-none">
                            <i className="fa fa-list-alt me-2"></i> Quản lý thương hiệu
                        </Link>
                    </li>
                    <li className={isActive(["/admin/product", "/admin/add-product", "/admin/de-giay", "/admin/chat-lieu", "/admin/kich-co", "/admin/mau-sac", "/admin/sanphamchitiet"])}>
                        <a
                            href="#colproduct"
                            data-bs-toggle="collapse"
                            aria-expanded="false"
                            className="dropdown-toggle text-white text-decoration-none"
                        >
                            <i className="fa fa-shoe-prints me-2"></i> Quản lý sản phẩm
                        </a>
                        <ul className="collapse list-unstyled" id="colproduct">
                            <li>
                                <Link to="/admin/product" className="text-white text-decoration-none ps-4">
                                    <i className="fa fa-list me-2"></i> Danh sách sản phẩm
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/de-giay" className="text-white text-decoration-none ps-4">
                                    <i className="fa fa-list me-2"></i> Đế giày
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/chat-lieu" className="text-white text-decoration-none ps-4">
                                    <i className="fa fa-list me-2"></i> Chất liệu
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/kich-co" className="text-white text-decoration-none ps-4">
                                    <i className="fa fa-list me-2"></i> Kích cỡ
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/mau-sac" className="text-white text-decoration-none ps-4">
                                    <i className="fa fa-list me-2"></i> Màu sắc
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/add-product" className="text-white text-decoration-none ps-4">
                                    <i className="fa fa-plus me-2"></i> Thêm sản phẩm
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li className={isActive(["/admin/khuyen-mai", "/admin/add-khuyen-mai"])}>
                        <a
                            href="#colkhuyenmai"
                            data-bs-toggle="collapse"
                            aria-expanded="false"
                            className="dropdown-toggle text-white text-decoration-none"
                        >
                            <i className="fa fa-percent me-2"></i> Quản lý khuyến mại
                        </a>
                        <ul className="collapse list-unstyled" id="colkhuyenmai">
                            <li>
                                <Link to="/admin/khuyen-mai" className="text-white text-decoration-none ps-4">
                                    <i className="fa fa-list me-2"></i> Danh sách phiếu giảm giá
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/add-khuyen-mai" className="text-white text-decoration-none ps-4">
                                    <i className="fa fa-plus me-2"></i> Thêm phiếu giảm giá
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/dot-giam-gia" className="text-white text-decoration-none ps-4">
                                    <i className="fa fa-list me-2"></i> Đợt giảm giá
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/add-dot-giam-gia" className="text-white text-decoration-none ps-4">
                                    <i className="fa fa-plus me-2"></i> Thêm đợt giảm giá
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li className={isActive(["/admin/user", "/admin/khach-hang"])}>
                        <a
                            href="#colaccount"
                            data-bs-toggle="collapse"
                            aria-expanded="false"
                            className="dropdown-toggle text-white text-decoration-none"
                        >
                            <i className="fa fa-user-circle me-2"></i> Quản lý tài khoản
                        </a>
                        <ul className="collapse list-unstyled" id="colaccount">
                            <li>
                                <Link to="/admin/user" className="text-white text-decoration-none ps-4">
                                    <i className="fa fa-users me-2"></i> Nhân viên
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/khach-hang" className="text-white text-decoration-none ps-4">
                                    <i className="fa fa-users me-2"></i> Khách hàng
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" onClick={logout} className="text-white text-decoration-none">
                            <i className="fa fa-sign-out me-2"></i> Logout
                        </a>
                    
                    </li>
                </ul>
            </nav>
            <div id="page-content-wrapper" class="w-100">
            <nav id='navbarmain' class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
                <div class="container-fluid">
                    <button class="btn btn-link" id="menu-toggle"><i class="fas fa-bars" onClick={openClose}></i></button>
                    <div class="dropdown ms-auto">
                    </div>
            
                    <div class="dropdown ms-3">
                        <a class="dropdown-toggle d-flex align-items-center text-decoration-none" href="#" role="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                         <span class="navbar-text me-2">Hello: {usera?.email}</span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                            <li onClick={logout}><a class="dropdown-item" href="#">Logout</a></li>
    
                        </ul>
                    </div>
                </div>
            </nav>
            <div class="container-fluid py-4" id='mainpageadmin'>
                {children}
            </div>
        </div>
    </div>
    );
}


function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace('../login');
}

export default Header;
