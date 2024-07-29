import React from "react";
import '../../css/loader.css'
function Loader(props) {
  return (
    <div className="container1">
      <div className="loader">
        <div className="rocket">
          <i className="fas fa-rocket" />
          <i className="fas fa-cloud" style={{ "--i": 0 }} />
          <i className="fas fa-cloud" style={{ "--i": 1 }} />
          <i className="fas fa-cloud" style={{ "--i": 2 }} />
          <i className="fas fa-cloud" style={{ "--i": 3 }} />
        </div>
        <span>
          <i />
        </span>
      </div>
    </div>
  );
}

export default Loader;
