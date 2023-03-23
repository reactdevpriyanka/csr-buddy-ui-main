import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url) => axios.get(url).then(({ data }) => data);

const usePetBreed = (typeId) => {
  return useSWR(typeId ? `/api/v1/pets/types/${typeId}/breeds` : null, fetcher);
};

export default usePetBreed;
