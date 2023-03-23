import { makeStyles } from '@material-ui/core/styles';
import useGiftCards from '@/hooks/useGiftCards';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Skeleton } from '@mui/material';
import { useRouter } from 'next/router';
import usePromotions from '@/hooks/usePromotions';
import Link from 'next/link';
import PurchasedGiftCards from './Tables/PurchasedGiftCards';
import TargetedPromotionCodes from './Tables/TargetedPromotionCodes';
import PromotionCodeHistory from './Tables/PromotionCodeHistory';
import RedeemedGiftCards from './Tables/RedeemedGiftCards';

const useStyles = makeStyles((theme) => ({
  root: {},
  accordionSummary: {
    flexDirection: 'row-reverse', // Moves the expand icon to the left side
  },
  promotionsContainer: {
    marginTop: theme.utils.fromPx(32),
  },
  table: {
    borderCollapse: 'collapse',
    textAlign: 'left',
    width: '100%',
    '& th, td': {
      fontSize: theme.utils.fromPx(12),
      padding: `0 ${theme.utils.fromPx(10)}`,
      height: theme.utils.fromPx(32),
      color: 'black',
    },
    '& thead th': {
      backgroundColor: '#F5F5F5',
      border: '1px solid #F5F5F5',
      borderBottom: '1px solid #979797',
    },
    '& tbody tr': {
      border: '1px solid #979797',
    },
  },
  errorText: {
    color: 'red',
  },
  breadCrumbLink: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontStyle: 'Regular',
    fontSize: theme.utils.fromPx(11),
    lineHeight: theme.utils.fromPx(16),
    letterSpacing: theme.utils.fromPx(0.25),
    color: '#031657',
    '&:focus, &:hover': {
      cursor: 'pointer',
    },
  },
}));

const GiftCardsAndPromotionsView = () => {
  const classes = useStyles();
  const router = useRouter();
  const { id: customerId } = router.query;
  const activityFeedHref = `/customers/${customerId}/activity`;

  const {
    purchasedGiftCards,
    redeemedGiftCards,
    purchasedGiftCardsErrors,
    redeemedGiftCardsErrors,
  } = useGiftCards();

  const {
    assignedPromotions,
    assignedPromotionsErrors,
    promotionsHistory,
    promotionsHistoryErrors,
  } = usePromotions();

  return (
    <div className={classes.root}>
      <Link href={activityFeedHref}>
        <span data-testid="giftcards-and-promotions:link" className={classes.breadCrumbLink}>
          {`ACTIVITY FEED / GIFT CARDS AND PROMOTIONS`}
        </span>
      </Link>
      <Typography variant="h5" fontWeight={900} py={3}>
        Gift Cards and Promotions
      </Typography>
      <div>
        <Accordion data-testid="giftcards:accordion" defaultExpanded>
          <AccordionSummary
            className={classes.accordionSummary}
            expandIcon={<ExpandMoreIcon sx={{ color: 'black' }} />}
            sx={{
              paddingX: '12px',
              '& .MuiAccordionSummary-content.Mui-expanded': {
                margin: 0,
              },
            }}
          >
            <Typography variant="h6" pl="10px">
              Gift Cards
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pb: 4 }}>
            <Typography pb={1}>
              <span>Purchased</span>
              {!purchasedGiftCardsErrors && purchasedGiftCards?.length === 0 && <i> - None</i>}
              {purchasedGiftCardsErrors && (
                <span className={classes.errorText}>
                  {' '}
                  {' Error loading customer purchased gift cards'}
                </span>
              )}
            </Typography>
            {!purchasedGiftCards && !purchasedGiftCardsErrors && (
              <>
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </>
            )}
            <PurchasedGiftCards
              giftcards={purchasedGiftCards}
              classes={classes}
              customerId={customerId}
            />
            <Typography pt={3} pb={0.5}>
              <span>Redeemed</span>
              {!redeemedGiftCardsErrors && redeemedGiftCards?.length === 0 && <i> - None</i>}
              {redeemedGiftCardsErrors && (
                <span className={classes.errorText}>
                  {' '}
                  {" Error loading customer's redeemed gift cards"}
                </span>
              )}
            </Typography>
            {!redeemedGiftCards && !redeemedGiftCardsErrors && (
              <>
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </>
            )}
            <RedeemedGiftCards
              giftcards={redeemedGiftCards}
              classes={classes}
              customerId={customerId}
            />
          </AccordionDetails>
        </Accordion>
      </div>

      <div className={classes.promotionsContainer}>
        <Accordion data-testid="promotions:accordion" defaultExpanded>
          <AccordionSummary
            className={classes.accordionSummary}
            expandIcon={<ExpandMoreIcon sx={{ color: 'black' }} />}
            sx={{
              paddingX: '12px',
              '& .MuiAccordionSummary-content.Mui-expanded': {
                margin: 0,
              },
            }}
          >
            <Typography variant="h6" pl="10px">
              Promotions
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pb: 4 }}>
            <Typography pb={1}>
              <span>Targeted Promotion Codes</span>
              {!assignedPromotionsErrors && assignedPromotions?.length === 0 && <i> - None</i>}
              {assignedPromotionsErrors && (
                <span className={classes.errorText}>
                  {' '}
                  {" Error loading customer's targeted promotion codes"}
                </span>
              )}
            </Typography>
            {!assignedPromotions && !assignedPromotionsErrors && (
              <>
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </>
            )}
            <TargetedPromotionCodes promotions={assignedPromotions} classes={classes} />
            <Typography pt={3} pb={0.5}>
              <span>History</span>
              {!promotionsHistoryErrors && promotionsHistory?.length === 0 && <i> - None</i>}
              {promotionsHistoryErrors && (
                <span className={classes.errorText}>
                  {' '}
                  {" Error loading customer's promotion code history"}
                </span>
              )}
            </Typography>
            {!promotionsHistory && !promotionsHistoryErrors && (
              <>
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </>
            )}
            <PromotionCodeHistory
              promotions={promotionsHistory}
              classes={classes}
              customerId={customerId}
            />
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

export default GiftCardsAndPromotionsView;
