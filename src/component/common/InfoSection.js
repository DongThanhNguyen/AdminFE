import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarker, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';



const InfoSection = () => {
  return (
    <section className="info_section layout_padding2-top">
      <div className="social_container">
        <div className="social_box">
          <a href="">
            <FontAwesomeIcon icon={faFacebook} aria-hidden="true" />
          </a>
          <a href="">
            <FontAwesomeIcon icon={faTwitter} aria-hidden="true" />
          </a>
          <a href="">
            <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
          </a>
          <a href="">
            <FontAwesomeIcon icon={faYoutube} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="info_container">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-lg-3">
              <h6>ABOUT US</h6>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doLorem ipsum dolor sit amet, consectetur adipiscing elit, sed doLorem ipsum dolor sit amet,
              </p>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="info_form">
                <h5>Newsletter</h5>
                <form action="#">
                  <input type="email" placeholder="Enter your email" />
                  <button type="submit">Subscribe</button>
                </form>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <h6>NEED HELP</h6>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doLorem ipsum dolor sit amet, consectetur adipiscing elit, sed doLorem ipsum dolor sit amet,
              </p>
            </div>
            <div className="col-md-6 col-lg-3">
              <h6>CONTACT US</h6>
              <div className="info_link-box">
                <a href="">
                  <FontAwesomeIcon icon={faMapMarker} aria-hidden="true" />
                  <span> Gb road 123 london Uk </span>
                </a>
                <a href="">
                  <FontAwesomeIcon icon={faPhone} aria-hidden="true" />
                  <span>+01 12345678901</span>
                </a>
                <a href="">
                  <FontAwesomeIcon icon={faEnvelope} aria-hidden="true" />
                  <span> demo@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer Section */}
      <footer className="footer_section">
        <div className="container">
          <p>
            &copy; <span id="displayYear">{new Date().getFullYear()}</span> All Rights Reserved By
            <a href="https://html.design/">Free Html Templates</a>
          </p>
        </div>
      </footer>
      {/* Footer Section */}
    </section>
  );
};

export default InfoSection;