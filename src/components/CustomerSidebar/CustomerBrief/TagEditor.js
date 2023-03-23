import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Button from '@/components/Button';
import ArrowBackIosSharpIcon from '@material-ui/icons/ArrowBackIosSharp';
import useTags from '@/hooks/useTags';
import useAthena from '@/hooks/useAthena';
import Tag from './Tag';
import { blacklistedTags } from './utils';

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.utils.customerSidebarSubpanel,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  formContainer: {
    marginTop: theme.utils.fromPx(12),
  },
  suggestText: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '22px',
    marginBottom: '18px',
    display: 'inline',
    color: '#333333',
  },
  approvalText: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: '18px',
    marginBottom: '18px',
  },
  innerDescriptionField: {
    marginBottom: '5px !important',
  },
  descriptionField: {
    width: '100% !important',
  },
  nameField: {
    width: '100% !important',
  },
  footerContainer: {
    width: '100%',
    background: theme.palette.gray[50],
    borderTop: `1px solid ${theme.palette.gray[150]}`,
    marginTop: theme.utils.fromPx(24),
  },
  footerInnerContent: {
    margin: `${theme.utils.fromPx(16)} ${theme.utils.fromPx(24)}`,
  },
  contentContainer: {
    width: '90%',
    marginLeft: theme.utils.fromPx(24),
  },
  addTags: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '18px',
    lineHeight: '24px',
    letterSpacing: '0.25px',
    color: '#031657',
    marginBottom: '20px',
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
  suggestPlusImg: {
    fontSize: 'small',
    color: '#031657',
    transform: 'rotate(90deg)',
  },
  newTagPlusImg: {
    fontSize: 'small',
    color: 'white',
    transform: 'rotate(90deg)',
  },
  backImg: {
    fontSize: 'small',
    color: '#031657',
  },
}));

const TagEditor = () => {
  const classes = useStyles();

  const router = useRouter();

  const { isValidating, tags, availableTags } = useTags();

  const { getLang } = useAthena();

  const selectedTags = useMemo(() => new Map(tags.map((tag) => [tag.name, tag])), [tags]);

  const updatableTags = useMemo(
    () =>
      Object.values(availableTags).filter((tag) => tag.updatable && !blacklistedTags.has(tag.name)),
    [availableTags],
  );

  const onBack = useCallback(() => {
    const query = { ...router.query };

    delete query.interactionPanel;

    router.push(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: true },
    );
  }, [router]);

  return (
    <div className={classes.root}>
      <form autoComplete="off" data-testid="tag-editor" className={classes.formContainer}>
        <div className={classes.contentContainer}>
          <Typography
            variant="h2"
            className={classes.addTags}
            data-testid="customer-sidebar:static-customer-name"
          >
            {getLang('addTagsText', { fallback: 'Add Tags' })}
          </Typography>

          <div>
            {updatableTags.map((tag) => (
              <Tag
                key={tag.name}
                displayName={tag.displayName}
                description={tag.description}
                name={tag.name}
                defaultChecked={selectedTags.has(tag.name)}
                defaultValue={selectedTags.get(tag.name)?.value || ''}
              />
            ))}
          </div>
        </div>
      </form>
      <div className={classes.footerContainer}>
        <div className={classes.footerInnerContent}>
          <Button
            onClick={onBack}
            solidWhite
            data-testid="tag-editor:back"
            disabled={isValidating}
            aria-label="Tap to go back"
          >
            <span>
              <ArrowBackIosSharpIcon className={classes.backImg} />{' '}
            </span>
            {getLang('addTagsBackText', { fallback: 'Back' })}
          </Button>
        </div>
      </div>
    </div>
  );
};

TagEditor.propTypes = {};

export default TagEditor;
