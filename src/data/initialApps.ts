import { DockerApp } from '../types/types';

export const initialApps: DockerApp[] = [
  {
    id: 'media_server',
    name: 'Jellyfin',
    description: 'Install Jellyfin Media Server',
    category: 'Media Server',
    selected: false,
    initialized: false,
    inputs: [
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
        placeholder: 'Enter a password for the Admin user'
      },
      {
        title: 'mediaPath',
        type: 'text',
        required: false,
        placeholder: 'Path to media directory'
      },
      {
        title: 'enableTranscoding',
        type: 'checkbox',
        required: false
      }
    ]
  },
  {
    id: 'sonarr_app',
    name: 'Sonarr',
    description: 'TV Series management application',
    category: 'STARR APPS',
    selected: false,
    initialized: false,
    inputs: [
      {
        title: 'port',
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
    id: 'radarr_app',
    name: 'Radarr',
    description: 'Movie management application',
    category: 'STARR APPS',
    selected: false,
    initialized: false,
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
    id: 'Prowlarr_app',
    name: 'Prowlarr',
    description: 'Index management application',
    category: 'STARR APPS',
    selected: false,
    initialized: false,
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
    id: 'dashboard',
    name: 'Dashy Dashboard',
    description: 'Monitor your applications',
    category: 'WEB APPS',
    selected: false,
    initialized: false,
    prereq: 'media_server',
    inputs: [
      {
        title: 'apikey',
        type: 'text',
        required: true,
        placeholder: 'Enter API key'
      },
      {
        title: 'environmentVar1',
        type: 'text',
        required: false,
        placeholder: 'Optional environment variable'
      },
      {
        title: 'enableMetrics',
        type: 'checkbox',
        required: false
      }
    ]
  }
];
