import { GraphQLClient } from 'graphql-request';
import { v4 as uuidv4 } from 'uuid';

export const gqlRequest = (url, query, headers) =>
  new GraphQLClient(url, {
    headers: {
      'x-request-id': 'CSRB-' + uuidv4(),
    },
  })
    .request(query, null, headers)
    .catch(async (error) => {
      const parsedError = JSON.parse(JSON.stringify(error));
      return {
        error: true,
        message: parsedError?.response?.error || parsedError?.response?.errors?.[0]?.message,
      };
    });
