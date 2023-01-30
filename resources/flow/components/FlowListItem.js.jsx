// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const FlowListItem = ({
  flow
}) => {
  return (
    // <li>
    //   <Link to={`/flows/${flow._id}`}> {flow.name}</Link>
    // </li>
    <div className="flowCard">
        {/* <span className="flowCardName">{flow.name}</span> */}
        <Link className="flowCardName" to={`/flows/${flow._id}`}> {flow.name}</Link>
        <div className="flowCardContent">
          <hr className="flowCardHorizontalLine" />
        </div>
    </div>
  )
}

FlowListItem.propTypes = {
  flow: PropTypes.object.isRequired
}

export default FlowListItem;
