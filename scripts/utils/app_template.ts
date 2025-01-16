/**
 * This is a comprehensive template showing all possible configurations
 * for apps, inputs, and conditional inputs in the application.
 */

import { DockerApp } from '../../src/types/types';

/**
 * Example app with all possible configurations
 */
export const templateApp: DockerApp = {
  // Required fields
  id: 'template_app',                    // Unique identifier for the app
  name: 'Template App',                  // Display name
  description: 'Template description',    // App description
  category: 'TEMPLATE',                  // App category for grouping
  selected: false,                       // UI selection state
  initialized: false,                    // Installation state

  // Optional fields
  installOrder: 1.5,                     // Order of installation (decimal for fine-grained control)
  visible: true,                         // Whether to show in UI
  iconUrl: '/images/template.png',       // App icon URL
  prereqs: ['other_app_id'],            // Array of required app IDs

  // Installation states
  pendingInstall: false,                 // Whether app is pending installation
  pendingUpdate: false,                  // Whether app is pending update
  pendingRemoval: false,                 // Whether app is pending removal

  // App inputs array
  inputs: [
    // Basic text input
    {
      title: 'Basic Input',              // Display name
      envName: 'BASIC_INPUT',            // Environment variable name
      type: 'text',                      // Input type: 'text', 'checkbox', or 'conditional-text'
      required: true,                    // Whether input is required
      description: 'Help text',          // Optional help text
      placeholder: 'Enter value',        // Placeholder text
      value: '',                         // Current value
      visible: true,                     // Whether to show in UI
      quoteValue: false,                 // Whether to quote value in .env file
      isPassword: false,                 // Whether to mask value
      prereqs: [{                        // Optional prerequisites
        appId: 'other_app',             // Required app ID
        inputTitle: 'Other Input',       // Required input from other app
        value: true                      // Required value
      }]
    },

    // Checkbox input
    {
      title: 'Feature Toggle',
      envName: 'FEATURE_ENABLED',
      type: 'checkbox',
      required: false,
      description: 'Enable special feature',
      value: false
    },

    // Conditional text with dependent fields
    {
      title: 'Advanced Feature',
      envName: 'ADVANCED_FEATURE',
      type: 'conditional-text',
      required: false,
      description: 'Enable advanced configuration',
      value: false,
      dependentField: [
        // Text dependent field
        {
          title: 'API Key',
          envName: 'API_KEY',
          type: 'text',                  // Dependent field type: 'text' or 'checkbox'
          description: 'Enter API key',
          placeholder: 'Enter key',
          required: true,
          isPassword: true,              // Will be masked in UI and files
          quoteValue: true,              // Will be quoted in .env file
          value: ''
        },
        // Checkbox dependent field
        {
          title: 'Debug Mode',
          envName: 'DEBUG_MODE',
          type: 'checkbox',
          description: 'Enable debugging',
          required: false,
          value: false
        },
        // Dependent field with prerequisites
        {
          title: 'Server URL',
          envName: 'SERVER_URL',
          type: 'text',
          description: 'Service endpoint',
          placeholder: 'https://...',
          required: true,
          quoteValue: true,
          prereqs: [{
            appId: 'other_app',
            inputTitle: 'Other Feature',
            value: true
          }],
          value: ''
        }
      ]
    }
  ]
};

/**
 * Example of how the app configuration appears in different files:
 * 
 * 1. Environment (.env) file:
 * BASIC_INPUT=value
 * FEATURE_ENABLED=true
 * ADVANCED_FEATURE=true
 * API_KEY=<encrypted_value>
 * DEBUG_MODE=true
 * SERVER_URL="https://example.com"
 * 
 * 2. Environment (env.json) file:
 * {
 *   "template_app": {
 *     "initialized": true,
 *     "config": {
 *       "Basic Input": "value",
 *       "Feature Toggle": true,
 *       "Advanced Feature": true,
 *       "API Key": "********",
 *       "Debug Mode": true,
 *       "Server URL": "https://example.com"
 *     }
 *   }
 * }
 * 
 * 3. Selections (selections.json) file:
 * {
 *   "apps": [{
 *     "id": "template_app",
 *     "name": "Template App",
 *     ...
 *     "inputs": [
 *       {
 *         "title": "Basic Input",
 *         "value": "value",
 *         ...
 *       },
 *       {
 *         "title": "Advanced Feature",
 *         "value": true,
 *         "dependentField": [
 *           {
 *             "title": "API Key",
 *             "value": "********",
 *             ...
 *           },
 *           ...
 *         ]
 *       }
 *     ]
 *   }]
 * }
 */