import { createContext, useState, useEffect, useContext } from 'react';
import { parseDate } from '@internationalized/date';
import { MapContext } from './MapContext';

export const RasterLayerContext = createContext(null);

const layerOptions = [
  { value: 'NDVI', label: 'NDVI' },
  { value: 'NDVI-WMTS', label: 'GNDVI' },
  { value: 'EVI2', label: 'EVI2' },
  { value: 'LAI-SAVI', label: 'LAI-SAVI' },
  { value: 'NDVI', label: 'NDVI' },
];

export function RasterLayerProvider({ children }) {
  const { mapInstance } = useContext(MapContext);
  const [layer, setLayer] = useState(layerOptions[0]);
  const [isVisible, setIsVisible] = useState(true);
  const [opacity, setOpacity] = useState(100);
  const [isDetailActive, setIsDetailActive] = useState(false);

  const [dateRange, setDateRange] = useState({
    start: parseDate('2024-01-01'),
    end: parseDate('2024-12-31'),
  });
  const [clickedData, setClickedData] = useState(null);

  const handleOpacityChange = (e) => {
    setOpacity(e.target.value);
  };

  const handleStateChange = (isActive) => {
    console.log('isDetailActive', isActive);
    if (mapInstance) {
      if (isActive) {
        mapInstance.getCanvas().style.cursor = 'crosshair';
      } else {
        mapInstance.getCanvas().style.cursor = '';
      }
    }
    setIsDetailActive(isActive);
  };

  useEffect(() => {
    const handleClick = (e) => {
      let data = {
        coordinates: e.lngLat,
      };

      // clicked inside a plot
      if (mapInstance.getLayer('plots-layer')) {
        const features = mapInstance.queryRenderedFeatures(e.point, {
          layers: ['plots-layer'],
        });
        if (features.length > 0) {
          data.plot = features[0];
        }
      }
      console.log('clickedData:', data);
      setClickedData(data);
    };
    if (mapInstance && isDetailActive) {
      console.log('adding event to map');
      mapInstance.on('click', handleClick);
    }

    // Clean up the event listener on component unmount
    return () => {
      if (mapInstance) {
        mapInstance.off('click', handleClick);
      }
    };
  }, [mapInstance, isDetailActive, setClickedData]);

  return (
    <RasterLayerContext.Provider
      value={{
        layer,
        setLayer,
        opacity,
        handleOpacityChange,
        layerOptions,
        dateRange,
        setDateRange,
        isVisible,
        setIsVisible,
        clickedData,
        setClickedData,
        isDetailActive,
        handleStateChange,
      }}
    >
      {children}
    </RasterLayerContext.Provider>
  );
}
