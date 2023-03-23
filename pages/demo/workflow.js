import useSWR from 'swr';
import SingleTabLayout from '@components/Layout/SingleTabLayout';
import Workflow from '@components/Workflow/Workflow';
import axios from 'axios';

const fetcher = async () => axios.get('/api/demo/workflow').then(({ data }) => data);

export default function DemoWorkflow() {
  const { error, data } = useSWR('/api/demo/workflow', fetcher);

  if (error) {
    return <div>{'An error has occurred'}</div>;
  }

  if (!data) {
    return <div>{'Loading'}</div>;
  }

  return (
    <div data-testid="demo-workflow">
      <Workflow workflow={data} activityId={null} />
    </div>
  );
}

DemoWorkflow.getLayout = () => SingleTabLayout;
