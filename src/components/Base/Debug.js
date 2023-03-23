const Debug = ({ ...props }) => {
  return <pre>{JSON.stringify(props, null, 2)}</pre>;
};

Debug.propTypes = {};

export default Debug;
