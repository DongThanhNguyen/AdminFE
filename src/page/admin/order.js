import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod, postMethod} from '../../services/request';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


var size = 10;
var url = '';
const AdminInvoice = ()=>{
    const [statusInvoice, setStatusInvoice] = useState([]);
    const [items, setItems] = useState([]);
    const [itemDetail, setItemDetail] = useState([]);
    const [item, setItem] = useState(null);
    const [pageCount, setpageCount] = useState(0);

    useEffect(()=>{
        getInvoice();
        const getStatusInvoice = async() =>{
            var response = await getMethod("/api/invoice/admin/all-status");
            var list = await response.json();
            setStatusInvoice(list)
        };
        getStatusInvoice();
    }, []);

    const getInvoice = async() =>{
        var response = await getMethod('/api/invoice/admin/find-all?size='+size+'&sort=id,desc&page='+0);
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
        url = '/api/invoice/admin/find-all?size='+size+'&sort=id,desc&page='
    };

    async function filterInvoice(){
        var urlfr = '/api/invoice/admin/find-all?size='+size+'&sort=id,desc'
        var start = document.getElementById("start").value
        var end = document.getElementById("end").value
        var stt = document.getElementById("stt").value
        if (start != "" && end != "") {
            urlfr += '&from=' + start + '&to=' + end;
        }
        if (stt != -1) {
            urlfr += '&status=' + stt
        }
        urlfr += '&page=';
        url = urlfr;
        var response = await getMethod(urlfr+0);
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
    }

    const getInvoiceDetail = async(item) =>{
        var response = await getMethod('/api/invoice-detail/user/find-by-invoice?idInvoice='+item.id)
        var list = await response.json();
        setItemDetail(list);
        setItem(item)
    };

    const setValueInp = async(item) =>{
        setItem(item)
        document.getElementById("trangthaiupdate").value = item.statusInvoice
    };

    async function updateStatus(id) {
        const res = await postMethod('/api/invoice/admin/update-status?idInvoice=' + id);
        if (res.status < 300) {
            toast.success("Success!");
            getInvoice();
        }
        if (res.status == 417) {
            var result = await res.json()
            toast.warning(result.defaultMessage);
        }
    }

    async function noRec(id) {
        const res = await postMethod('/api/invoice/admin/update-status-noreceived?idInvoice=' + id);
        if (res.status < 300) {
            toast.success("Success!");
            getInvoice();
        }
        if (res.status == 417) {
            var result = await res.json()
            toast.warning(result.defaultMessage);
        }
    }

    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        var response = await getMethod(url+currentPage)
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
    }


    return (
        <>
            <div class="row">
                <div class="col-md-2">
                    <label>From date</label>
                    <input id="start" type="date" class="form-control"/>
                </div>
                <div class="col-md-2">
                    <label>To date</label>
                    <input id="end" type="date" class="form-control"/>
                </div>
                <div class="col-md-3">
                    <label>Status</label>
                    <select class="form-control" id="stt">
                        <option value="-1">--- All ---</option>
                        {statusInvoice.map((item=>{
                            return <option value={item}>{item}</option>
                        }))}
                    </select>
                </div>
                <div class="col-md-2">
                    <br/>
                    <button onClick={filterInvoice} class="btn btn-danger form-control"><i class="fa fa-filter"></i> Filter</button>
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
                                <th>Order code</th>
                                <th>Order date</th>
                                <th>Recipient name</th>
                                <th>Recipient phone</th>
                                <th>Recipient address</th>
                                <th>Note</th>
                                <th>Order status</th>
                                <th>Total amount</th>
                                <th>Paytype</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                    return <tr>
                                    <td>{item.id}</td>
                                    <td>{item.createdTime}, {item.createdDate}</td>
                                    <td>{item.receiverName}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.address}</td>
                                    <td>{item.note}</td>
                                    <td>{item.statusInvoice}</td>
                                    <td>{item.totalAmount} $</td>
                                    <td>{item.payType}</td>
                                    <td class="sticky-col">
                                        <i onClick={()=>getInvoiceDetail(item)} data-bs-toggle="modal" data-bs-target="#modaldeail" class="fa fa-eye iconaction"></i>
                                        {item.statusInvoice != 'SENT'?'':<button className='btn btn-danger' onClick={()=>noRec(item.id)}>No received</button>}
                                        {item.statusInvoice == 'RECEIVED' || item.statusInvoice == 'CANCELED' || item.statusInvoice == 'NO_RECEIVED'?'':<button onClick={()=>updateStatus(item.id)} className='btn btn-primary'>Update status</button>}
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

    <div class="modal fade" id="modaldeail" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Order Detail</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row headerdetail">
                        <div class="col-lg-4 col-md-4 col-sm-12 col-12">
                            <br/><span>Order date: <span class="yls">{item?.createdDate}</span></span>
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-12 col-12">
                            <br/><span>Current Order Status: <span class="yls">{item?.statusInvoice}</span></span>
                        </div>
                    </div>
                    <div class="row shipinfor">
                        <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                            <span class="ttshipinfor">Address</span>
                            <div class="blockinfor">
                                <p class="reciverName">{item?.receiverName}</p>
                                <span>Delivery address: <span>{item?.address}</span></span>
                                <br/><span class="phoneacc">Phone: <span>{item?.phone}</span></span>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-12 col-12">
                            <span class="ttshipinfor">Payment</span>
                            <div class="blockinfor">
                                <span id="loaithanhtoan">Payment upon receipt </span>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-12 col-12">
                            <span class="ttshipinfor">Note</span>
                            <div class="blockinfor">
                                <span id="ghichunh">{item?.note}</span>
                            </div>
                        </div>
                    </div><br/>
                    <h5>Orders Status</h5>
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th>Created date</th>
                                <th>Status</th>
                                <th>Created by</th>
                            </tr>
                        </thead>
                        <tbody>
                            {item?.invoiceStatuses.map((stt, index)=>{
                                return <tr>
                                    <td>{stt.createdDate}</td>
                                    <td>{stt.statusInvoice}</td>
                                    <td>{stt.createdBy.email}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                    <table class="table table-cart table-order" id="detailInvoice">
                        <thead class="thead-default theaddetail">
                            <tr>
                                <th>Image</th>
                                <th>Product name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                        {itemDetail.map((item, index)=>{
                            return <tr>
                            <td><img src={item.product.imageBanner} className='imgdetailhd'/></td>
                            <td>{item.product.name}</td>
                            <td>{item.price} $</td>
                            <td>{item.quantity}</td>
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

export default AdminInvoice;