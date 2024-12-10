import React from 'react';

const ProductDetail = () => {
  // Dữ liệu sản phẩm ví dụ
  const product = {
    id: 1,
    image: "images/p1.png",
    name: "Ring",
    description: "This is a beautiful ring made with the finest materials. Perfect for all occasions.",
    price: "$200",
    isNew: true
  };

  return (
    <section className="product_detail_section layout_padding">
      <div className="container">
        <div className="heading_container heading_center">
          <h2>Product Detail</h2>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="img-box">
              <img src={product.image} alt={product.name} />
              {product.isNew && (
                <div className="new">
                  <span>New</span>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="detail-box">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <h4>Price: <span>{product.price}</span></h4>
              <div className="btn-box">
                <button className="buy-btn">View Location</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
