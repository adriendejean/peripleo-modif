import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import ReactMapGL, {Source, Layer} from 'react-map-gl';
// import WebMercatorViewport from '@math.gl/web-mercator';
import { useDebounce } from 'use-debounce';

import { StoreContext } from '../store';
import { pointStyle } from './Styles';

import Zoom from './components/Zoom';
import Hover from './components/Hover';

const toFeatureCollection = features => 
  ({ type: 'FeatureCollection', features: features || [] });

const Map = React.forwardRef((props, ref) => {

  const mapRef = useRef();

  const { store } = useContext(StoreContext);

  const { config } = props;

  const [ viewState, setViewState ] = useState();

  const [ debouncedViewState ] = useDebounce(viewState, 500);

  const [ hover, setHover ] = useState();

  const style = `https://api.maptiler.com/maps/outdoor/style.json?key=${config.api_key}`;

  useEffect(() => {
    console.log('Initial map render!');
  }, []);

  useEffect(() => {
    // TODO we'll need this handler later!
    /*
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      ...debouncedViewState
    };

    const bounds = new WebMercatorViewport(viewport).getBounds();
    const nodes = store.getNodesInBounds(bounds);
    setSearchResults(toFeatureCollection(nodes));
    */
  }, [ debouncedViewState ]);

  useEffect(() => {
    if (hover)
      ref.current.classList.add('hover');
    else
      ref.current.classList.remove('hover');
  }, [ hover ]);

  const onClick = () => {
    if (hover) {
      const { node } = hover;
      console.log('clicked', hover); // TODO
      history.pushState(node, node.title, `#/${encodeURIComponent(node.id)}`);
    }
  }

  const onMove = useCallback(evt =>
    setViewState(evt.viewState), []);

  const onMouseMove = useCallback(evt => {
    const { features, point } = evt;
    const { id } = features[0].properties;
    
    const updated = id === hover?.id ? {
      ...hover, ...point
    } : { 
      node: store.getNode(id),
      ...point
    };

    setHover(updated);
  }, []);

  const onMouseLeave = () => setHover(null);

  const onZoom = inc => () => {
    const map = mapRef.current;
    const z = mapRef.current.getZoom();
    map.easeTo({ zoom: z + inc });
  }

  return (  
    <div className="p6o-map-container" ref={ref}>
      <ReactMapGL
        ref={mapRef}
        initialViewState={{
          bounds: config.initial_bounds
        }}
        mapStyle={style}
        interactiveLayerIds={['search-results']}
        onLoad={props.onLoad}
        onMove={onMove}
        onClick={onClick}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave} >

        <Source type="geojson" data={toFeatureCollection(props.searchResults)}>
          <Layer 
            id="search-results"
            {...pointStyle({ fill: 'red', radius: 5 })} />
        </Source>

      </ReactMapGL>

      <Zoom 
        onZoomIn={onZoom(1)}
        onZoomOut={onZoom(-1)} />

      {props.children}

      {hover && <Hover {...hover} />}
    </div>
  )

});

export default Map;