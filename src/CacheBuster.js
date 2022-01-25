import React from 'react';
import packageJson from '../package.json';
global.appVersion = packageJson.version;

const semverChanged = (versionA, versionB) => {
    return versionA !== versionB;
}

export class CacheBuster extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isLatestVersion: false,
      refreshCacheAndReload: () => {
        console.log('Clearing cache and hard reloading...')
        if (window.caches) {
          // Service worker cache should be cleared with caches.delete()
          window.caches.keys().then(function(names) {
            for (let name of names) caches.delete(name);
          });
        }
        // delete browser cache and hard reload
        fetch('/js/bundle.js', {cache:"reload"}).then(() => {
          window.location.reload();
        });
      }
    };
  }

  componentDidMount() {
    fetch('/meta.json', {cache:"reload"})
      .then((response) => response.json())
      .then((meta) => {
        const latestVersion = meta.version;
        const currentVersion = global.appVersion;

        const shouldForceRefresh = semverChanged(latestVersion, currentVersion);
        if (shouldForceRefresh) {
          console.log(`Recipes: We have a new version - ${latestVersion}. Refreshing Cache`);
          this.setState({ loading: false, isLatestVersion: false });
        } else {
          console.log(`Recipes: Version - ${latestVersion}.`);
          this.setState({ loading: false, isLatestVersion: true });
        }
      });
  }

  render() {
    const { loading, isLatestVersion, refreshCacheAndReload } = this.state;
		if (loading || isLatestVersion  )
		{
		  return "";
		}
    refreshCacheAndReload();
		return "Reload Rquired";
  }
}
