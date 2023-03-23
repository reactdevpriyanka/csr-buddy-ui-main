/* eslint-disable jsx-a11y/anchor-is-valid */
import cn from 'classnames';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/router';
import Link from 'next/link';
import * as blueTriangle from '@utils/blueTriangle';
import { getDayDateYearTimeTimezone } from '@/utils';
import { currencyFormatter, snakeCaseToTitleCase } from '@/utils/string';
import { useCustomerReturns } from '@/hooks/useCustomerReturns';
import { useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  accordion: {
    border: '2px solid #CCCCCC',
    borderRadius: '4px',
    boxShadow: `0px 0px 16px rgba(0, 0, 0, 0.16)`,
    '&.Mui-expanded': {
      border: '2px solid #999999 !important',
    },
  },
  accordionSummary: {
    flexDirection: 'row-reverse', // Moves the expand icon to the left side
    ...theme.p.x(12),
    '& .MuiAccordionSummary-content.Mui-expanded': {
      margin: 0,
    },
  },
  breadCrumbLink: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontStyle: 'Regular',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(16),
    letterSpacing: theme.utils.fromPx(0.25),
    color: '#031657',
    '&:focus, &:hover': {
      cursor: 'pointer',
    },
  },
  panel: {
    display: 'grid',
    width: theme.spacing(13),
    '&:not(:first-child):not(:last-child)': {
      width: theme.spacing(20),
    },
    '&:last-child': {
      gridTemplateColumns: 'max-content',
    },
  },
  label: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: theme.utils.fromPx(12),
    lineHeight: theme.utils.fromPx(15),
    color: '#666666',
  },
  headerPanel: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginRight: theme.utils.fromPx(16),
    marginLeft: theme.utils.fromPx(16),
  },
  text: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '16px',
    color: '#121212',
  },
  textLink: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '16px',
    color: '#2661CE',
    cursor: 'pointer',
  },
  leftAlign: {
    textAlign: 'left',
  },
  rightAlign: {
    textAlign: 'right',
  },
  summaryPanel: {
    borderTop: theme.utils.fromPx(2),
    borderTopColor: '#CCCCCC',
    borderTopStyle: 'solid',
    padding: `${theme.utils.fromPx(12)} ${theme.utils.fromPx(24)}`,

    display: 'grid',
    gridTemplateColumns: 'auto 150px 150px',

    '&:first-of-type': {
      borderTopColor: '#999999',
    },
  },
  grid: {
    display: 'grid',
  },
  status: {
    width: '42px',
    height: '18px',
    background: '#FFC80C',
    borderRadius: '4px',
    textAlign: 'center',
    padding: '0px 16px',

    fontFamily: 'Roboto, bold',
    fontWeight: '700',
    fontSize: '14px',
    lineHeight: '18px',
    color: '#121212',

    whiteSpace: 'nowrap',
  },
  statusPanel: {
    textAlign: 'right',
  },
  oddColor: {
    backgroundColor: '#FAFAFA',
  },
}));

const OrderReturnsView = () => {
  const classes = useStyles();
  const router = useRouter();
  const { id: customerId } = router.query;
  const activityFeedHref = `/customers/${customerId}/activity`;
  const { data: returnData } = useCustomerReturns();

  const [componentInitialized, setComponentInitialized] = useState(false);
  const pageName = 'Order Returns Tab - VT';

  useEffect(() => {
    // do component load work
    setComponentInitialized(true);
    blueTriangle.start(pageName);
  }, []);

  useEffect(() => {
    if (componentInitialized) {
      // do component unload
      blueTriangle.end(pageName);
    }
  }, [componentInitialized]);

  if (!returnData) {
    return null;
  }

  return (
    <div>
      <Link href={activityFeedHref}>
        <span data-testid="order:returns:link" className={classes.breadCrumbLink}>
          {`ACTIVITY FEED / RETURNS`}
        </span>
      </Link>
      <Typography variant="h5" fontWeight={900} py={3}>
        Returns
      </Typography>
      <div>
        {returnData.map((entry) => {
          const orderId = entry.id;
          const curReturns = entry.returns;

          return (
            <Accordion
              key={orderId}
              className={classes.accordion}
              data-testid={`order:return:${orderId}:accordion`}
              /* defaultExpanded */
            >
              <AccordionSummary
                data-testid={`order:return:${orderId}:accordion:summary`}
                className={classes.accordionSummary}
                expandIcon={<ExpandMoreIcon sx={{ color: 'black' }} />}
              >
                <div className={classes.headerPanel}>
                  <div className={classes.panel}>
                    <span className={classes.label}>Order</span>
                    <Link href={`/customers/${customerId}/orders/${orderId}`}>
                      <a
                        className={classes.btnViewDetails}
                        data-testid={`order:return:${orderId}:link`}
                      >
                        <span
                          data-testid={`order:return:${orderId}:link:text`}
                          className={classes.textLink}
                        >
                          {orderId}
                        </span>
                      </a>
                    </Link>
                  </div>

                  <div className={classes.panel}>
                    <span className={classes.label}>Date Created</span>
                    <span
                      data-testid={`order:return:${orderId}:dateCreated`}
                      className={classes.text}
                    >
                      {getDayDateYearTimeTimezone(entry.timePlaced)}
                    </span>
                  </div>

                  <div className={classes.panel}>
                    <span className={classes.label}>Date Updated</span>
                    <span
                      data-testid={`order:return:${orderId}:dateUpdated`}
                      className={classes.text}
                    >
                      {getDayDateYearTimeTimezone(entry.timeUpdated)}
                    </span>
                  </div>
                </div>
              </AccordionSummary>
              <AccordionDetails sx={{ pb: 4, padding: 0 }}>
                <div data-testid={`order:return:${orderId}:accordion:details`}>
                  {curReturns.map((curReturn, index) => {
                    const isConcession = curReturn?.type === 'CONCESSION';

                    let numOfItems = curReturn?.items?.length;

                    let concessionAmount = curReturn?.totalCredit;

                    const isOddRow = index % 2 === 0;

                    return (
                      <div
                        key={curReturn.id}
                        className={cn(classes.summaryPanel, isOddRow && classes.oddColor)}
                      >
                        <div className={classes.grid}>
                          <Link
                            href={`/customers/${customerId}/orders/${orderId}/order-returns-details/${curReturn.id}`}
                          >
                            <span
                              data-testid={`order:return:summary:${curReturn.id}:link`}
                              className={classes.textLink}
                            >
                              {`${_.capitalize(curReturn.type)}(${curReturn.id})`}
                            </span>
                          </Link>
                          <span className={classes.label}>{`Created: ${getDayDateYearTimeTimezone(
                            curReturn.timeCreated,
                          )}`}</span>
                        </div>

                        <div className={cn(classes.grid, classes.rightAlign)}>
                          <span className={classes.label}>
                            {isConcession ? 'Concession Amount' : `# of items`}
                          </span>
                          <span
                            data-testid={`order:return:${orderId}:dateUpdated`}
                            className={cn(classes.text, isConcession ? classes.rightAlign : '')}
                          >
                            {isConcession ? currencyFormatter(concessionAmount) : numOfItems}
                          </span>
                        </div>

                        <div className={classes.statusPanel}>
                          <span
                            data-testid={`order:return:${curReturn.id}:status`}
                            className={classes.status}
                          >
                            {snakeCaseToTitleCase(curReturn.state)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
};

export default OrderReturnsView;
