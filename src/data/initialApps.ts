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
        title: 'Server IP',
        envName: 'server_ip',
        type: 'text',
        required: false,
        value: 'http://10.21.12.3:8096',
        visible: false
      },
      {
        title: 'Admin User',
        envName: 'AdminUser',
        type: 'text',
        required: true,
        placeholder: 'Enter a username for the Admin user'
      },
      {
        title: 'Admin Password',
        envName: 'AdminPassword',
        type: 'text',
        required: true,
        isPassword: true,
        placeholder: 'Enter a password for the Admin user'
      },
      {
        title: 'Enable Transcoding',
        envName: 'ENABLE_TRANSCODING',
        type: 'checkbox',
        required: false
      },
      {
        title: 'Add Media Path',
        envName: 'ADD_MEDIA_PATH',
        type: 'conditional-text',
        required: false,
        dependentField: {
          title: 'Media Path',
          envName: 'MEDIA_PATH',
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
        envName: 'M3U_URL',
        type: 'text',
        required: true,
        quoteValue: true,
        placeholder: 'Enter m3u URLS'
      },
      {
        title: 'Run Interval',
        envName: 'RUN_INTERVAL',
        type: 'text',
        required: false,
        placeholder: 'Enter a interval in hours for each parser run'
      },
      {
        title: 'Enable LiveTV',
        envName: 'ENABLE_LIVETV',
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
        envName: 'thread_user',
        type: 'text',
        required: true,
        placeholder: 'Enter username'
      },
      {
        title: 'Password',
        envName: 'thread_pass',
        type: 'text',
        isPassword: true,
        required: true,
        
        placeholder: 'Enter password'
      },
      {
        title: 'm3u URLS',
        envName: 'M3U_URL',
        type: 'text',
        description: 'Can be multiple urls seperated by comma',
        required: true,
        quoteValue: true,
        placeholder: 'Enter m3u URLS'
      },
      {
        title: 'EPG URLS',
        envName: 'EPG_URL',
        type: 'text',
        description: 'Can be multiple urls seperated by comma',
        required: true,
        quoteValue: true,
        placeholder: 'Enter EPG URLS'
      },
      {
        title: 'Host_ip',
        envName: 'host',
        type: 'text',
        required: false,
        value: '10.21.12.4',
        visible: false
      },
      {
        title: 'Port',
        envName: 'port',
        type: 'text',
        required: false,
        value: '34400',
        visible: false
      },
      {
        title: 'Use parsed livetv.m3u from parser',
        envName: 'USE_PARSED_LIVETV',
        type: 'checkbox',
        required: false,
        prereqs: [{
          appId: 'm3uparser',
          inputTitle: 'Enable LiveTV',
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
        title: 'Port',
        envName: 'SONARR_PORT',
        type: 'text',
        required: true,
        isPassword: true,
        placeholder: 'Enter desired port'
      },
      {
        title: 'Enable Basic Auth',
        envName: 'SONARR_BASIC_AUTH',
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
        envName: 'RADARR_PORT',
        type: 'text',
        required: true,
        placeholder: 'Enter desired port'
      },
      {
        title: 'Enable Basic Auth',
        envName: 'RADARR_BASIC_AUTH',
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
        envName: 'PROWLARR_PORT',
        type: 'text',
        required: true,
        placeholder: 'Enter desired port'
      },
      {
        title: 'Enable Basic Auth',
        envName: 'PROWLARR_BASIC_AUTH',
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
        envName: 'ENABLE_TORBOX',
        type: 'conditional-text',
        required: false,
        dependentField: {
          title: 'TorBox API Key',
          envName: 'TORBOX_API_KEY',
          placeholder: 'Enter TorBox API key',
          required: true
        }
      },
      {
        title: 'RealDebrid',
        envName: 'ENABLE_REALDEBRID',
        type: 'conditional-text',
        required: false,
        dependentField: {
          title: 'RealDebrid API Key',
          envName: 'REALDEBRID_API_KEY',
          placeholder: 'Enter RealDebrid API key',
          required: true
        }
      },
      {
        title: 'Allow un-cached',
        envName: 'ALLOW_UNCACHED',
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
        envName: 'DASHBOARD_TITLE',
        type: 'text',
        required: true,
        placeholder: 'Enter a title for your Dashboard'
      },
      {
        title: 'Enable Metrics',
        envName: 'ENABLE_METRICS',
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