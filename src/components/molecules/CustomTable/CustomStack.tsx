import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Chip from '@mui/material/Chip';
import { Trans } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    minWidth: 300,
  },
  collapseBtn: {
    border: 'none',
  },
}));

type CustomStackProps = {
  data: string[];
};

const CustomStack: React.FC<CustomStackProps> = ({ data = [] }) => {
  const classes = useStyles();
  const [show, setShow] = React.useState(false);

  const handleShow = () => {
    setShow((old) => !old);
  };

  const isLargeData = data.length > 9;
  let displayData = [...data];
  if (isLargeData && !show) {
    displayData = data.slice(0, 9);
  }
  return (
    <div className={classes.container}>
      {displayData.map((e: string, i: number) => (
        <Chip key={`MULTIPLE_TAG_${e}_${i}`} label={e} />
      ))}
      {isLargeData && (
        <Chip
          className={classes.collapseBtn}
          key={`MULTIPLE_TAG_expand_collapse_icon`}
          onClick={handleShow}
          variant="outlined"
          color="primary"
          label={<Trans>{show ? 'lang_hide' : 'lang_show_more'}</Trans>}
        />
      )}
    </div>
  );
};

export default CustomStack;
