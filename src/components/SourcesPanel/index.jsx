import { useContext, useEffect, useState } from 'react';
import { MapContext } from '../../contexts/MapContext';
import AddNewSourceModal from '../AddNewSourceModal';
import { BiTrash } from 'react-icons/bi';

export default function SourcesPanel() {
  const { mapRef } = useContext(MapContext);
  const [sources, setSources] = useState([]);

  useEffect(() => {
    if (mapRef?.current) {
      loadSources(mapRef?.current);
    }
  }, [mapRef]);

  const loadSources = (map) => {
    setSources(map.getStyle()?.sources || []);
  };

  const handleRemoveSource = (e) => {
    if (mapRef?.current) {
      const sourceId = e.target.getAttribute('data-source-id');
      if (sourceId) {
        mapRef?.current?.removeSource(sourceId);
        loadSources(mapRef?.current);
      }
    }
  };
  return (
    <div>
      <div className='panel-header-action'>
        <h3 style={{ margin: 0 }}>Sources</h3>
        <AddNewSourceModal setSources={setSources} />
      </div>
      <hr />

      <ul>
        {Object.keys(sources).map((source) => (
          <li key={source}>
            {source}
            <BiTrash
              className='action-icon'
              data-source-id={source}
              onClick={handleRemoveSource}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
