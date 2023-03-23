const { fromEnv } = require('@aws-sdk/credential-provider-env');
const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');

module.exports = function listTablesCommand() {
  const client = new DynamoDBClient({ region: 'us-east-1' });
  const command = new ListTablesCommand({});
  try {
    return client.send(command);
  } catch (e) {
    throw e; // rethrow to force the stacktrace to include this line
  }
};
