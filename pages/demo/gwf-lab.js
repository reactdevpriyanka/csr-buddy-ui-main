import PropTypes from 'prop-types';
import { useState, useRef, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-dark.css';
import Notification from '@components/Notifications/Notification';
import Workflow from '@components/Workflow';
import buildWorkflow from '@utils/workflows';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'grid',
    maxWidth: theme.utils.fromPx(960),
    margin: '0 auto',
    padding: '40px 0',
    gridTemplateAreas: `
      'header header header header'
      'content content content content'
      'footer footer footer footer'
    `,
  },
  content: {
    gridArea: 'content',
    marginBottom: theme.utils.fromPx(40),
  },
  header: {
    gridArea: 'header',
    marginBottom: theme.utils.fromPx(40),
  },
  footer: {
    gridArea: 'footer',
  },
  heading: {
    ...theme.fonts.h1,
    color: theme.palette.blue.dark,
    fontSize: theme.utils.fromPx(20),
  },
  label: {
    ...theme.fonts.body.medium,
    color: theme.palette.blue.dark,
  },
  formGroup: {
    marginBottom: theme.utils.fromPx(4),
  },
  textArea: {
    background: `#2b2b2b`,
    border: `1px solid #ddd`,
    color: `#ddd`,
    display: 'block',
    minWidth: theme.utils.fromPx(500),
    minHeight: theme.utils.fromPx(300),
    padding: theme.utils.fromPx(16),
  },
  errorMessage: {
    color: theme.palette.red.dark,
    fontSize: theme.utils.fromPx(12),
  },
  workflow: {
    padding: '20px',
  },
}));

const ErrorMessage = ({ children }) => {
  const classes = useStyles();
  return <span className={classes.errorMessage}>{children}</span>;
};

ErrorMessage.propTypes = { children: PropTypes.node };

export default function GwfLab() {
  const classes = useStyles();

  const form = useRef(null);

  const [errors, setErrors] = useState({});

  const [code, setCode] = useState('');

  const [workflow, setWorkflow] = useState(null);

  const checkJsonStyle = () => {
    if (!code) return;
    try {
      JSON.parse(code);
    } catch {
      setErrors({ ...errors, ...{ json: 'The JSON entered is invalid, please lint and retry' } });
    }
  };

  //validation completed at onBlur
  const onSubmit = useCallback(() => {
    const data = JSON.parse(code.replace(/(\n\r|\n|\r)/g, '')); // remove whitespace from the code
    setWorkflow(buildWorkflow(data));
  }, [code, errors, setErrors]);

  const hasErrors = Object.entries(errors)
    .map(([key, value]) => !!errors[key])
    .reduce((acc, current) => {
      if (acc === true) return acc;
      return !!current;
    }, false);

  const onDismiss = () => {
    setErrors({ ...errors, ...{ page: undefined } });
  };

  if (workflow) {
    return (
      <div className={classes.workflow}>
        <Workflow workflow={workflow} />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <header className={classes.header}>
        {errors.page && (
          <Notification type="error" onDismiss={onDismiss}>
            {errors.page}
          </Notification>
        )}
        <h1 className={classes.heading}>Guided Workflow Lab</h1>
      </header>

      <article className={classes.content}>
        <form ref={form}>
          <label htmlFor="text" className={classes.label}>
            {'Enter a guided workflow definition'}
          </label>
          <Editor
            className={classes.textArea}
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) => highlight(code, languages.json)}
            onFocus={() => setErrors({ ...errors, ...{ json: undefined } })}
            onBlur={checkJsonStyle}
            padding={12}
          />
          {errors.json && <ErrorMessage>{errors.json}</ErrorMessage>}
        </form>
      </article>

      <footer className={classes.footer}>
        <button type="submit" onClick={onSubmit} disabled={hasErrors || !code}>
          Submit JSON
        </button>
      </footer>
    </div>
  );
}
