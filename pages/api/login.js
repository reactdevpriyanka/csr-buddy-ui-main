import axios from 'axios';

export default async function loginHandler(req, res) {
  if (!process.env.NEXT_PUBLIC_MOCK_ORACLE) {
    res.status(401).send();
    return;
  }
  if (!['dev', 'qat', 'stg'].includes(process.env.CHEWY_ENV)) {
    res.status(405).send();
    return;
  }
  const response = await axios
    .post(`https://cs-platform.csbb.${process.env.ENVIRONMENT}.chewy.com/cs-platform/v1/login`, {
      userId: process.env.NEXT_PUBLIC_ORACLE_USERNAME,
      password: process.env.NEXT_PUBLIC_ORACLE_PASSWORD,
    })
    .catch(({ response }) => response);

  switch (response.status) {
    case 200:
      res.status(200).json({
        at: response.headers['authorization'],
        token: response.headers['token'],
      });
      break;
    default:
      res.status(response.status).send(response.data);
      break;
  }
}
