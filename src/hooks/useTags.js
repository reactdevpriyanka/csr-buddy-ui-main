import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useCustomerTags } from '@/hooks/tags';
import { updateTag } from '@/services/tags';
import { SNACKVARIANTS } from '@components/SnackMessage/SnackMessage';

export default function useTags() {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { id: customerId } = router.query;

  const { data: tags, availableTags, error, mutate, ...rest } = useCustomerTags();

  const updateCustomerTags = useCallback(
    async (tag) => {
      try {
        await updateTag({ customerId, tag });
        const newTags = tags.map((t) => (t.displayName === tag.displayName ? tag : t));
        mutate(newTags);
        return true;
      } catch {
        enqueueSnackbar({
          key: 'tags-bad-request',
          variant: SNACKVARIANTS.ERROR,
          messageHeader: 'Whoops!',
          listItems: [`Unable to save tag ${tag.name} modification`],
        });
      }
      return false;
    },
    [tags, mutate, customerId, enqueueSnackbar],
  );

  return {
    ...rest,
    tags,
    availableTags,
    updateCustomerTags,
    error,
  };
}
