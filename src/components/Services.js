import React from 'react';

const Services = () => {
  return (
    <section id="services" className="jumbotron">
      <div className="container">
        <h2 className="text-center mb-4">Our Services</h2>
        <div className="row">
          <div className="col-md-4 text-center">
            <img src="images/wedding.jpg" alt="Weddings" className="img-fluid mb-3"/>
            <h4>Weddings</h4>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div className="col-md-4 text-center">
            <img src="images/corporate.jpg" alt="Corporate Events" className="img-fluid mb-3"/>
            <h4>Corporate Events</h4>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div className="col-md-4 text-center">
            <img src="images/party.jpg" alt="Parties" className="img-fluid mb-3"/>
            <h4>Parties</h4>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
