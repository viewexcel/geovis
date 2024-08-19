import { useCallback, useContext, useEffect, useState } from 'react';
import { PlotContext } from '../../contexts/PlotContext';
import { Source, Layer } from 'react-map-gl/maplibre';
import { MapContext } from '../../contexts/MapContext';
import { useMap } from 'react-map-gl/maplibre';
import PlotPopup from '../PlotPopup';
import useAccessToken from '@/hooks/useAccessToken';
import fetchNDVIImage from '@/utils/fetchNDVIFromProcessingAPI';
import { bbox } from '@turf/turf';
import debounce from '@/utils/debounce';

export default function Plots() {
  const {
    plots,
    showPlots,
    clickedPlot,
    setClickedPlot,
    weeksBefore,
    ndviLoading,
    setNdviLoading,
  } = useContext(PlotContext);
  const { drawRef, mapRef } = useContext(MapContext);
  const accessToken = useAccessToken();
  const map = mapRef?.current?.getMap();

  const addNDVIImageToMap = useCallback(
    (imageUrl, plot, { map }) => {
      if (!map) throw new Error('map is not defined');

      console.log('plotss', plot);
      if (!plot || !plot.geometry || plot.geometry.type !== 'Polygon')
        return null;

      // const { geometry } = plot;

      // Calculate the bounding box [minX, minY, maxX, maxY]
      const [minX, minY, maxX, maxY] = bbox(plot.geometry);

      // Define the bounds of the image as the four corners of the bounding box
      const bounds = [
        [minX, maxY], // top-left corner
        [maxX, maxY], // top-right corner
        [maxX, minY], // bottom-right corner
        [minX, minY], // bottom-left corner
      ];
      // Check if the source and layer with the same id already exist
      const sourceId = `ndviImageSource-${plot.properties.id}`;
      const layerId = `ndviImageLayer-${plot.properties.id}`;

      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }

      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }

      // Add the image as a raster layer
      map.addSource(sourceId, {
        type: 'image',
        url: imageUrl,
        coordinates: bounds,
      });

      map.addLayer({
        id: layerId,
        type: 'raster',
        source: sourceId,
        paint: {
          'raster-opacity': 0.85,
        },
      });
    },
    [weeksBefore]
  );

  const getNdviLayerId = (plot) => {
    return `ndviImageLayer-${plot.properties.id}-${weeksBefore}`;
  };

  const handleNDVIImageDownload = useCallback(
    async (plot, { accessToken, map, timeTravel }) => {
      // clone the plot object to avoid mutating the original object
      if (!map) throw new Error('map is not defined');

      // Check if the ndvi layer for this plot is already added to the map
      const layerId = `ndviImageLayer-${plot.properties.id}`;

      if (map.getLayer(layerId)) {
        if (timeTravel) {
          console.log('only time travel');
          map.removeLayer(layerId);
        } else {
          console.log('NDVI layer already added for this plot');
          return;
        }
      }
      try {
        // if the plot is already loading, return
        if (ndviLoading.includes(plot.properties.id)) return;
        setNdviLoading([...ndviLoading, plot.properties.id]);
        const ndviDataUrl = await fetchNDVIImage(plot, {
          weeksBefore: weeksBefore,
          accessToken: accessToken,
        });

        if (!plot) throw new Error('plot is not defined');
        console.log('mapp', map);

        if (ndviDataUrl) {
          addNDVIImageToMap(ndviDataUrl, plot, { map });
        }
      } catch (error) {
        console.log('error in loading ndvi layer');
      } finally {
        setNdviLoading(ndviLoading.filter((id) => id !== plot.properties.id));
      }
      // Add the image to the map
    },
    [weeksBefore, addNDVIImageToMap]
  );

  const plotLineStyle = {
    id: 'plots-line-layer',
    type: 'line',
    paint: {
      // 'fill-color': '#e31717', // Plot fill color
      // 'fill-opacity': 0.2,
      'line-color': '#e31717', // Plot outline color
      'line-width': 2, // Outline width set to 2px
    },
  };

  const plotFillStyle = {
    id: 'plots-layer',
    type: 'fill',
    paint: {
      'fill-color': '#e31717', // Plot fill color
      'fill-opacity': 0,
    },
  };

  const areFeaturesDrawn = (drawRef) => {
    const draw = drawRef?.current?.getAll();
    const features = draw?.features || [];
    return features.length > 0;
  };

  const handleMapClick = (event) => {
    // If there are any draw features, don't show the popup
    if (areFeaturesDrawn(drawRef)) {
      console.log('no popup info');
      setClickedPlot(null);
      return;
    }

    const features = map.queryRenderedFeatures(event.point, {
      layers: ['plots-layer'],
    });

    if (features.length > 0) {
      const clickedPlot = features[0];
      setClickedPlot({
        lngLat: event.lngLat,
        plot: clickedPlot, // Assuming the plot name is in the 'name' property
      });
    } else {
      setClickedPlot(null); // Hide popup if no plot is clicked
    }
  };

  const handleMouseEnter = () => {
    map.getCanvas().style.cursor = 'pointer';
  };

  const handleMouseLeave = () => {
    map.getCanvas().style.cursor = '';
  };

  const isBoundingBoxIntersecting = useCallback((plotBounds, mapBounds) => {
    const [minX, minY, maxX, maxY] = plotBounds;
    const [[mapMinX, mapMinY], [mapMaxX, mapMaxY]] = mapBounds.toArray();

    // Check for intersection
    return !(
      minX > mapMaxX ||
      maxX < mapMinX ||
      minY > mapMaxY ||
      maxY < mapMinY
    );
  }, []);

  const handleViewportChange = useCallback(
    ({ timeTravel = false }) => {
      if (!map) return;
      // Get the current zoom level
      const zoom = map.getZoom();

      // Check if the zoom level is within the desired range
      const zoomLevelThreshold = 10; // Define the zoom level threshold
      if (zoom >= zoomLevelThreshold) {
        const bounds = map.getBounds();

        // Check for each plot if it's visible in the current map view
        plots.forEach((plot) => {
          const plotBounds = bbox(plot); // Get bounding box of the plot

          // Check if the plot's bounding box intersects with the map's bounds
          if (isBoundingBoxIntersecting(plotBounds, bounds)) {
            // Call the function to download and add NDVI image
            handleNDVIImageDownload(plot, { accessToken, map, timeTravel });
          }
        });
      }
    },
    [
      map,
      plots,
      accessToken,
      handleNDVIImageDownload,
      isBoundingBoxIntersecting,
    ]
  );

  const handleTimeTravel = useCallback(() => {
    handleViewportChange({ timeTravel: true });
  }, [handleViewportChange]);

  useEffect(() => {
    const debouncedHandleViewportChange = debounce(handleTimeTravel, 500);
    debouncedHandleViewportChange();
    return () => {
      debouncedHandleViewportChange.cancel();
    };
  }, [weeksBefore, handleTimeTravel]);

  useEffect(() => {
    if (map) {
      map.on('click', 'plots-layer', handleMapClick);
      map.on('mouseenter', 'plots-layer', handleMouseEnter);
      map.on('mouseleave', 'plots-layer', handleMouseLeave);
      map.on('moveend', handleViewportChange);
      map.on('zoomend', handleViewportChange);
    }

    return () => {
      if (map) {
        map.off('click', 'plots-layer', handleMapClick);
        map.off('mouseenter', 'plots-layer', handleMouseEnter);
        map.off('mouseleave', 'plots-layer', handleMouseLeave);
        map.off('moveend', handleViewportChange);
        map.off('zoomend', handleViewportChange);
      }
    };
  }, [map, showPlots]);

  if (!showPlots) return null;

  return (
    <>
      <Source
        id='plots'
        type='geojson'
        data={{ type: 'FeatureCollection', features: plots }}
      >
        <Layer {...plotLineStyle} />
        <Layer {...plotFillStyle} />
      </Source>

      {clickedPlot && (
        <PlotPopup
          popupInfo={clickedPlot}
          onClose={() => setClickedPlot(null)}
        />
      )}
    </>
  );
}
