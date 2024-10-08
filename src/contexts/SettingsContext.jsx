import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getMapSettings } from '@/api/mapApi';
import { usePrefersDarkMode } from '@/hooks/usePrefersDarkMode';
import useAccessToken from '@/hooks/useAccessToken';

// Create a new context for the map
const SettingsContext = createContext();

const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    basemap: {
      id: 'basic',
      zoom: 6,
      longitude: -40.153113,
      latitude: -35.9503019,
    },
  });
  const isDarkMode = usePrefersDarkMode();
  const accessToken = useAccessToken();

  const [initialViewState, setInitialViewState] = useState(null);

  useEffect(() => {
    getMapSettings().then((data) => {
      console.log('mapsettings', data);
      console.log('setting mmap settings');
      setInitialViewState({
        latitude: data.options.center.lat,
        longitude: data.options.center.lng,
        zoom: data.options.zoom,
      });
      setSettings({ ...settings, mapId: data.id });
    });
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings,
        isDarkMode,
        initialViewState,
        accessToken,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { SettingsContext, SettingsProvider };
