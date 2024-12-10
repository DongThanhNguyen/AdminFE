import React from 'react';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { useState, useEffect } from 'react'
import {getMethod} from '../../services/request'
import ReactPaginate from 'react-paginate';

var sizepro = 12
var url = '';
function ShopSection() {
  const [itemProduct, setItemProduct] = useState([]);
  const [pageCount, setpageCount] = useState(0);
  useEffect(()=>{
    getProduct();
  }, []);

  async function getProduct() {
    var response = await getMethod('/api/product/public/find-all-page?size='+sizepro+'&sort=id,desc&page='+0);
    var result = await response.json();
    setItemProduct(result.content)
    setpageCount(result.totalPages)
    url = '/api/product/public/find-all-page?size='+sizepro+'&sort=id,desc&page='
  }

  const handlePageClick = async (data)=>{
    var currentPage = data.selected
    var response = await getMethod(url+currentPage)
    var result = await response.json();
    setItemProduct(result.content)
    setpageCount(result.totalPages)
}


  return (
    <section className="shop_section layout_padding">
      <div className="container">
        <div className="heading_container heading_center">
          <h2>Latest Products</h2>
        </div>
        <div className="row">
          {itemProduct.map((product, index) => (
            <div className="col-sm-6 col-md-4 col-lg-3" key={index}>
              <div className="box">
                <a href={'detail?id='+product.id} className='taga'>
                  <div className="img-box">
                    <img src={product.imageBanner} alt={product.name} />
                  </div>
                  <div className="detail-box">
                    <h6>{product.name}</h6>
                    <h6>
                      <span>${product.price}</span>
                    </h6>
                  </div>
                  <div className="new">
                    <span>New</span>
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="btn-box">
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
    </section>
  );
}

export default ShopSection;
