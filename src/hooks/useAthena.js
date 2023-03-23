import axios from 'axios';
import { useCallback } from 'react';
import useSWR from 'swr';

export default function useAthena() {
  const { data: lang, error } = useSWR(
    '/gateway/configuration',
    (url) =>
      axios
        .get(url)
        .then(({ data }) => data)
        .catch(() => {}),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    },
  );

  const getSubstitutedStr = ({ str, fallback = '', substitutions = [] }) => {
    let result = str || fallback;
    if (!substitutions || substitutions?.length === 0 || !str) return result;

    for (const [idx, curReplacement] of substitutions.entries()) {
      result = result.replace('${' + idx + '}', curReplacement);
    }

    return result;
  };

  const getLang = useCallback(
    (key, opts = {}) => {
      if (!lang) return opts?.fallback ?? '';
      const defaultstr = lang[key] ?? opts?.fallback ?? '';
      if (opts?.substitutions && lang[key]) {
        const tmp = getSubstitutedStr({
          str: lang[key],
          fallback: opts?.fallback,
          substitutions: opts.substitutions,
        });
        return tmp;
      }
      return defaultstr;
    },
    [lang],
  );

  const getKeys = useCallback((key) => (lang && lang[key]) ?? [], [lang]);

  return { getLang, lang: error ? {} : lang, getKeys, getSubstitutedStr };
}
