import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Header, Breadcrumbs } from '@components/Workflow';
import axios from 'axios';
import useSWR from 'swr';
import useAthena from '@/hooks/useAthena';
import AssistiveText from '@/components/AssistiveText/AssistiveText';
import { useRouter } from 'next/router';
import usePayment from '@/hooks/usePayment';
import { Typography } from '@mui/material';
import FeatureFlag from '../../features/FeatureFlag';
import CustomerSidebarLayout from './CustomerSidebarLayout';
const useStyles = makeStyles((theme) => ({
  form: {},
}));

const WorkflowLayout = ({ children }) => {
  const classes = useStyles();
  const router = useRouter();
  const { getLang } = useAthena();
  const { activityId, id, flowName } = router.query;
  const { data: paymentDetails = [] } = usePayment(activityId);
  const disputeMessageEnabled = paymentDetails?.hasDisputes;
  const isFixIssueStartPage = flowName === 'fixIssue-start';
  const returnRateThreshhold = Number.parseFloat(getLang('ReturnRateThreshHoldText'));

  const { data, error } = useSWR(
    id ? `/api/v1/customer/${id}/customerInsights` : null,
    async (url) =>
      axios.get(url).then(({ data }) => (data?.[0]?.returnInsight?.returnRate ? data : null)),
  );

  return (
    <CustomerSidebarLayout>
      <Header />
      <Breadcrumbs />
      <FeatureFlag flag="feature.explorer.ReturnRateBannerEnabled">
        {error && <Typography color="red">Unable to Fetch ReturnRate for this Customer</Typography>}
        {data &&
          isFixIssueStartPage &&
          returnRateThreshhold < Number.parseFloat(data[0].returnInsight.returnRate) * 100 && (
            <AssistiveText
              content={getLang('ReturnRateBannerText', {
                substitutions: [returnRateThreshhold],
                fallback:
                  'Customer has received a return for more than 80% of their orders within the past year',
              })}
            />
          )}
      </FeatureFlag>
      <FeatureFlag flag="feature.enablePaypalDisputeMessage">
        <div>
          {isFixIssueStartPage && disputeMessageEnabled && (
            <AssistiveText content="This order has a PayPal dispute and is not eligible for refund or concession" />
          )}
        </div>
      </FeatureFlag>
      <div className={classes.form} data-testid="gwf:content">
        {children}
      </div>
    </CustomerSidebarLayout>
  );
};

WorkflowLayout.propTypes = {
  children: PropTypes.node,
};

export default WorkflowLayout;
