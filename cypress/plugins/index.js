/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

const path = require('path');
const { format } = require('date-fns');
const listTables = require('./listTables');
const putItem = require('./putItem');

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

function getEnvConfigurationFile(env) {
  const pathToConfigFile = path.resolve(__dirname, '../configFiles', `cypress.${env}.json`);
  return require(pathToConfigFile);
}

function getCsrbTable() {
  return listTables().then((response) =>
    response.TableNames.find((tableName) => tableName.indexOf('csrb') > -1),
  );
}

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    log(message) {
      console.log(message);
      return null;
    },

    table(message) {
      console.table(message);
      return null;
    },

    listTables,
    putItem,
    getCsrbTable,

    addActivity({ type, subType, id, customerId, details }) {
      const now = new Date();
      return getCsrbTable().then((table) => {
        return putItem(table, {
          pk: {
            S: `${type}#${id}`,
          },
          sk: {
            S: `${subType}`,
          },
          customerId: {
            S: `${customerId}`,
          },
          details: {
            S: JSON.stringify(details),
          },
          rts: {
            N: `${Date.now()}`,
          },
          timestamp: {
            S: `${format(now, 'yyyy-MM-dd')}T${format(now, 'HH:mm:ss')}.${format(now, 'SSS')}Z`,
          },
        });
      });
    },
  });

  const envConfig = getEnvConfigurationFile(config.env.fileConfig || 'local');

  return { ...config, ...envConfig };
};
