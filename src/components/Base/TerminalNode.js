// import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const TerminalNode = () => {
  const router = useRouter();

  const { id: customerId, activityId } = router.query;

  const fixIssueLink = `/customers/${customerId}/workflows/fixIssue-start/${activityId}`;

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('gwf:process'));
  }, []);

  return (
    <div>
      <a href={fixIssueLink}>{'Back to fix issue'}</a>
    </div>
  );
};

TerminalNode.propTypes = {};

export default TerminalNode;
