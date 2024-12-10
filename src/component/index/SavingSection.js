import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Đảm bảo rằng CSS Bootstrap đã được nhập

const SavingSection = () => {
  return (
    <section className="saving_section">
      <div className="box">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6">
              <div className="img-box">
                <img src="images/saving-img.png" alt="Best Savings" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="detail-box">
                <div className="heading_container">
                  <h2>
                    Best Savings on <br />
                    new arrivals
                  </h2>
                </div>
                <p>
                  Qui ex dolore at repellat, quia neque doloribus omnis adipisci, ipsum eos odio fugit ut eveniet blanditiis praesentium totam non nostrum dignissimos nihil eius facere et eaque. Qui, animi obcaecati.
                </p>
                <div className="btn-box">
                  <a href="#" className="btn1">
                    Buy Now
                  </a>
                  <a href="#" className="btn2">
                    See More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SavingSection;