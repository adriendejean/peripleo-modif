import React from 'react';
import { MdOutlineMyLocation } from 'react-icons/md';

const OFFSET = [15, 15];

const Hover = props => {
  
  const { node, feature } = props;

  const style = {
    left: props.x + OFFSET[0], 
    top: props.y + OFFSET[1],
    borderWidth: !feature.properties.color && 0, 
    borderColor: feature.properties.color
  }

  const colocated = feature.properties.colocated_records || 0;

  return (  
    <div
      className="p6o-map-hover"
      style={style}>
      {colocated > 0 ?
        <>{node.properties.label} - {node.properties.title} <span className="p6o-map-hover-colocated">+ {colocated} item</span></> : <>{node.properties.label} - {node.properties.title}</> 
      }
      {node.geometry?.granularity &&
        <div className="p6o-map-hover-granularity">
          <MdOutlineMyLocation /> Location with intentionally reduced precision
        </div>
      }
    </div> 
  )

}

export default Hover;