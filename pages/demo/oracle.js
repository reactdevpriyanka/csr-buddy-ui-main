import { useEffect } from 'react';
import SingleTabLayout from '@/components/Layout/SingleTabLayout';

export default function OracleDemoPage() {
  useEffect(() => {
    const handler = () => {
      window.__ORACLE__.emit('loadInSuzzie', {
        href: 'https://google.com',
      });
    };
    window.addEventListener('loadInSuzzie', handler);
    return () => window.removeEventListener('loadInSuzzie', handler);
  }, []);

  return <div id="oracle">{'Hello from OSvC'}</div>;
}

OracleDemoPage.getLayout = () => SingleTabLayout;
