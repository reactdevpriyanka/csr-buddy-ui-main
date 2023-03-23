import { URL } from 'url'; // eslint-disable-line unicorn/prefer-node-protocol
import axios from 'axios';

/**
 * String representing the custom OSvC header for application context.
 * This tells Oracle which application is sending the request.
 *
 * @type {String}
 */
const OSVC_REST_APPLICATION_CONTEXT_HEADER = 'OSvC-CREST-Application-Context';

/**
 * String representing the CSR Buddy 2.0 application context for Oracle.
 *
 * @type {String}
 */
const OSVC_REST_APPLICATION_CONTEXT_VALUE = 'CSRBuddy2.0';

/**
 * Retrieves the ICR categories from Oracle.
 *
 * @param  {Object}  req  NextJS request object
 * @param  {Object}  res  NextJS response object
 * @return {Void}
 */
export default async function icrCategoriesHandler(req, res) {
  const { ORACLEREST_BASEURL, ORACLEREST_AUTH, ORACLEREST_ICR_ID } = process.env;

  if (ORACLEREST_AUTH) {
    const data = { id: Number.parseInt(ORACLEREST_ICR_ID, 10) };

    const endpoint = new URL(
      '/services/rest/connect/v1.4/analyticsReportResults',
      ORACLEREST_BASEURL,
    ).href;
    const icrCategories = await axios
      .post(endpoint, data, {
        headers: {
          [OSVC_REST_APPLICATION_CONTEXT_HEADER]: OSVC_REST_APPLICATION_CONTEXT_VALUE,
          Authorization: `Basic ${ORACLEREST_AUTH}`,
        },
      })
      .then(({ data }) => data)
      .catch(
        (error) =>
          // eslint-disable-next-line no-console
          console.error(error) || {        
            rows: [],
          },
      );

    res.json({ icrCategories });
  } else {
    // eslint-disable-next-line no-console
    console.error('Oracle token not found; skipped fetching ICR categories');
    res.json({ rows: [] });
  }
}
