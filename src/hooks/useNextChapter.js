import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { mergeFormValuesWithContext } from '@utils/workflows-ui';
import { addSessionStorageItem, getSessionStorage } from '@/utils/sessionStorage';

export default function useNextChapter({ currentContext, lockHistoryRender }) {
  const router = useRouter();

  useEffect(() => {
    const { id: customerId, activityId } = router.query;
    const handler = (event) => {
      const {
        detail: { nextChapterName },
      } = event;

      const payload = mergeFormValuesWithContext(currentContext);

      addSessionStorageItem('gwf:history', {
        [`gwf:${activityId}`]: payload,
      });

      const sessionStorage = getSessionStorage('gwf:history') || {};

      if (sessionStorage[`${nextChapterName}-${activityId}`]) {
        lockHistoryRender();
      }

      router.push(`/customers/${customerId}/workflows/${nextChapterName}/${activityId}`);
    };
    window.addEventListener('gwf:loadNextChapter', handler);
    return () => window.removeEventListener('gwf:loadNextChapter', handler);
  }, [currentContext, router, lockHistoryRender]);
}
