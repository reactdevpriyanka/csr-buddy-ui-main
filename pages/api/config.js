export default async function config(req, res) {
  res.status(200).json({
    appVersion: process.env.APP_VERSION,
    chewyEnv: process.env.CHEWY_ENV,
    sfwUrl: process.env.SFW_URL,
    responsiveDebug: JSON.parse(process.env.RESPONSIVE_DEBUG || 'false'),
  });
}
