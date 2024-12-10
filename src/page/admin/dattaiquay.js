import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getMethod,
  deleteMethod,
  postMethodPayload,
  postMethod,
} from "../../services/request";
import Swal from "sweetalert2";
import Select from "react-select";
import giotrong from "../../assest/images/giotrong.png";
import nodata from "../../assest/images/nodata.png";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { formatMoney } from "../../services/money";
import { Modal, Button } from "react-bootstrap";
import { Nav } from "react-bootstrap"; // Import Nav
import { FaTimesCircle, FaCreditCard } from "react-icons/fa";
import { InputGroup, Form } from "react-bootstrap";

const AdminDatTaiQuay = () => {
  const [hoaDonCho, sethoaDonCho] = useState([]);
  const [khachHang, setKhachHang] = useState([]);
  const [chiTietSanPham, setChiTietSanPham] = useState([]);
  const [selectHoaDonCho, setSelectHoaDonCho] = useState(null);
  const [selectKhachHang, setselectKhachHang] = useState({
    id: -1,
    hoVaTen: "Khách lẻ",
    soDienThoai: "",
  });

  const [soTienThanhToan, setSoTienThanhToan] = useState(0); // Khởi tạo số tiền thanh toán mặc định là 0
  const [tienThua, setTienThua] = useState(0); // Khởi tạo tiền thừa mặc định là 0
  const [showModal, setShowModal] = useState(false); // Hiển thị modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hoaDonToDelete, setHoaDonToDelete] = useState(null);

  const handleShowDeleteModal = (hoaDonId) => {
    setHoaDonToDelete(hoaDonId);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setHoaDonToDelete(null);
  };

  const [selectDotGiamGia, setSelecDotGiamGia] = useState({});
  const [dotGiamGia, setdotGiamGia] = useState({});

  const [thuongHieu, setThuongHieu] = useState([]);
  const [deGiay, setDeGiay] = useState([]);
  const [chatlieu, setChatLieu] = useState([]);
  const [kichThuoc, setKichThuoc] = useState([]);
  const [mauSac, setMauSac] = useState([]);

  const [selectThuongHieu, setselectThuongHieu] = useState(null);
  const [selectDeGiay, setselectDeGiay] = useState(null);
  const [selectChatlieu, setselectChatlieu] = useState(null);
  const [selectkichThuoc, setselectkichThuoc] = useState(null);
  const [selectmauSac, setselectmauSac] = useState(null);
  const [tongTien, setTongTien] = useState(0);
  const [tongTienNew, setTongTienNew] = useState(0);
  // Khai báo state cho searchKeyword
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredSanPham, setFilteredSanPham] = useState([]); // Sản phẩm đã lọc

  // useEffect để lọc sản phẩm khi searchKeyword thay đổi
  useEffect(() => {
    const filtered = chiTietSanPham.filter(
      (item) =>
        item.sanPham?.tenSanPham
          ?.toLowerCase()
          .includes(searchKeyword.toLowerCase()) // So khớp từ khóa tìm kiếm
    );
    setFilteredSanPham(filtered); // Cập nhật danh sách đã lọc
  }, [searchKeyword, chiTietSanPham]);

  const resetFilters = () => {
    setselectThuongHieu(null);
    setselectChatlieu(null);
    setselectDeGiay(null);
    setselectmauSac(null);
    setselectkichThuoc(null);
    setSearchKeyword("");
  };

  useEffect(() => {
    getHoaDonCho();
    getKhachHang();
    getSelect();
    getChiTietSanPham();
  }, []);

  useEffect(() => {
    if (hoaDonCho.length != 0) {
      let id = document.getElementById("an");
      id.style.display = "block";
      let anh = document.getElementById("anh");
      anh.style.display = "none";
    } else {
      let id = document.getElementById("an");
      id.style.display = "none";
      let anh = document.getElementById("anh");
      anh.style.display = "block";
    }
  }, [hoaDonCho]);

  async function getSelect() {
    var response = await getMethod("/api/thuong-hieu");
    setThuongHieu(await response.json());
    var response = await getMethod("/api/de-giay");
    setDeGiay(await response.json());
    var response = await getMethod("/api/chat-lieu");
    setChatLieu(await response.json());
    var response = await getMethod("/api/kich-co");
    setKichThuoc(await response.json());
    var response = await getMethod("/api/mau-sac");
    setMauSac(await response.json());
  }

  async function getHoaDonCho() {
    var response = await getMethod("/api/v1/hoa-don/hoa-don-cho");
    var list = await response.json();
    sethoaDonCho(list);
    if (list.length > 0) {
      loadChiTietHdCho(list[0]);
    }
  }

  const [orders, setOrders] = useState([]); // Lưu danh sách hóa đơn
  const [activeOrder, setActiveOrder] = useState(null); // Hóa đơn hiện tại

  async function taoHoaDonCho() {
    var res = await postMethod("/api/v1/hoa-don/tao-hoa-don-cho");

    if (res.status < 300) {
      // Thêm hóa đơn vào danh sách sau khi tạo thành công
      if (orders.length < 5) {
        const newOrder = {
          id: `order${orders.length + 1}`,
          name: `Đơn hàng ${orders.length + 1}`,
        };

        // Cập nhật state orders bằng cách sử dụng callback để đảm bảo trạng thái đúng
        setOrders((prevOrders) => {
          const updatedOrders = [...prevOrders, newOrder]; // Tạo danh sách mới với đơn hàng mới
          setActiveOrder(newOrder.id); // Đặt hóa đơn hiện tại
          return updatedOrders;
        });

        // Hiển thị thông báo thành công và reload lại trang
        Swal.fire({
          title: "Thông báo",
          text: "Tạo hóa đơn chờ thành công!",
          icon: "success",
        }).then(() => {
          // Tải lại trang sau khi tạo hóa đơn
          window.location.reload();
        });
      } else {
        toast.warn("Tối đa 5 hoá đơn");
      }
    } else if (res.status === 417) {
      // Xử lý lỗi khi tạo hóa đơn
      const result = await res.json();
      toast.warning(result.defaultMessage); // Hiển thị thông báo lỗi
    }
  }

  async function deleteHoaDon() {
    if (!hoaDonToDelete) return;

    const response = await deleteMethod(
      "/api/v1/hoa-don/xoa-don-cho?idHoaDon=" + hoaDonToDelete
    );
    if (response.status < 300) {
      toast.success("Xóa thành công!");
      window.location.reload();
    } else if (response.status === 417) {
      const result = await response.json();
      toast.warning(result.defaultMessage);
    }

    handleCloseDeleteModal();
  }

  async function loadDotGiamGia(hoadoncho) {
    var response = await getMethod("/api/phieu-giam-gia");
    var result = await response.json();
    var response = await getMethod("/api/v1/hoa-don/hoa-don-cho");
    var list = await response.json();

    setdotGiamGia(result.filter((x) => x.trangThai === 1));
    if (selectHoaDonCho == null) {
      if (list.length > 0) {
        if (list[0].phieuGiamGia != null) {
          setSelecDotGiamGia(list[0].phieuGiamGia);
        } else setSelecDotGiamGia(result[0]);
      }
    }
    if (hoadoncho != null) {
      if (hoadoncho != null) {
        if (hoadoncho.phieuGiamGia != null) {
          setSelecDotGiamGia(hoadoncho.phieuGiamGia);
        } else setSelecDotGiamGia(result[0]);
      }
    }
  }

  async function loadChiTietHdCho(item) {
    var response = await getMethod("/api/v1/hoa-don/find-by-id?id=" + item.id);
    var result = await response.json();
    setSelectHoaDonCho(result);
    if (result.khachHang != null) setselectKhachHang(result.khachHang);
    else setselectKhachHang({ id: -1, hoVaTen: "Khách lẻ", soDienThoai: "" });
    var tong = 0;
    for (var i = 0; i < result.hoaDonChiTiets.length; i++) {
      tong =
        Number(tong) +
        Number(
          result.hoaDonChiTiets[i].soLuong * result.hoaDonChiTiets[i].giaSanPham
        );
    }
    loadDotGiamGia(result);
    setTongTienNew(tong);
    setTongTien(tong);
  }

  async function getKhachHang() {
    loadDotGiamGia();

    var response = await getMethod("/api/khachhang");
    var list = await response.json();
    var arr = [{ id: -1, hoVaTen: "Khách lẻ", soDienThoai: "" }];
    arr = arr.concat(list);
    setKhachHang(arr);
  }

  async function CapNhatKhachHang() {
    var res = await postMethod(
      "/api/v1/hoa-don/cap-nhat-khach-hang?idKhachHang=" +
        selectKhachHang.id +
        "&idHoaDon=" +
        selectHoaDonCho.id
    );
    if (res.status < 300) {
      toast.success("Cập nhật khách hàng thành công");
      // var result = await res.json();
      loadChiTietHdCho(selectHoaDonCho);
    } else {
      toast.error("Thất bại");
    }
  }

  async function getChiTietSanPham() {
    var payload = {
      thuongHieuId: selectThuongHieu == null ? null : selectThuongHieu.id,
      chatLieuId: selectChatlieu == null ? null : selectChatlieu.id,
      deGiayId: selectDeGiay == null ? null : selectDeGiay.id,
      mauSacId: selectmauSac == null ? null : selectmauSac.id,
      kichThuocId: selectkichThuoc == null ? null : selectkichThuoc.id,
    };
    var response = await postMethodPayload(
      "/api/san-pham-chi-tiet/public/loc-chi-tiet-san-pham-list",
      payload
    );
    setChiTietSanPham(await response.json());
  }

  async function handleAddChiTietHoaDon(event) {
    event.preventDefault();
    var soluong = event.target.elements.soluong.value;
    var chitietsp = event.target.elements.chitietsp.value;
    const res = await postMethod(
      "/api/hoa-don-chi-tiet/them-vao-hoa-don?hoaDonId=" +
        selectHoaDonCho.id +
        "&chiTietSp=" +
        chitietsp +
        "&soLuong=" +
        soluong
    );
    if (res.status < 300) {
      toast.success("Thành công!");
      loadChiTietHdCho(selectHoaDonCho);
    }
    if (res.status == 417) {
      var result = await res.json();
      toast.error(result.defaultMessage);
    }
  }

  async function deleteChiTiet(id) {
    const response = await deleteMethod(
      "/api/hoa-don-chi-tiet/xoa-chi-tiet-don-cho?id=" + id
    );
    if (response.status < 300) {
      setSoTienThanhToan(0);
      setTienThua(0);
      toast.success("Xóa thành công!");
      loadChiTietHdCho(selectHoaDonCho);
    }
    if (response.status == 417) {
      var result = await response.json();
      toast.warning(result.defaultMessage);
    }
  }

  async function xacNhanDat() {
    var con = window.confirm("Xác nhận, hành động không thể quay lại?");
    if (con == false) {
      return;
    }

    const response = await postMethod(
      "/api/v1/hoa-don/xac-nhan-dat-tai-quay?idHoaDon=" + selectHoaDonCho.id
    );
    const response2 = await postMethod(
      "/api/v1/hoa-don/cap-nhat-phieu-giam-gia?idPGG=" +
        selectDotGiamGia.id +
        "&idHoaDon=" +
        selectHoaDonCho.id
    );
    if (response2.status < 300) {
      Swal.fire({
        title: "Thông báo",
        text: "Thành công!",
        preConfirm: () => {
          window.location.reload();
        },
      });
    }
    if (response2.status == 417) {
      toast.error(
        "Phiếu giảm giá đã hết hiệu lực vui lòng chọn phiếu giảm giá khác"
      );
      return;
      // var result = await response.json()
      // toast.warning(result.defaultMessage);
    }

    if (response.status < 300) {
      Swal.fire({
        title: "Thông báo",
        text: "Thành công!",
        preConfirm: () => {
          window.location.reload();
        },
      });
    }
    if (response.status == 417) {
      var result = await response.json();
      toast.warning(result.defaultMessage);
    }
  }

  async function change_value(quality, hdct) {
    const response = await postMethod(
      "/api/hoa-don-chi-tiet/updateSoLuong?id=" + hdct + "&soLuong=" + quality
    );
    if (response.status < 300) {
      Swal.fire({
        title: "Thông báo",
        text: "Thành công!",
        preConfirm: () => {
          window.location.reload();
        },
      });
    }
    if (response.status == 417) {
      var result = await response.json();
      toast.warning(result.defaultMessage);
    }
  }

  async function change_value_enter(quality, hdct, sl_old) {
    const response = await postMethod(
      "/api/hoa-don-chi-tiet/updateSoLuongEnter?id=" +
        hdct +
        "&soLuong=" +
        quality +
        "&slold=" +
        sl_old
    );
    if (response.status < 300) {
      Swal.fire({
        title: "Thông báo",
        text: "Thành công!",
        preConfirm: () => {
          window.location.reload();
        },
      });
    }
    if (response.status == 417) {
      var result = await response.json();
      toast.warning(result.defaultMessage);
    }
  }

  function handleIncrease(quality, hdct) {
    let quality_sp = document.getElementById("quality").value;

    if (Number(quality_sp) + Number(quality) === 0) {
      deleteChiTiet(hdct);
      return;
    }
    change_value(quality, hdct);
  }

  function handleDecrease(quality, hdct, sl) {
    let quality_sp = document.getElementById("quality").value;
    if (quality_sp > sl) {
      toast.warning("so luong khong du");
      return;
    }
    change_value(quality, hdct);
  }

  function change_dotGiamGia(e) {
    setSelecDotGiamGia(e);
    capNhapPhieuGiamGia(e);
  }

  async function capNhapPhieuGiamGia(phigg) {
    if (selectHoaDonCho !== null) {
      let tongt = selectHoaDonCho.hoaDonChiTiets.reduce(
        (tong, sanPham) => tong + sanPham.giaSanPham * sanPham.soLuong,
        0
      );
      let pgg = phigg;
      if (selectHoaDonCho.hoaDonChiTiets != null) {
        if (tongt >= pgg.donToiThieu) {
          if (pgg.loaiPhieu) {
            console.log("if");

            setTongTien(tongt - Number(pgg.giaTriGiamToiDa));
          } else {
            console.log("else");

            let tong_tien_toi_da = tongt * (pgg.giaTriGiam / 100);
            let tong_tien =
              tong_tien_toi_da > pgg.giaTriGiamToiDa
                ? tongt - pgg.giaTriGiamToiDa
                : tongt - tong_tien_toi_da;
            setTongTien(tong_tien);
          }
        }
        const response2 = await postMethod(
          "/api/v1/hoa-don/cap-nhat-phieu-giam-gia-hd?idPGG=" +
            phigg.id +
            "&idHoaDon=" +
            selectHoaDonCho.id
        );
      }
    } else {
      toast.error("Vui lòng chọn hóa đơn để cập nhật phiếu giảm giá");
    }
  }

  const [paymentMethod, setPaymentMethod] = useState(""); // Phương thức thanh toán
  const [soTienKhachDua, setSoTienKhachDua] = useState(0); // Tiền khách đưa
  // Tính tiền thiếu
  const tienThieu =
    tongTien - (soTienKhachDua ? parseInt(soTienKhachDua, 10) : 0);

  const handleConfirmPayment = () => {
    // Kiểm tra nếu có tiền khách đưa
    if (soTienKhachDua > 0) {
      // Cập nhật số tiền thanh toán
      setSoTienThanhToan(soTienKhachDua);

      // Tính toán tiền thừa
      const tienThuaTinh = soTienKhachDua - tongTien;
      setTienThua(tienThuaTinh > 0 ? tienThuaTinh : 0); // Nếu tiền thừa > 0 thì cập nhật, nếu không thì không có tiền thừa
    }
    // Đóng modal sau khi xác nhận
    setShowModal(false);
  };

  async function reset() {
    tienThua = "0";
    soTienThanhToan = "0";
  }

  return (
    <div style={{ marginBottom: "150px" }}>
      {/* Header */}
      <div className="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
        <strong className="text-left">
          <i className="fa fa-list"></i> Bán hàng tại quầy
        </strong>
        <div className="search-wrapper d-flex align-items-center">
          <div className="search-container"></div>
          <Button
            className="btn btn-primary"
            onClick={taoHoaDonCho} // Tạo hóa đơn mới
          >
            + Tạo hoá đơn
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Nav variant="tabs">
        {hoaDonCho.map((item, index) => (
          <Nav.Item key={item.id}>
            <Nav.Link
              eventKey={item.id}
              active={activeOrder === item.id}
              onClick={(e) => {
                if (e.target !== e.currentTarget) return; // Ngăn chặn click vào biểu tượng xóa
                setActiveOrder(item.id); // Chuyển tab đang chọn
                loadChiTietHdCho(item); // Gọi hàm loadChiTietHdCho với item của tab đang chọn
              }}
              style={{
                fontWeight: activeOrder === item.id ? "bold" : "normal",
                color: activeOrder === item.id ? "black" : "gray",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* Custom tên tab hiển thị */}
              {`Đơn hàng ${index + 1} + HĐ ${item.id}`}
              {/* Icon xóa - Giống phần xóa trong bảng */}
              <FaTimesCircle
                style={{ marginLeft: "10px", color: "red", cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation(); // Ngăn chặn click ngoài ý muốn
                  handleShowDeleteModal(item.id); // Gọi hàm xóa và hiển thị modal xác nhận
                }}
              />
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      <hr />

      <div
        id="anh"
        style={{
          margin: "12.5rem",
        }}
      >
        <img className="imganhnodata" src={nodata} />
      </div>

      <div id="an">
        <div className="dssanphamhoadon">
          <div className="d-flex">
            <strong>Thông tin sản phẩm</strong>
            <strong className="mahdcho">{selectHoaDonCho?.maHoaDon}</strong>
            <strong className="mahdcho">{selectHoaDonCho?.ngayTao}</strong>
            <button
              data-bs-toggle="modal"
              data-bs-target="#addcate"
              className="btn btn-primary btnthemsanphamhd"
            >
              Chọn sản phẩm
            </button>
          </div>
        </div>
        <div className="listSpChon">
          {selectHoaDonCho?.hoaDonChiTiets.length == 0 ? (
            <div className="divrong">
              <img className="imganhgiohangrong" src={giotrong} />
            </div>
          ) : (
            <div className="divlistspct">
              <table className="table table-borderd">
                <tr>
                  <th>STT</th>
                  <th>Ảnh</th>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Tổng tiền</th>
                  <th>Thao tác</th>
                </tr>
                {selectHoaDonCho?.hoaDonChiTiets.map((item, index) => {
                  return (
                    <tr>
                      <td>{index + 1}</td>
                      <td>
                        <img
                          src={
                            item.sanPhamChiTiet.anhs.length > 0
                              ? item.sanPhamChiTiet.anhs[0].tenAnh
                              : item.sanPhamChiTiet.sanPham.anh
                          }
                          className="imgtable"
                        />
                      </td>
                      <td>
                        {item.sanPhamChiTiet.sanPham?.maSanPham} -{" "}
                        {item.sanPhamChiTiet.sanPham?.tenSanPham}
                        <br />
                        Chất liệu:{" "}
                        {item.sanPhamChiTiet.sanPham.chatLieu.tenChatLieu}
                        <br />
                        Đế giày: {item.sanPhamChiTiet.sanPham.deGiay.tenDeGiay}
                        <br />
                        Thương hiệu:{" "}
                        {item.sanPhamChiTiet.sanPham.thuongHieu.tenThuongHieu}
                        <br />
                        Kích thước: {item.sanPhamChiTiet.kichCo.tenKichCo}
                        <br />
                        Màu sắc: {item.sanPhamChiTiet.mauSac.tenMauSac}
                        <span
                          class="square"
                          style={{
                            background: item.sanPhamChiTiet.mauSac.maMauSac,
                          }}
                        ></span>
                        <br />
                        Số lượng: {item.sanPhamChiTiet.soLuong}
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "5px",
                          }}
                        >
                          <button
                            onClick={(e) => handleIncrease(-1, item.id)}
                            style={{
                              padding: "5px 10px",
                              backgroundColor: "#f0f0f0", // Màu xám nhạt
                              border: "1px solid #ccc", // Viền nhẹ
                              borderRadius: "4px",
                              color: "#333", // Màu chữ xám đậm
                              cursor: "pointer",
                              fontSize: "14px",
                            }}
                          >
                            -
                          </button>
                          <input
                            onChange={(e) =>
                              change_value_enter(
                                e.target.value,
                                item.id,
                                item.soLuong
                              )
                            }
                            defaultValue={item.soLuong}
                            id="quality"
                            className="inputtaiquay"
                            type="text"
                            style={{
                              width: "50px",
                              textAlign: "center",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              padding: "5px",
                              fontSize: "14px",
                            }}
                          />
                          <button
                            onClick={(e) =>
                              handleDecrease(
                                1,
                                item.id,
                                item.sanPhamChiTiet.soLuong
                              )
                            }
                            style={{
                              padding: "5px 10px",
                              backgroundColor: "#f0f0f0", // Màu xám nhạt
                              border: "1px solid #ccc", // Viền nhẹ
                              borderRadius: "4px",
                              color: "#333", // Màu chữ xám đậm
                              cursor: "pointer",
                              fontSize: "14px",
                            }}
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td>{formatMoney(item.sanPhamChiTiet.giaTien)}</td>
                      <td>
                        {formatMoney(
                          item.sanPhamChiTiet.giaTien * item.soLuong
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => deleteChiTiet(item.id)}
                          style={{
                            backgroundColor: "#dc3545", // Màu đỏ nhạt
                            color: "#fff", // Màu chữ trắng
                            border: "none", // Loại bỏ viền
                            borderRadius: "4px", // Bo góc
                            padding: "6px 10px", // Khoảng cách nội dung
                            display: "flex", // Sử dụng flexbox
                            alignItems: "center", // Căn giữa theo chiều dọc
                            justifyContent: "center", // Căn giữa theo chiều ngang
                            cursor: "pointer", // Hiển thị con trỏ khi hover
                            transition: "background-color 0.3s ease", // Hiệu ứng chuyển màu
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.backgroundColor = "#c82333")
                          } // Màu khi hover
                          onMouseLeave={(e) =>
                            (e.target.style.backgroundColor = "#dc3545")
                          } // Màu khi không hover
                        >
                          <i
                            className="fa fa-trash"
                            style={{ fontSize: "14px" }}
                          ></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </table>
            </div>
          )}
        </div>
        <hr />

        <div
          className="row"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div
            className="col-sm-6"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            {/* Thông tin khách hàng */}
            <div className="dssanphamhoadon" style={{ padding: "10px" }}>
              <div
                className="d-flex"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <strong>Thông tin khách hàng</strong>
                <div>
                  <strong className="mahdcho">
                    {selectKhachHang?.hoVaTen}
                  </strong>
                  <strong className="mahdcho">
                    {selectKhachHang?.ngayTao}
                  </strong>
                </div>
              </div>
              <div className="row mt-3" style={{ marginTop: "1rem" }}>
                <div className="col-sm-7">
                  <Select
                    className="select-container selectheader"
                    options={khachHang}
                    value={selectKhachHang}
                    onChange={setselectKhachHang}
                    getOptionLabel={(option) =>
                      option.hoVaTen + " - " + option.soDienThoai
                    }
                    getOptionValue={(option) => option.id}
                    placeholder="Chọn khách hàng"
                  />
                </div>
                <div className="col-sm-5">
                  <button
                    onClick={() => CapNhatKhachHang()}
                    className="btn btn-primary w-100"
                    style={{ marginTop: "1px" }}
                  >
                    Chọn khách hàng
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="col-sm-6"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            {/* Thông tin hóa đơn */}
            <div className="dssanphamhoadon" style={{ padding: "10px" }}>
              <div
                className="d-flex"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <strong>Thông tin thanh toán</strong>
              </div>
              <table
                className="table mt-3"
                style={{ marginTop: "10px", width: "100%" }}
              >
                <tbody>
                  {/* Thông tin giảm giá */}
                  <tr>
                    <th style={{ verticalAlign: "middle", width: "30%" }}>
                      Phiếu giảm giá
                    </th>
                    <td style={{ width: "70%" }}>
                      <Select
                        className="select-container selectheader"
                        options={dotGiamGia}
                        value={selectDotGiamGia}
                        onChange={(e) => {
                          change_dotGiamGia(e);
                        }}
                        getOptionLabel={(option) =>
                          option.id + " - " + option.tenPhieu
                        }
                        getOptionValue={(option) => option.id}
                        placeholder="Chọn phiếu giảm giá"
                        styles={{
                          container: (provided) => ({
                            ...provided,
                            width: "100%",
                            margin: 0,
                          }),
                          control: (provided) => ({
                            ...provided,
                            border: "none",
                            boxShadow: "none",
                            minHeight: "36px",
                          }),
                          dropdownIndicator: (provided) => ({
                            ...provided,
                            padding: "4px",
                          }),
                          indicatorSeparator: () => ({
                            display: "none",
                          }),
                        }}
                      />
                    </td>
                  </tr>
                  {/* Tiền hàng */}
                  <tr>
                    <th style={{ width: "30%" }}>Tiền hàng</th>
                    <td>
                      {formatMoney(
                        selectHoaDonCho != null
                          ? selectHoaDonCho.hoaDonChiTiets.reduce(
                              (tong, sanPham) =>
                                tong + sanPham.giaSanPham * sanPham.soLuong,
                              0
                            )
                          : 0
                      )}
                    </td>
                  </tr>
                  {/* Giảm giá */}
                  <tr>
                    <th style={{ width: "30%" }}>Giảm giá</th>
                    <td>
                      {formatMoney(
                        selectHoaDonCho != null
                          ? selectHoaDonCho.hoaDonChiTiets.reduce(
                              (tong, sanPham) =>
                                tong + sanPham.giaSanPham * sanPham.soLuong,
                              0
                            ) - tongTien
                          : 0
                      )}
                    </td>
                  </tr>
                  {/* Tổng tiền (sau khi áp dụng giảm giá) */}
                  <tr>
                    <th style={{ width: "30%" }}>Tổng tiền</th>
                    <td>
                      {formatMoney(
                        tongTien -
                          (selectDotGiamGia && selectDotGiamGia.giamGia
                            ? selectDotGiamGia.giamGia
                            : 0)
                      )}
                    </td>
                  </tr>

                  <tr>
                    <th style={{ width: "30%" }}>
                      Thanh toán
                      <FaCreditCard
                        style={{
                          fontSize: "18px",
                          cursor: "pointer",
                          marginLeft: "10px",
                        }}
                        onClick={() => setShowModal(true)} // Hiển thị modal khi nhấn vào biểu tượng
                      />
                    </th>
                    <td>{formatMoney(soTienThanhToan)}</td>{" "}
                    {/* Hiển thị số tiền thanh toán */}
                  </tr>

                  <tr>
                    <th style={{ width: "30%" }}>Tiền thừa</th>
                    <td>
                      {tienThua > 0 ? (
                        <span>{formatMoney(tienThua)}</span>
                      ) : (
                        "0 ₫"
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                onClick={() => xacNhanDat()}
                disabled={tongTien === 0}
                className="btn btn-primary w-20"
                style={{ marginTop: "10px" }}
              >
                Xác nhận đặt hàng
              </button>
            </div>
          </div>
        </div>

        <div
          class="modal fade"
          id="addcate"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="false"
        >
          <div class="modal-dialog modal-xl">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">
                  Chọn sản phẩm{" "}
                  <strong className="mahdcho">
                    Mã HD: {selectHoaDonCho?.maHoaDon}
                  </strong>
                  <strong className="mahdcho">
                    {selectHoaDonCho?.ngayTao}
                  </strong>
                </h5>{" "}
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div
                  className="row"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ flex: "1 1 calc(20% - 10px)" }}>
                    <label className="lb-form">Chọn thương hiệu</label>
                    <Select
                      options={thuongHieu}
                      value={selectThuongHieu}
                      onChange={setselectThuongHieu}
                      getOptionLabel={(option) => option.tenThuongHieu}
                      getOptionValue={(option) => option.id}
                    />
                  </div>
                  <div style={{ flex: "1 1 calc(20% - 10px)" }}>
                    <label className="lb-form">Chọn chất liệu</label>
                    <Select
                      options={chatlieu}
                      value={selectChatlieu}
                      onChange={setselectChatlieu}
                      getOptionLabel={(option) => option.tenChatLieu}
                      getOptionValue={(option) => option.id}
                    />
                  </div>
                  <div style={{ flex: "1 1 calc(20% - 10px)" }}>
                    <label className="lb-form">Chọn đế giày</label>
                    <Select
                      options={deGiay}
                      value={selectDeGiay}
                      onChange={setselectDeGiay}
                      getOptionLabel={(option) => option.tenDeGiay}
                      getOptionValue={(option) => option.id}
                    />
                  </div>
                  <div style={{ flex: "1 1 calc(20% - 10px)" }}>
                    <label className="lb-form">Chọn màu sắc</label>
                    <Select
                      options={mauSac}
                      value={selectmauSac}
                      onChange={setselectmauSac}
                      getOptionLabel={(option) => option.tenMauSac}
                      getOptionValue={(option) => option.id}
                    />
                  </div>
                  <div style={{ flex: "1 1 calc(20% - 10px)" }}>
                    <label className="lb-form">Chọn kích thước</label>
                    <Select
                      options={kichThuoc}
                      value={selectkichThuoc}
                      onChange={setselectkichThuoc}
                      getOptionLabel={(option) => option.tenKichCo}
                      getOptionValue={(option) => option.id}
                    />
                  </div>
                  <div style={{ flex: "1 1 20%", maxWidth: "500px" }}>
                    <label className="lb-form">Tìm kiếm sản phẩm</label>
                    <InputGroup
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Form.Control
                        style={{ flex: "1", padding: "0.375rem 0.75rem" }} // Giảm kích thước và sát nút
                        placeholder="Nhập từ khóa tìm kiếm"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                      />
                    </InputGroup>
                  </div>
                </div>
                <div
                  className="row"
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    marginTop: "20px",
                  }}
                >
                  <div style={{ flex: "0 0 15%" }}>
                    <button
                      onClick={getChiTietSanPham}
                      className="btn btn-primary form-control"
                    >
                      Lọc sản phẩm
                    </button>
                  </div>
                  <div style={{ flex: "0 0 10%" }}>
                    <button
                      onClick={resetFilters}
                      className="btn btn-secondary form-control"
                    >
                      Làm mới
                    </button>
                  </div>
                </div>

                <br />
                <div className="dsChitietsp">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Sản phẩm</th>
                        <th>Giá bán</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSanPham.length > 0 ? (
                        filteredSanPham.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              {item.sanPham?.maSanPham} -{" "}
                              {item.sanPham?.tenSanPham}
                              <br />
                              Chất liệu: {item.sanPham.chatLieu.tenChatLieu}
                              <br />
                              Đế giày: {item.sanPham.deGiay.tenDeGiay}
                              <br />
                              Thương hiệu:{" "}
                              {item.sanPham.thuongHieu.tenThuongHieu}
                              <br />
                              Kích thước: {item.kichCo.tenKichCo}
                              <br />
                              Màu sắc: {item.mauSac.tenMauSac}
                              <span
                                className="square"
                                style={{ background: item.mauSac.maMauSac }}
                              ></span>
                              <br />
                              Số lượng: {item.soLuong}
                            </td>
                            <td>{formatMoney(item.giaTien)}</td>
                            <td>
                              <form onSubmit={handleAddChiTietHoaDon}>
                                <input
                                  name="chitietsp"
                                  type="hidden"
                                  value={item.id}
                                />
                                <input
                                  name="soluong"
                                  defaultValue={1}
                                  min={1}
                                  max={item.soLuong}
                                  type="number" // Thêm type="number" tại đây
                                  className="inputtaiquay"
                                />
                                <button className="btn btn-primary btnthemhdct">
                                  Thêm
                                </button>
                              </form>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">
                            Không có sản phẩm nào phù hợp.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <Modal
              show={showDeleteModal}
              onHide={handleCloseDeleteModal}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Xác nhận xóa</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Bạn có chắc chắn muốn xóa hóa đơn này không?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseDeleteModal}>
                  Hủy
                </Button>
                <Button variant="danger" onClick={deleteHoaDon}>
                  Xóa
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title style={{ textAlign: "center", width: "100%" }}>
                  Thanh toán hóa đơn
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {/* Tổng tiền */}
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "20px",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  Tổng tiền:{" "}
                  <span style={{ color: "red" }}>
                    {tongTien.toLocaleString()} VNĐ
                  </span>
                </div>

                {/* Chọn phương thức thanh toán */}
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  Vui lòng chọn phương thức thanh toán:
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  {/* Nút Thanh toán tiền mặt */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                      width: "45%",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      backgroundColor:
                        paymentMethod === "tienMat" ? "#d4edda" : "#f8f9fa",
                    }}
                    onClick={() => setPaymentMethod("tienMat")}
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/2382/2382461.png"
                      alt="Tiền mặt"
                      style={{
                        width: "50px",
                        height: "50px",
                        marginBottom: "10px",
                      }}
                    />
                    <span>Tiền mặt</span>
                  </div>
                  {/* Nút Thanh toán VNPay */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                      width: "45%",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      backgroundColor:
                        paymentMethod === "VNPay" ? "#d4edda" : "#f8f9fa",
                    }}
                    onClick={() => setPaymentMethod("VNPay")}
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/888/888870.png"
                      alt="VNPay"
                      style={{
                        width: "50px",
                        height: "50px",
                        marginBottom: "10px",
                      }}
                    />
                    <span>VNPay</span>
                  </div>
                </div>

                {/* Input tiền khách đưa (chỉ hiện nếu chọn tiền mặt) */}
                {paymentMethod === "tienMat" && (
                  <div style={{ marginBottom: "20px" }}>
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "500",
                        marginBottom: "10px",
                      }}
                    >
                      Tiền khách đưa:
                    </p>
                    <input
                      type="text"
                      placeholder="Nhập số tiền khách đưa"
                      value={
                        soTienKhachDua ? soTienKhachDua.toLocaleString() : ""
                      }
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); // Chỉ cho phép nhập số
                        setSoTienKhachDua(value ? parseInt(value, 10) : ""); // Chuyển đổi về dạng số
                      }}
                      style={{
                        width: "100%",
                        padding: "10px",
                        fontSize: "16px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </div>
                )}

                {/* Hiển thị tiền thiếu hoặc thừa */}
                {paymentMethod === "tienMat" && (
                  <div
                    style={{
                      textAlign: "center",
                      marginBottom: "20px",
                      fontSize: "16px",
                      fontWeight: "500",
                    }}
                  >
                    {tienThieu > 0 ? (
                      <>
                        Tiền thiếu:{" "}
                        <span style={{ color: "red" }}>
                          {Math.max(tienThieu, 0).toLocaleString()} VNĐ
                        </span>
                      </>
                    ) : tienThieu === 0 ? (
                      <>Đủ tiền</>
                    ) : (
                      <>
                        Tiền thừa:{" "}
                        <span style={{ color: "green" }}>
                          {Math.abs(tienThieu).toLocaleString()} VNĐ
                        </span>
                      </>
                    )}
                  </div>
                )}

                {/* Nút Xác nhận */}
                <button
                  style={{
                    width: "100%",
                    padding: "10px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: tienThieu <= 0 ? "#28a745" : "#ccc",
                    color: "#fff",
                    cursor: tienThieu <= 0 ? "pointer" : "not-allowed",
                  }}
                  disabled={tienThieu > 0}
                  onClick={handleConfirmPayment}
                >
                  XÁC NHẬN
                </button>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDatTaiQuay;
