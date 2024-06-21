import React from 'react';

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-5">
      <div className="container">
        <h2 className="text-center mb-4">Testimonials</h2>
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="card text-center">
              <div className="card-body">
                <p className="card-text">"The best banquet hall I've ever been to! Excellent service and beautiful decor."</p>
                <p className="card-text"><small className="text-muted">- John Doe</small></p>
              </div>
            </div>
          </div>
          <div className="col-md-6 mx-auto">
            <div className="card text-center">
              <div className="card-body">
                <p className="card-text">"Had my wedding here and it was a dream come true. Thank you Crystal Palace!"</p>
                <p className="card-text"><small className="text-muted">- Jane Smith</small></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
