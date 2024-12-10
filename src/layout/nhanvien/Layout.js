import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom';
function Header({ children }){
     // Ensure useLocation is called at the top level of the component
     const location = useLocation();

     // Function to check if the current path matches the given pathname
     const isActive = (pathname) => {
         for(var i=0; i<pathname.length; i++){
            if(location.pathname === pathname[i]){
                return 'activenavbar';
            }
         }
         return '';
     };

     
    const [isCssLoaded, setCssLoaded] = useState(false);
    useEffect(()=>{
        import('../admin/layout.scss').then(() => setCssLoaded(true));
    }, []);
    if (!isCssLoaded) {
        return <></>
    }
    var usera = window.localStorage.getItem("user")
    if(usera != null){
        usera = JSON.parse(usera);
        console.log(usera);
        
    }
    function openClose(){
        document.getElementById("sidebar").classList.toggle("toggled");
        document.getElementById("page-content-wrapper").classList.toggle("toggled");
        document.getElementById("navbarmain").classList.toggle("navbarmainrom");
    }

    return(
    <div class="d-flex" id="wrapper">
        <nav id="sidebar">
            <div class="sidebar-header p-3 text-white">
            <i class="fa fa-bars pointer" id="iconbaradmin" onClick={openClose}></i>
            NHÂN VIÊN
            </div>
            <ul class="list-unstyled components">
                <li className={isActive(["/nhanvien/trademark"])}>
                    <a href="trademark" class="text-white text-decoration-none">
                        <i class="fa fa-list"></i> Quản lý thương hiệu
                    </a>
                </li>
                <li className={isActive(["/nhanvien/product", "/nhanvien/add-product","/nhanvien/de-giay", "/nhanvien/chat-lieu", "/nhanvien/kich-co","/nhanvien/mau-sac","/nhanvien/sanphamchitiet"])}>
                    <a href="#colproduct" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle text-white text-decoration-none">
                        <i class="fa fa-t-shirt"></i> Quản lý sản phẩm
                    </a>
                    <ul class="collapse list-unstyleds" id="colproduct">
                        <li class="nav-item">
                            <a href="product" class="text-white text-decoration-none ps-4"><i class="fa fa-list"></i> Danh sách sản phẩm</a>
                        </li>
                        <li class="nav-item">
                            <a href="de-giay" class="text-white text-decoration-none ps-4"><i class="fa fa-list"></i> Đế giày</a>
                        </li>
                        <li class="nav-item">
                            <a href="chat-lieu" class="text-white text-decoration-none ps-4"><i class="fa fa-list"></i> Chất liệu</a>
                        </li>
                        <li class="nav-item">
                            <a href="kich-co" class="text-white text-decoration-none ps-4"><i class="fa fa-list"></i> Kích cỡ</a>
                        </li>
                        <li class="nav-item">
                            <a href="mau-sac" class="text-white text-decoration-none ps-4"><i class="fa fa-list"></i> Màu sắc</a>
                        </li>
                        <li class="nav-item">
                            <a href="add-product" class="text-white text-decoration-none ps-4"><i class="fa fa-plus"></i> Thêm sản phẩm</a>
                        </li>
                    </ul>
                </li>
                <li className={isActive(["/nhanvien/don-hang", "/nhanvien/dat-tai-quay"])}>
                    <a href="#colstore" data-bs-toggle="collapse" aria-expanded="false" class="dropdown-toggle text-white text-decoration-none">
                        <i class="fa fa-list"></i> Quản lý đơn hàng
                    </a>
                    <ul class="collapse list-unstyleds" id="colstore">
                        <li class="nav-item">
                            <a href="don-hang" class="text-white text-decoration-none ps-4"><i class="fa fa-list"></i> Danh sách đơn hàng</a>
                        </li>
                        <li class="nav-item">
                            <a href="dat-tai-quay" class="text-white text-decoration-none ps-4"><i class="fa fa-plus"></i> Đặt hàng tại quầy</a>
                        </li>
                    </ul>
                </li>
                <li className={isActive(["/nhanvien/khach-hang"])}>
                    <a href="khach-hang" class="text-white text-decoration-none">
                        <i class="fa fa-users"></i> Khách hàng
                    </a>
                </li>
                <li>
                    <a href="#" onClick={logout} class="text-white text-decoration-none">
                        <i class="fa fa-sign-out"></i> Logout
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

async function checkAdmin(){
    var token = localStorage.getItem("token");
    var url = 'http://localhost:8080/api/nhanvien/check-role-admin';
    const response = await fetch(url, {
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status > 300) {
        window.location.replace('../login')
    }
}


function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace('../login')
}

export default Header;