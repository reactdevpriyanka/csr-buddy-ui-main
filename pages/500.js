import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import { Card, SplitContent } from '@components/Card';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: theme.utils.fromPx(800),
    margin: '40px auto 0',
  },
  header: {
    ...theme.fonts.h1,
    padding: `${theme.utils.fromPx(8)} ${theme.utils.fromPx(23)}`,
    borderBottom: `${theme.utils.fromPx(1)} solid ${theme.palette.gray[100]}`,
    margin: 0,
  },
  content: {
    lineHeight: 1.8,
  },
  tryAgain: {
    ...theme.fonts.body.normal,
    color: theme.palette.white,
    display: 'inline-block',
    background: theme.palette.red.medium,
    borderColor: theme.palette.red.medium,
    borderRadius: theme.utils.fromPx(8),
    padding: theme.utils.fromPx(8),
    textDecoration: 'none',
    '&:focus, &:hover': {
      background: theme.palette.red.pastel,
      borderColor: theme.palette.red.medium,
    },
  },
}));

export default function InternalServerErrorPage() {
  const classes = useStyles();

  const router = useRouter();

  const header = <h1 className={classes.header}>{'Whoops!'}</h1>;

  const content = (
    <>
      <p className={classes.content}>
        {'An unexpected error has occurred and prevents us from showing you this page.'}
      </p>
      <p className={classes.content}>
        {'The error has automatically been reported to engineering.'}
      </p>
    </>
  );

  const actions = (
    <Link href={router.asPath}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a className={classes.tryAgain}>{'Try Again'}</a>
    </Link>
  );

  return (
    <div className={classes.root}>
      <Card header={header}>
        <SplitContent content={content} actions={actions} />
      </Card>
    </div>
  );
}
