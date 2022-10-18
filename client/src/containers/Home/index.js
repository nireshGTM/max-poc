import React, { useState, useEffect } from "react";
import Notification from "../../components/Notification";
import banner from "../../assets/img/908017.jpg";

const Home = (props) => {
  const { authenticated } = props;

  return (
    <div>
      <Notification {...props}/>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h4 style={{"textAlign":"center"}}>Max Construction</h4>
          <img className="col-md-12 offset-md-0" src={banner} alt="Construction" />
        </div>
      </div>
    </div>
  );
}

export default Home;

