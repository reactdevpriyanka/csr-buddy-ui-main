import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import useTags from '@/hooks/useTags';
import Notification from '@components/Notifications';
import Tag from '@components/Tag';
import { Divider } from '@material-ui/core';
import Link from '@mui/material/Link';
import { FeatureFlag } from '@/features';
import useAthena from '@/hooks/useAthena';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: '5px',
  },
  header: {
    display: 'flex',
    padding: '0',
    margin: `0 0 ${theme.spacing(1.2)}`,
    paddingBottom: '5px',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: '16px',
    color: theme.palette.gray.light,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    ...theme.fonts.h2,
    padding: '0.25rem 0.25rem',
    color: theme.palette.blue.dark,
  },
  img: {
    //todo rename to something more meaningful once implemented
    fontSize: 'small',
    color: '#031657',
    transform: 'rotate(90deg)',
  },
  addImageIcon: {
    fontSize: 'small',
    color: 'white',
    transform: 'rotate(90deg)',
  },
  link: {
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    textTransform: 'uppercase',
  },
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
  tooltipText: {
    fontSize: theme.typography.pxToRem(16),
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'normal',
    color: 'white',
  },
  notification: {
    marginLeft: theme.utils.fromPx(24),
  },
  divider: {
    marginTop: theme.utils.fromPx(24),
  },
}));

const CustomerTags = () => {
  const classes = useStyles();

  const router = useRouter();

  const { tags = [], error } = useTags();

  const { getLang } = useAthena();

  const onCreateTag = () => {
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          interactionPanel: 'tagEditor',
        },
      },
      undefined,
      { shallow: true },
    );
  };

  return (
    <>
      <section className={classes.header} data-testid="customer-tags-header-title">
        <Typography
          className={classes.heading}
          variant="h2"
          data-testid="customer-tags-header-title"
        >
          {getLang('customerTagsText', { fallback: 'Customer Tags' })}
        </Typography>
        <FeatureFlag flag="feature.explorer.editCustomerTagsEnabled">
          <Link
            variant="text"
            color="#1C49C2"
            aria-label="create tag"
            component="span"
            data-testid="edit-customer-tags"
            underline="hover"
            className={classes.link}
            onClick={onCreateTag}
          >
            {getLang('customerTagsEditText', { fallback: 'Edit' })}
          </Link>
        </FeatureFlag>
      </section>

      {error && (
        <Notification type="error" className={classes.notification}>
          {getLang('customerTagsErrorText', { fallback: 'Error while fetching tags' })}
        </Notification>
      )}

      {!error && (
        <section className={classes.root} data-testid="customer-sidebar:tags">
          {tags.map((tag) => (
            <Tag data={tag} key={tag.name} />
          ))}
        </section>
      )}
      <Divider className={classes.divider} />
    </>
  );
};

CustomerTags.propTypes = {};

export default CustomerTags;
