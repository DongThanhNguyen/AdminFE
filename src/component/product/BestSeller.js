import React from 'react';

const BestSeller = () => {
  const products = [
    {
      id: 1,
      image: "images/p1.png",
      name: "Ring",
      price: "$200"
    },
    {
      id: 2,
      image: "images/p2.png",
      name: "Watch",
      price: "$300"
    },
    {
      id: 3,
      image: "images/p3.png",
      name: "Teddy Bear",
      price: "$110"
    },
    {
      id: 4,
      image: "images/p4.png",
      name: "Flower Bouquet",
      price: "$45"
    },
    {
      id: 5,
      image: "images/p5.png",
      name: "Teddy Bear",
      price: "$95"
    },
    {
      id: 6,
      image: "images/p6.png",
      name: "Flower Bouquet",
      price: "$70"
    },
    {
      id: 7,
      image: "images/p7.png",
      name: "Watch",
      price: "$400"
    },
    {
      id: 8,
      image: "images/p8.png",
      name: "Ring",
      price: "$450"
    },
  ];

  return (
    <section className="shop_section layout_padding">
      <div className="container">
        <div className="heading_container heading_center">
          <h2>Most Popular</h2>
        </div>
        <div className="row">
          {products.map(product => (
            <div key={product.id} className="col-sm-6 col-md-4 col-lg-3">
              <div className="box">
                <a href="detail">
                  <div className="img-box">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="detail-box">
                    <h6>{product.name}</h6>
                    <h6>
                      Price <span>{product.price}</span>
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
          <a href="">View All Products</a>
        </div>
      </div>
    </section>
  );
};

export default BestSeller ;
