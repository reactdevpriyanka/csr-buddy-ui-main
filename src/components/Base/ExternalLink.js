import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useSuzzieTab from '@/hooks/useSuzzieTab';
import useCSPlatform from '@/hooks/useCSPlatform';

const ExternalLink = ({ href, id }) => {
  const [hasFired, setHasFired] = useState(false);

  const { getSuzzieUrl } = useCSPlatform();

  const loadInSuzzie = useSuzzieTab();

  useEffect(() => {
    if (!hasFired) {
      loadInSuzzie({
        preventDefault() {},
        target: {
          href: getSuzzieUrl(href),
        },
      });

      setHasFired(true);
    }
  }, [href, loadInSuzzie, hasFired, setHasFired, getSuzzieUrl]);

  /**
   * Prevents a button with an external link 'child'
   * from getting stuck and not going to Suzzie
   *
   * @see {https://chewyinc.atlassian.net/browse/CSRBT-406}
   */
  useEffect(() => {
    const handler = (event) => {
      if (hasFired && event.detail === id) {
        loadInSuzzie({
          preventDefault() {},
          target: {
            href: getSuzzieUrl(href),
          },
        });
      }
    };

    window.addEventListener('gwf:reloadInSuzzie', handler);
    return () => window.removeEventListener('gwf:reloadInSuzzie', handler);
  }, [id, loadInSuzzie, href, hasFired, getSuzzieUrl]);

  return null;
};

ExternalLink.propTypes = {
  id: PropTypes.string,
  href: PropTypes.string,
};

export default ExternalLink;
