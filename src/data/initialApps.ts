import { DockerApp } from '../types/types';

export const initialApps: DockerApp[] = [
  {
    id: 'first_run_up',
    name: 'First Run Initialization',
    description: 'Initial setup script',
    category: 'SYSTEM',
    selected: false,
    initialized: false,
    pendingInstall: true,
    installOrder: 0,
    visible: false
  },
  {
    id: 'media_server',
    name: 'Jellyfin',
    installOrder: 1,
    description: 'Install Jellyfin Media Server',
    category: 'MEDIA SERVERS',
    selected: false,
    initialized: false,
    visible: true,
    iconUrl: 'https://raw.githubusercontent.com/jellyfin/jellyfin-web/refs/heads/master/src/favicon.png',
    inputs: [
      {
      title: 'server_ip',
      type: 'text',
      required: false,
      value: 'http://172.14.0.11:8096',
      visible: false  // This input won't show in UI but will be included in .env
      },
      {
        title: 'Admin User',
        type: 'text',
        required: true,
        placeholder: 'Enter a username for the Admin user'
      },
      {
        title: 'Admin Password',
        type: 'text',
        required: true,
        isPassword: true,
        placeholder: 'Enter a password for the Admin user'
      },
      {
        title: 'enableTranscoding',
        type: 'checkbox',
        required: false
      },
      {
        title: 'mediaPath',
        type: 'conditional-text',
        required: false,
        dependentField: {
          title: 'Media Path',
          placeholder: 'Enter media path on host',
          required: true
        }
      }
    ]
  },
  {
    id: 'm3uparser',
    name: 'm3uparser',
    installOrder: 1.1,
    description: 'Install parser for m3u VOD',
    category: 'M3U UTILITY',
    selected: false,
    initialized: false,
    visible: true,
    iconUrl: 'https://raw.githubusercontent.com/Xaque8787/m3uparser/refs/heads/main/parser/assets/other_img/m3u_ico256.png',
    inputs: [
      {
        title: 'M3U URL',
        type: 'text',
        required: true,
        quoteValue: true,
        placeholder: 'Enter m3u URLS'
      },
      {
        title: 'Run Interval',
        type: 'text',
        required: false,
        placeholder: 'Enter a interval in hours for each parser run'
      },
      {
        title: 'enable LiveTV',
        type: 'checkbox',
        required: false
      }
    ]
  },
  {
    id: 'threadfin_proxy',
    name: 'Threadfin',
    installOrder: 1.2,
    description: 'Install Threadfin m3u proxy',
    category: 'M3U UTILITY',
    selected: false,
    initialized: false,
    visible: true,
    iconUrl: 'https://raw.githubusercontent.com/Threadfin/Threadfin/refs/heads/main/html/img/threadfin.ico',
    inputs: [
      {
        title: 'Username',
        type: 'text',
        required: true,
        placeholder: 'Enter username'
      },
      {
        title: 'Password',
        type: 'text',
        required: true,
        placeholder: 'Enter password'
      },
      {
        title: 'Use parsed livetv.m3u from parser',
        type: 'checkbox',
        required: false,
        prereqs: [{
          appId: 'm3uparser',
          inputTitle: 'enable LiveTV',
          value: true
        }]
      }
    ]
  },
  {
    id: 'sonarr_app',
    name: 'Sonarr',
    installOrder: 2,
    description: 'TV Series management application',
    category: 'STARR APPS',
    selected: false,
    initialized: false,
    visible: true,
    inputs: [
      {
        title: 'port',
        type: 'text',
        required: true,
        isPassword: true,
        placeholder: 'Enter desired port'
      },
      {
        title: 'Enable Basic Auth',
        type: 'checkbox',
        required: false
      }
    ]
  },
  {
    id: 'radarr_app',
    name: 'Radarr',
    installOrder: 3,
    description: 'Movie management application',
    category: 'STARR APPS',
    selected: false,
    initialized: false,
    visible: true,
    inputs: [
      {
        title: 'Port',
        type: 'text',
        required: true,
        placeholder: 'Enter desired port'
      },
      {
        title: 'Enable Basic Auth',
        type: 'checkbox',
        required: false
      }
    ]
  },
  {
    id: 'prowlarr_app',
    name: 'Prowlarr',
    installOrder: 4,
    description: 'Index management application',
    category: 'STARR APPS',
    selected: false,
    initialized: false,
    visible: true,
    prereqs: ['sonarr_app', 'radarr_app'],
    inputs: [
      {
        title: 'Port',
        type: 'text',
        required: true,
        placeholder: 'Enter desired port'
      },
      {
        title: 'Enable Basic Auth',
        type: 'checkbox',
        required: false
      }
    ]
  },
  {
    id: 'blackhole_app',
    name: 'Blackhole',
    installOrder: 5,
    description: 'Blackhole downloader for sonarr/radarr',
    category: 'DOWNLOAD CLIENTS',
    selected: false,
    initialized: false,
    visible: true,
    inputs: [
      {
        title: 'TorBox',
        type: 'conditional-text',
        required: false,
        dependentField: {
          title: 'TorBox API Key',
          placeholder: 'Enter TorBox API key',
          required: true
        }
      },
      {
        title: 'RealDebrid',
        type: 'conditional-text',
        required: false,
        dependentField: {
          title: 'RealDebrid API Key',
          placeholder: 'Enter RealDebrid API key',
          required: true
        }
      },
      {
        title: 'Allow un-cached',
        type: 'checkbox',
        required: false
      }
    ]
  },
  {
    id: 'dashboard',
    name: 'Dashy Dashboard',
    installOrder: 6,
    description: 'Monitor your applications',
    category: 'MANAGEMENT',
    selected: false,
    initialized: false,
    visible: true,
    prereqs: ['media_server'],
    inputs: [
      {
        title: 'Title',
        type: 'text',
        required: true,
        placeholder: 'Enter a title for your Dashboard'
      },
      {
        title: 'enableMetrics',
        type: 'checkbox',
        required: false
      }
    ]
  },
  {
    id: 'first_run_down',
    name: 'First Run Finalization',
    description: 'Final setup script',
    category: 'SYSTEM',
    selected: false,
    initialized: false,
    pendingInstall: true,
    installOrder: 999,
    visible: false
  }
];