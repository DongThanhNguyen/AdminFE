import {useState, useEffect} from "react";
import {toast} from "react-toastify";
import {
    getMethod,
    uploadSingleFile,
    uploadMultipleFile,
    postMethodPayload,
} from "../../services/request";
import Swal from "sweetalert2";
import Select from "react-select";
import {Editor} from "@tinymce/tinymce-react";
import React, {useRef} from "react";

var token = localStorage.getItem("token");

var linkbanner = "";
const AdminAddPhieuGiamGia = () => {
    const [item, setItem] = useState(null);
    const [label, setLabel] = useState("Thêm phiếu giảm giá");
    useEffect(() => {
        const getPhieuGiamGia = async () => {
            var uls = new URL(document.URL);
            var id = uls.searchParams.get("id");
            if (id != null) {
                setLabel("Cập nhật phiếu giảm giá");
                var response = await getMethod("/api/phieu-giam-gia/" + id);
                var result = await response.json();
                setItem(result);
            }
        };
        getPhieuGiamGia();
    }, []);

    async function handleAddPhieuGG(event) {
        event.preventDefault();

        var user = JSON.parse(localStorage.getItem("user"));

        // Lấy các giá trị từ form
        const payload = {
            maCode: event.target.elements.maCode.value,
            tenPhieu: event.target.elements.tenPhieu.value,
            giaTriGiamToiDa: event.target.elements.giaTriGiamToiDa.value,
            giaTriGiam: event.target.elements.giaTriGiam.value,
            donToiThieu: event.target.elements.donToiThieu.value,
            soLuong: event.target.elements.soLuong.value,
            loaiPhieu: event.target.elements.loaiphieu.value,
            ngayBatDau: event.target.elements.ngayBatDau.value,
            ngayKetThuc: event.target.elements.ngayKetThuc.value,
            nguoiTao: user.maNhanVien,
            nguoiCapNhat: user.maNhanVien,
            trangThai: event.target.elements.trangThai.value,
        };

        // Kiểm tra các trường không được trống
        if (!payload.maCode) {
            toast.error("Mã code không được để trống.");
            return;
        }

        if (!payload.tenPhieu) {
            toast.error("Tên phiếu không được để trống.");
            return;
        }

        if (!payload.giaTriGiamToiDa && !payload.loaiPhieu) {
            toast.error("Giá trị giảm tối đa không được để trống.");
            return;
        }

        if (!payload.giaTriGiam) {
            toast.error("Giá trị giảm không được để trống.");
            return;
        }

        if (!payload.donToiThieu) {
            toast.error("Đơn tối thiểu không được để trống.");
            return;
        }

        if (!payload.soLuong) {
            toast.error("Số lượng không được để trống.");
            return;
        }

        if (!payload.ngayBatDau) {
            toast.error("Ngày bắt đầu không được để trống.");
            return;
        }

        if (!payload.ngayKetThuc) {
            toast.error("Ngày kết thúc không được để trống.");
            return;
        }

        // Kiểm tra giá trị giảm, giá trị giảm tối đa, đơn tối thiểu, số lượng phải là số nguyên dương
        if (isNaN(payload.giaTriGiamToiDa) || parseInt(payload.giaTriGiamToiDa) <= 0) {
            toast.error("Giá trị giảm tối đa phải là một số nguyên dương.");
            return;
        }

        if (isNaN(payload.giaTriGiam) || parseInt(payload.giaTriGiam) < 0) {
            toast.error("Giá trị giảm phải là một số nguyên không âm.");
            return;
        }

        if (isNaN(payload.donToiThieu) || parseInt(payload.donToiThieu) <= 0) {
            toast.error("Đơn tối thiểu phải là một số nguyên dương.");
            return;
        }

        if (isNaN(payload.soLuong) || parseInt(payload.soLuong) <= 0) {
            toast.error("Số lượng phải là một số nguyên dương.");
            return;
        }

        // Kiểm tra ngày kết thúc phải lớn hơn ngày bắt đầu và lớn hơn thời điểm hiện tại
        const today = new Date();
        const startDate = new Date(payload.ngayBatDau);
        const endDate = new Date(payload.ngayKetThuc);

        if (endDate <= startDate) {
            toast.error("Ngày kết thúc phải lớn hơn ngày bắt đầu.");
            return;
        }

        if (endDate <= today) {
            // Tự động chuyển trạng thái thành "Ngừng hoạt động"
            payload.trangThai = 0; // Ngừng hoạt động
            toast.warning("Ngày kết thúc đã qua, phiếu giảm giá sẽ tự động ngừng hoạt động.");
        } else {
            // Nếu ngày kết thúc chưa đến, đảm bảo phiếu giảm giá đang hoạt động
            payload.trangThai = 1; // Đang hoạt động
        }

        console.log(payload); // Kiểm tra payload

        // Gửi yêu cầu API nếu tất cả các trường hợp trên hợp lệ
        if (item != null) {
            payload.nguoiTao = item.nguoiTao;
        }

        var url = "/api/phieu-giam-gia";
        if (item != null) {
            url += "/" + item.id;
        }

        const res = await postMethodPayload(url, payload);

        if (res.status < 300) {
            toast.success("Success!");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            window.location.href = "khuyen-mai";
        }

        if (res.status == 417) {
            var result = await res.json();
            toast.error(result.defaultMessage);
        }

        if (res.status > 300) {
            toast.error("Thất bại");
        }
    }


    function change_pgg(e) {
        console.log(e.target.value);
        let select_value = e.target.value;
        let element_slect = document.getElementById("gia_tri_giam_toi_da");
        if (select_value === "true") {
            console.log("b");

            element_slect.style.display = "none";
        } else {
            console.log("a");

            element_slect.style.display = "block";
        }
    }

    return (
        <div>
            <div class="col-sm-12 header-sps">
                <div class="title-add-admin">
                    <h4>{label}</h4>
                </div>
            </div>
            <div class="col-sm-12">
                <form onSubmit={handleAddPhieuGG} class="form-add row">
                    <div class="col-sm-5">
                        <label class="lb-form">Mã code</label>
                        <input
                            name="maCode"
                            defaultValue={item?.maCode}
                            class="form-control"
                        />

                        <label class="lb-form">Tên phiếu</label>
                        <input
                            name="tenPhieu"
                            defaultValue={item?.tenPhieu}
                            class="form-control"
                        />

                        <label class="lb-form">Loại phiếu</label>
                        <select
                            onChange={(e) => change_pgg(e)}
                            //defaultValue={item?.gioiTinh}
                            name="loaiphieu"
                            class="form-control"
                        >

                            <option selected={item?.loaiPhieu == true} value={true}>
                                Giảm tiền
                            </option>
                            <option selected={item?.loaiPhieu == false} value={false}>
                                Giảm %
                            </option>

                        </select>

                        <div id="gia_tri_giam_toi_da" style={{display: item?.loaiPhieu === false ? 'block' : 'none'}}>
                        <label class="lb-form">Giá trị giảm tối đa</label>
                            <input
                                name="giaTriGiamToiDa"
                                defaultValue={item?.giaTriGiamToiDa}
                                class="form-control"
                            />
                        </div>
                        <div id="gia_tri_giam">
                            <label class="lb-form">Giá trị giảm </label>
                            <input
                                name="giaTriGiam"
                                defaultValue={item?.giaTriGiam}
                                class="form-control"
                            />
                        </div>

                        <label class="lb-form">Đơn tối thiểu</label>
                        <input
                            name="donToiThieu"
                            defaultValue={item?.donToiThieu}
                            class="form-control"
                        />

                        <br/>
                        <button class="form-control btn btn-primary">{label}</button>
                    </div>
                    <div className="col-sm-5">
                        <label class="lb-form">Số lượng</label>
                        <input
                            name="soLuong"
                            defaultValue={item?.soLuong}
                            class="form-control"
                        />

                        <label class="lb-form">Ngày bắt đầu</label>
                        <input
                            name="ngayBatDau"
                            defaultValue={item?.ngayBatDau}
                            type="datetime-local"
                            class="form-control"
                        />

                        <label class="lb-form">Ngày kết thúc</label>
                        <input
                            name="ngayKetThuc"
                            defaultValue={item?.ngayKetThuc}
                            type="datetime-local"
                            class="form-control"
                        />

                        <label className="lb-form">Trạng thái</label>
                        <select
                            name="trangThai"
                            defaultValue={item?.trangThai}
                            className="form-control"
                        >
                            <option value="1">Đang hoạt động</option>
                            <option value="0">Ngừng hoạt động</option>
                        </select>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminAddPhieuGiamGia;
