import getConfig from 'next/config';

export const env = () => getConfig()?.publicRuntimeConfig?.chewyEnv;

export const suzzie = (path) => `https://cs-platform.csbb.${env()}.chewy.com${path}`;
