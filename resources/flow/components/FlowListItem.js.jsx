// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const FlowListItem = ({
  flow
}) => {
  const { _id, name, tasks=[] } = flow 
  return (
    // <li>
    //   <Link to={`/flows/${flow._id}`}> {flow.name}</Link>
    // </li>
    <div className="flowCard">
        {/* <span className="flowCardName">{flow.name}</span> */}
        <Link className="flowCardName" to={`/flows/${_id}`}> {name}</Link>
        <div className="flowCardContent">
          <hr className="flowCardHorizontalLine" />
            {
              tasks.length ? tasks.map((data, i) => (
              <div key={data._id + i}>
                <input disabled type="checkbox" value={data.name}/>
                <span>{data.name}</span>
              </ div>
              )) : null
            }
        </div>
    </div>
  )
}

FlowListItem.propTypes = {
  flow: PropTypes.object.isRequired
}

export default FlowListItem;
