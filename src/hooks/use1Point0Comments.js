import useSWR from 'swr';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function use1Point0Comments() {
  const router = useRouter();

  return useSWR(`/api/v1/customer/${router.query.id}/comments`, (url) =>
    axios.get(url).then(({ data }) => data),
  );
}
