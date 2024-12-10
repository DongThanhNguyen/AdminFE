import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

const testimonials = [
  {
    name: "Morijorch",
    role: "Default model text",
    text: "Editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many websites still in their infancy. Various editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many websites still in their infancy. Various editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many websites still in their infancy.",
  },
  {
    name: "Rochak",
    role: "Default model text",
    text: "Various editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many websites still in their infancy. Various editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many websites still in their infancy.",
  },
  {
    name: "Brad Johns",
    role: "Default model text",
    text: "Various editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many websites still in their infancy. Various editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many websites still in their infancy. Various editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many websites still in their infancy.",
  },
];

const CommentSection = () => {
  return (
    <section className="client_section layout_padding">
      <div className="container">
        <div className="heading_container heading_center">
          <h2>Testimonial</h2>
        </div>
      </div>

      <div className="container px-0">
        <div id="customCarousel2" className="carousel carousel-fade" data-ride="carousel">
          <div className="carousel-inner">
            {testimonials.map((testimonial, index) => (
              <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                <div className="box">
                  <div className="client_info">
                    <div className="client_name">
                      <h5>{testimonial.name}</h5>
                      <h6>{testimonial.role}</h6>
                    </div>
                    <i className="fa fa-quote-left" aria-hidden="true"></i>
                  </div>
                  <p>{testimonial.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="carousel_btn-box">
            <a className="carousel-control-prev" href="#customCarousel2" role="button" data-slide="prev">
              <i className="fa fa-angle-left" aria-hidden="true"></i>
              <span className="sr-only">Previous</span>
            </a>
            <a className="carousel-control-next" href="#customCarousel2" role="button" data-slide="next">
              <i className="fa fa-angle-right" aria-hidden="true"></i>
              <span className="sr-only">Next</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommentSection;
