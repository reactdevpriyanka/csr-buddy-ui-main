import { forwardRef, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { SnackbarContent, useSnackbar } from 'notistack';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/WarningAmberOutlined';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export const SNACKVARIANTS = {
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
  SUCCESS: 'sucess',
};

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      minWidth: '440px !important',
      paddingBottom: 0,
    },
  },
  card: {
    width: '100%',
  },
  cardInfo: {
    color: theme.palette.white,
    backgroundColor: theme.palette.blue['600'],
  },
  cardError: {
    color: theme.palette.white,
    backgroundColor: theme.palette.red['600'],
  },
  cardSuccess: {
    color: theme.palette.white,
    backgroundColor: theme.palette.green.dark,
  },
  cardWarning: {
    color: theme.palette.black,
    backgroundColor: '#FFC80C',
    padding: '16px',
    width: '847px',
    borderRadius: '8px',
  },
  messageHeader: {
    fontWeight: 'bold',
  },
  messageSubheader: {
    marginLeft: '8px',
  },
  typography: {
    display: 'inline',
  },
  actionRoot: {
    padding: '8px 8px 8px 16px',
    justifyContent: 'space-between',
  },
  messageContent: {
    marginRight: 'auto',
  },
  link: {
    marginLeft: 'auto',
  },
  buttonLink: {
    fontWeight: 'bold',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  buttonLinkInfo: {
    color: theme.palette.white,
  },
  buttonLinkError: {
    color: theme.palette.white,
  },
  buttonLinkSuccess: {
    color: theme.palette.white,
  },
  buttonLinkWarning: {
    color: theme.palette.black,
  },
  subtitleList: {
    listStylePosition: 'inside',
    margin: '-16px 0 0 0',
    padding: '0 48px 0 54px',
  },
}));

const variantIcons = {
  [SNACKVARIANTS.INFO]: <CheckCircleOutlineIcon />,
  [SNACKVARIANTS.ERROR]: <ErrorOutlineIcon />,
  [SNACKVARIANTS.SUCCESS]: <CheckCircleOutlineIcon />,
  [SNACKVARIANTS.WARNING]: <ErrorOutlineIcon />,
};

// eslint-disable-next-line react/display-name
const SnackMessage = forwardRef(
  ({ id, variant = SNACKVARIANTS.INFO, messageHeader, messageSubheader, listItems, link }, ref) => {
    const { label: linkLabel, onClick: linkOnClick = () => null, href: linkHref } = link || {};
    const classes = useStyles();
    const { closeSnackbar } = useSnackbar();

    const handleDismiss = useCallback(() => {
      closeSnackbar(id);
    }, [id, closeSnackbar]);

    const handleClickLink = (event) => {
      if (linkOnClick) {
        linkOnClick(event);
      } else if (linkHref) {
        window.open(linkHref);
      }
    };

    return (
      <SnackbarContent ref={ref} className={classes.root}>
        <Card
          data-testid={`snack-card-${variant}`}
          className={classnames({
            [classes.cardInfo]: variant === SNACKVARIANTS.INFO,
            [classes.cardError]: variant === SNACKVARIANTS.ERROR,
            [classes.cardSuccess]: variant === SNACKVARIANTS.SUCCESS,
            [classes.cardWarning]: variant === SNACKVARIANTS.WARNING,
          })}
        >
          <CardActions classes={{ root: classes.actionRoot }}>
            {variantIcons[variant]}
            <div className={classes.messageContent}>
              <Typography
                variant="h6"
                className={classnames(classes.typography, classes.messageHeader)}
              >
                {messageHeader}
              </Typography>
              {messageSubheader && (
                <Typography
                  variant="subtitle1"
                  className={classnames(classes.typography, classes.messageSubheader)}
                >
                  {messageSubheader}
                </Typography>
              )}
            </div>
            <div className={classes.link}>
              {linkLabel && (linkOnClick || linkHref) && variant !== SNACKVARIANTS.WARNING && (
                <Button
                  data-testid={`actionButton-${variant}`}
                  className={classnames(classes.buttonLink, {
                    [classes.buttonLinkInfo]: variant === SNACKVARIANTS.INFO,
                    [classes.buttonLinkError]: variant === SNACKVARIANTS.ERROR,
                    [classes.buttonLinkSuccess]: variant === SNACKVARIANTS.SUCCESS,
                  })}
                  onClick={handleClickLink}
                >
                  {linkLabel}
                </Button>
              )}
              {linkLabel && linkOnClick && variant === SNACKVARIANTS.WARNING && (
                <Button
                  data-testid={`actionButton-${variant}`}
                  className={classnames(classes.buttonLink, {
                    [classes.buttonLinkWarning]: variant === SNACKVARIANTS.WARNING,
                  })}
                  onClick={() => {
                    handleClickLink();
                    handleDismiss();
                  }}
                >
                  {linkLabel}
                </Button>
              )}
              {variant !== SNACKVARIANTS.WARNING && (
                <IconButton
                  data-testid={`closeIcon-${variant}`}
                  onClick={handleDismiss}
                  className={classnames({
                    [classes.buttonLinkInfo]: variant === SNACKVARIANTS.INFO,
                    [classes.buttonLinkError]: variant === SNACKVARIANTS.ERROR,
                    [classes.buttonLinkSuccess]: variant === SNACKVARIANTS.SUCCESS,
                  })}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </div>
          </CardActions>
          {Array.isArray(listItems) && (
            <CardActions>
              <ul className={classes.subtitleList}>
                {listItems.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
            </CardActions>
          )}
        </Card>
      </SnackbarContent>
    );
  },
);

SnackMessage.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, //toast key
  messageHeader: PropTypes.string,
  messageSubheader: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  listItems: PropTypes.arrayOf(PropTypes.string),
  link: PropTypes.shape({ label: PropTypes.string, onClick: PropTypes.func }),
  variant: PropTypes.oneOf(Object.values(SNACKVARIANTS)),
};

export default SnackMessage;
