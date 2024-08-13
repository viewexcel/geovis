import { Popup } from 'react-map-gl/maplibre';
import './styles.css';
import MyButton from '../../ui-components/MyButton';
import LabelValueList from '../../ui-components/LabelValueList';
import { calculatePolygonArea } from '../../utils/calculatePolygonArea';
import { area } from '@turf/turf';
import NdviChart from '../PlotNDVIChart';

export default function PlotPopup({ popupInfo, onClose }) {
  const { plot } = popupInfo;

  return (
    <Popup
      longitude={popupInfo.lngLat.lng}
      latitude={popupInfo.lngLat.lat}
      closeButton={true}
      closeOnClick={true}
      onClose={onClose}
      anchor='top'
      style={{ width: 240 }}
      className='plot-popup'
    >
      <div className='popup-header'>
        <h3>{plot.properties.name}</h3>
      </div>
      <hr />
      <div className='popup-content'>
        <LabelValueList
          list={[
            {
              label: 'Area (sqm)',
              value: area(plot).toFixed(2),
            },
            { label: 'Average NDVI', value: 0.3 },
            { label: 'Crop', value: 'Potato' },
          ]}
        />
      </div>
      <span className='lvi-label'>NDVI history: </span>
      <NdviChart />
    </Popup>
  );
}