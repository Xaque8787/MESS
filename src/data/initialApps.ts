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
    installOrder: -1,
    visible: false
  },
  {
    id: 'run_up',
    name: 'Pre-deployment Setup',
    description: 'Setup script that runs before every deployment',
    category: 'SYSTEM',
    selected: false,
    initialized: false,
    pendingInstall: true,
    installOrder: 0, // Run before everything
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
        enable_override: true,
        required: false,
        dependentField: [
          {
            title: 'Media Root Path',
            envName: 'HOST_ROOT',
            type: 'text',
            placeholder: 'Enter media path on host',
            required: true
          },
          {
            title: 'Movie Folder Name',
            envName: 'HOST_MOVIE',
            type: 'text',
            placeholder: 'Enter media path on host',
            required: true
          },
          {
            title: 'TV Folder Name',
            envName: 'HOST_TV',
            type: 'text',
            placeholder: 'Enter media path on host',
            required: true
          }]
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
        isPassword: true,
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
        envName: 'LIVE_TV',
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
        isPassword: true,
        placeholder: 'Enter m3u URLS'
      },
      {
        title: 'EPG URLS',
        envName: 'EPG_URL',
        type: 'text',
        description: 'Can be multiple urls separated by comma',
        required: true,
        quoteValue: true,
        isPassword: true,
        placeholder: 'Enter EPG URLS'
      },
      {
        title: 'Enable tuner and epg in Jellyfin',
        envName: 'ENABLE_LIVETV',
        type: 'checkbox',
        required: false,
        prereqs: [{
          appId: 'media_server'
        }]
      },
      {
        title: 'Host_ip',
        envName: 'thread_host',
        type: 'text',
        required: false,
        value: '10.21.12.4',
        visible: false
      },
      {
        title: 'Port',
        envName: 'thread_port',
        type: 'text',
        required: false,
        value: '34400',
        visible: false
      },
      {
        title: 'Use parsed livetv.m3u file from M3Uparser',
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
    installOrder: 2.3,
    description: 'TV Series management application',
    category: 'STARR APPS',
    selected: false,
    initialized: false,
    visible: true,
    iconUrl: '/images/sonarr.png',
    prereqs: ['prowlarr_app'],
    inputs: [
      {
        title: 'Sonarr IP',
        envName: 'SONARR_IP',
        type: 'text',
        required: false,
        value: '10.21.12.12',
        visible: false
      },
      {
        title: 'Port',
        envName: 'SONARR_PORT',
        type: 'text',
        required: false,
        placeholder: 'Enter desired port, blank will set 8989'
      },
      {
        title: 'Enable 4K instance',
        envName: 'SONARR_4k',
        type: 'conditional-text',
        required: false,
        dependentField: [
          {
            title: 'Sonarr 4k Port',
            envName: 'RADARR_4k_PROVIDED_PORT',
            type: 'text',
            placeholder: 'Enter desired port, blank will set 8787'
          }
        ]
      },
      {
        title: 'Disable Auth for local access',
        envName: 'SONARR_DISABLE_AUTH',
        type: 'checkbox',
        required: false
      }
    ]
  },
  {
    id: 'radarr_app',
    name: 'Radarr',
    installOrder: 2.2,
    description: 'Movie management application',
    category: 'STARR APPS',
    selected: false,
    initialized: false,
    visible: true,
    iconUrl: '/images/radarr.png',
    prereqs: ['prowlarr_app'],
    inputs: [
      {
        title: 'Radarr IP',
        envName: 'RADARR_IP',
        type: 'text',
        required: false,
        value: '10.21.12.11',
        visible: false
      },
      {
        title: 'Port',
        envName: 'RADARR_PORT',
        type: 'text',
        required: false,
        placeholder: 'Enter desired port, blank will set 7878'
      },
      {
        title: 'Enable 4K instance',
        envName: 'RADRR_4k',
        type: 'conditional-text',
        required: false,
        dependentField: [
          {
            title: 'Radarr 4k Port',
            envName: 'RADARR_4k_PROVIDED_PORT',
            type: 'text',
            placeholder: 'Enter desired port, blank will set 8787'
          }
        ]
      },
      {
        title: 'Disable Auth for local access',
        envName: 'RADARR_DISABLE_AUTH',
        type: 'checkbox',
        required: false
      }
    ]
  },
  {
    id: 'prowlarr_app',
    name: 'Prowlarr',
    installOrder: 2.1,
    description: 'Index management application',
    category: 'STARR APPS',
    selected: false,
    initialized: false,
    visible: true,
    iconUrl: '/images/prowlarr.png',
    inputs: [
      {
        title: 'Prowlarr IP',
        envName: 'PROWLARR_IP',
        type: 'text',
        required: false,
        value: '10.21.12.10',
        visible: false
      },
      {
        title: 'Port',
        envName: 'PROWLARR_PORT',
        type: 'text',
        placeholder: 'Enter desired port'
      },
      {
        title: 'Disable Auth for local access',
        envName: 'PROWLARR_DISABLE_AUTH',
        type: 'checkbox',
        required: false
      },
      {
        title: 'Enable Zilean Indexer',
        envName: 'ENABLE_ZILEAN',
        type: 'conditional-text',
        required: false,
        dependentField: [
          {
            title: 'Prefer Magnet Links',
            envName: 'ZILEAN_PREFER_MAGENT',
            type: 'checkbox'
          }]
      }
    ]
  },
  {
    id: 'recyclarr_app',
    name: 'Reyclarr',
    installOrder: 2.4,
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
    prereqs: ['sonarr_app', 'radarr_app', 'media_server'],
    iconUrl: '/images/jellyseerr.png',
    inputs: [
      {
        title: 'Port',
        envName: 'JELLYSEERR_PORT',
        type: 'text',
        required: false,
        placeholder: 'Enter desired port, if blank defaults to 5055'
      },
      {
        title: 'jellyseerr_ip',
        envName: 'JELLYSEERR_IP',
        type: 'text',
        required: false,
        value: '10.21.12.5',
        visible: false
      }
    ]
  },
  {
    id: 'blackhole_app',
    name: 'Decypharr',
    installOrder: 2,
    description: 'Blackhole downloader for sonarr/radarr',
    category: 'DOWNLOAD CLIENTS',
    selected: false,
    initialized: false,
    visible: true,
    iconUrl: '/images/black-hole.svg',
    inputs: [
      {
        title: 'RealDebrid',
        envName: 'ENABLE_REALDEBRID',
        type: 'conditional-text',
        required: false,
        dependentField: [
            {
          title: 'RealDebrid API Key',
          envName: 'REALDEBRID_API_KEY',
          type: 'text',
          isPassword: true,
          placeholder: 'Enter RealDebrid API key',
          required: true
            },
            {
          title: 'RealDebrid Webdav Username',
          envName: 'REALDEBRID_WEBDAV_USER',
          type: 'text',
          isPassword: true,
          placeholder: 'Enter RealDebrid Webdav username',
          required: true
            },
            {
          title: 'RealDebrid Webdav Password',
          envName: 'REALDEBRID_WEBDAV_PASS',
          type: 'text',
          isPassword: true,
          placeholder: 'Enter RealDebrid Webdav password',
          required: true
            }
        ]
      },
      {
        title: 'TorBox',
        envName: 'ENABLE_TORBOX',
        type: 'conditional-text',
        required: false,
        dependentField: [{
          title: 'TorBox API Key',
          envName: 'TORBOX_API_KEY',
          type: 'text',
          placeholder: 'Enter TorBox API key',
          required: true
        }]
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
        dependentField: [{
          title: 'Host media path',
          envName: 'HOST_MEDIA_PATH',
          type: 'text',
          placeholder: 'Enter path on host to save media',
          required: true
        }]
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
        dependentField: [{
          title: 'Host media path',
          envName: 'HOST_MEDIA_PATH',
          type: 'text',
          placeholder: 'Enter path on host to save media',
          required: true
        }]
      }
    ]
  },
  {
    id: 'DDNS',
    name: 'DNS',
    installOrder: 7.2,
    description: 'Dynamic DNS update',
    category: 'NETWORKING',
    selected: false,
    initialized: false,
    visible: true,
    iconUrl: '/images/dns.png',
    inputs: [
      {
        title: 'DuckDNS',
        envName: 'DUCK_DNS',
        type: 'conditional-text',
        required: false,
        dependentField: [
          {
            title: 'DuckDNS Token',
            envName: 'DUCK_DNS_TOKEN',
            type: 'text',
            description: 'Your Duckdns.org token',
            required: true
          },
          {
            title: 'Subdomain 1',
            envName: 'DUCK_DNS_SUB1',
            type: 'text',
            description: 'DuckDNS subdomain',
            required: false
          },
          {
            title: 'Subdomain 2',
            envName: 'DUCK_DNS_SUB2',
            type: 'text',
            description: 'DuckDNS subdomain',
            required: false
          },
          {
            title: 'Subdomain 3',
            envName: 'DUCK_DNS_SUB3',
            type: 'text',
            description: 'DuckDNS subdomain',
            required: false
          }
        ]
      }
    ]
  },
  {
    id: 'caddy',
    name: 'Caddy',
    installOrder: 7,
    description: 'Caddy reverse proxy',
    category: 'NETWORKING',
    selected: false,
    initialized: false,
    visible: true,
    iconUrl: '/images/caddy.png',
    inputs: [
      {
        title: 'Reverse Proxy Apps',
        envName: 'RPROXY_APP',
        type: 'conditional-text',
        required: false,
        dependentField: [
          {
            title: 'Jellyfin',
            envName: 'JELLYFIN_RPROXY',
            type: 'text',
            description: 'Subdomain for Jellyfin server',
            required: false,
            placeholder: 'Subdomain for Jellyfin server',
            prereqs: [{
              appId: 'media_server'
            }]
          },
          {
            title: 'Jellyseerr',
            envName: 'JELLYSEERR_RPROXY',
            type: 'text',
            description: 'Subdomain for Jellyseerr instance',
            required: false,
            placeholder: 'Subdomain for Jellyseerr instance',
            prereqs: [{
              appId: 'media_server'
            }]
          }
        ]
      }
    ]
  },
  {
    id: 'wgeasy',
    name: 'WG-EASY',
    installOrder: 7.4,
    description: 'WG Server',
    category: 'NETWORKING',
    selected: false,
    initialized: false,
    visible: true,
    iconUrl: '/images/wgeasy.png',
    inputs: [
      {
        title: 'Host',
        envName: 'WG_HOST',
        type: 'text',
        required: true
      },
      {
        title: 'Password',
        envName: 'PASSWORD_HASH',
        type: 'text',
        required: true
      }
    ]
  },
  {
    id: 'gluetun_vpn',
    name: 'Gluetun VPN',
    installOrder: 7.1,
    description: 'VPN for containers',
    category: 'NETWORKING',
    selected: false,
    initialized: false,
    visible: true,
    iconUrl: 'https://raw.githubusercontent.com/qdm12/gluetun/refs/heads/master/title.svg',
    inputs: [
        {
         title: 'VPN Provider_test',
         envName: 'VPN_SERVICE_test',
         type: 'dropdown',
         tooltip: 'Your API key can be found in your account settings',
         required: true,
         options: [
           { label: 'NordVPN', value: 'nordvpn' },
           { label: 'ExpressVPN', value: 'expressvpn' },
           { label: 'Private Internet Access', value: 'pia' }
         ]
      },
      {
        title: 'VPN Provider',
        envName: 'VPN_SERVICE_PROVIDER',
        tooltip: 'Your API key can be found in your account settings',
        type: 'text',
        required: true
      },
      {
        title: 'Wiregaurd VPN',
        envName: 'WG_VPN_CONFIG',
        type: 'conditional-text',
        required: false,
        dependentField: [
          {
           title: 'Server Location',
           envName: 'VPN_SERVER',
           type: 'dropdown',
           required: true,
           options: [
             { label: 'United States', value: 'us' },
             { label: 'United Kingdom', value: 'uk' },
             { label: 'Germany', value: 'de' }
           ]
          },
          {
            title: 'Private Key',
            envName: 'WIREGUARD_PRIVATE_KEY',
            type: 'text',
            tooltip: 'Your API key can be found in your account settings how laodna fas dasd asd asdf assdasdas sdsdsadsdasda',
            description: 'Wiregaurd private key',
            required: true
          },
          {
            title: 'Wireguard address',
            envName: 'WIREGUARD_ADDRESSES',
            type: 'text',
            required: true,
            description: 'Wireguard address'
          },
          {
            title: 'WG type',
            envName: 'VPN_TYPE',
            type: 'text',
            required: false,
            value: 'wireguard',
            visible: false,
          }]
      },
      {
        title: 'Open VPN',
        envName: 'OPEN_VPN_CONFIG',
        type: 'conditional-text',
        required: false,
        dependentField: [
          {
            title: 'OpenVPN type',
            envName: 'VPN_TYPE',
            type: 'text',
            required: false,
            value: 'openvpn',
            visible: false
          },
          {
            title: 'OpenVPN user',
            envName: 'OPENVPN_USER',
            type: 'text',
            required: true,
            placeholder: 'Username'
          },
          {
            title: 'OpenVPN password',
            envName: 'OPENVPN_PASS',
            type: 'text',
            required: true,
            placeholder: 'Password'
          }]
      },
      {
        title: 'SABNZBD',
        envName: 'SAB_VPN',
        tooltip: 'Your API key can be found in \nyour account settings',
        type: 'checkbox',
        required: false,
        description: 'VPN for SABNZBD',
        prereqs: [{
              appId: 'sabnzbd'
            }]
      },
      {
        title: 'QbitTorrent',
        envName: 'QBIT_VPN',
        type: 'checkbox',
        required: false,
        description: 'VPN for QbitTorrent',
        prereqs: [{
              appId: 'qbittorrent'
            }]
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
    id: 'run_down',
    name: 'Pre-deployment Setup',
    description: 'Setup script that runs before every deployment',
    category: 'SYSTEM',
    selected: false,
    initialized: false,
    pendingInstall: true,
    installOrder: 998, // Run before everything
    visible: false
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