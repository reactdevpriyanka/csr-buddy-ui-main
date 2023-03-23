const { fromEnv } = require('@aws-sdk/credential-provider-env');
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');

module.exports = function putItemCommand(TableName, Item) {
  const client = new DynamoDBClient({ region: 'us-east-1' });
  const command = new PutItemCommand({ TableName, Item });
  try {
    return client.send(command);
  } catch (e) {
    throw e; // rethrow to force the stacktrace to include this line
  }
};
