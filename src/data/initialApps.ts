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
    iconUrl: '/images/jellyfin.png',
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
    iconUrl: '/images/m3uparser.png',
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
    iconUrl: '/images/threadfin.ico',
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
    iconUrl: '/images/sonarr.png',
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
    installOrder: 2.1,
    description: 'Movie management application',
    category: 'STARR APPS',
    selected: false,
    initialized: false,
    visible: true,
    iconUrl: '/images/radarr.png',
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
    installOrder: 2.2,
    description: 'Index management application',
    category: 'STARR APPS',
    selected: false,
    initialized: false,
    visible: true,
    prereqs: ['sonarr_app', 'radarr_app'],
    iconUrl: '/images/prowlarr.png',
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
    id: 'recyclarr_app',
    name: 'Reyclarr',
    installOrder: 2.3,
    description: 'Movie management application',
    category: 'STARR APPS',
    selected: false,
    initialized: false,
    visible: true,
    iconUrl: '/images/recyclarr.png',
    inputs: [
      {
        title: 'Port',
        envName: 'RECYCLARR_PORT',
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
    id: 'jellyseerr_app',
    name: 'Jellyseerr',
    installOrder: 2.5,
    description: 'Media request application',
    category: 'STARR APPS',
    selected: false,
    initialized: false,
    visible: true,
    prereqs: ['sonarr_app', 'radarr_app'],
    iconUrl: '/images/jellyseerr.png',
    inputs: [
      {
        title: 'Port',
        envName: 'JELLYSEERR_PORT',
        type: 'text',
        required: true,
        placeholder: 'Enter desired port'
      },
      {
        title: 'Enable Basic Auth',
        envName: 'JELLYSEERR_BASIC_AUTH',
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
    iconUrl: '/images/black-hole.svg',
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
    id: 'sabnzbd',
    name: 'SABNZBD',
    installOrder: 5.1,
    description: 'SAB download client for usenet',
    category: 'DOWNLOAD CLIENTS',
    selected: false,
    initialized: false,
    visible: true,
    iconUrl: '/images/sabnzbd.ico',
    inputs: [
      {
        title: 'Newsgroup Server',
        envName: 'NEWS_SERVER',
        type: 'text',
        required: true
      },
      {
        title: 'Port',
        envName: 'NEWS_PORT',
        type: 'text',
        required: true
      },
      {
        title: 'Save to host',
        envName: 'SAVE_TO_HOST',
        type: 'conditional-text',
        required: false,
        dependentField: {
          title: 'Host media path',
          envName: 'HOST_MEDIA_PATH',
          placeholder: 'Enter path on host to save media',
          required: true
        }
      }
    ]
  },
  {
    id: 'qbittorrent',
    name: 'QbitTorrent',
    installOrder: 5.2,
    description: 'Torrent download client',
    category: 'DOWNLOAD CLIENTS',
    selected: false,
    initialized: false,
    visible: true,
    iconUrl: '/images/qbit.png',
    inputs: [
      {
        title: 'Server Host IP',
        envName: 'HOST_IP',
        type: 'text',
        required: true
      },
      {
        title: 'Host Port',
        envName: 'HOST_PORT',
        type: 'text',
        required: true
      },
      {
        title: 'Save to host',
        envName: 'SAVE_TO_HOST',
        type: 'conditional-text',
        required: false,
        dependentField: {
          title: 'Host media path',
          envName: 'HOST_MEDIA_PATH',
          placeholder: 'Enter path on host to save media',
          required: true
        }
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
    iconUrl: '/images/dashy.png',
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
    id: 'dockge',
    name: 'Dockge',
    installOrder: 6.2,
    description: 'Monitor your containers',
    category: 'MANAGEMENT',
    selected: false,
    initialized: false,
    visible: true,
    prereqs: [],
    iconUrl: '/images/dockge.png',
    inputs: [
      {
        title: 'Username',
        envName: 'DOCKGE_USER',
        type: 'text',
        required: true,
        placeholder: 'Enter a username for your Dockge instance'
      },
      {
        title: 'Password',
        envName: 'DOCKGE_PASS',
        type: 'text',
        required: true,
        placeholder: 'Enter a password for your Dockge instance'
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