/*
 * Created on Fri Jan 06 2023
 *
 * Kebab icon with actions for table row
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import KebabIcon from '@mui/icons-material/MoreVert';
import { IKebabItem, LooseObject } from 'models/ICommon';
import { Trans } from 'react-i18next';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  icon: {
    padding: 2,
    background: theme.palette.mode === 'dark' ? theme.palette.background.other3 : theme.palette.background.paper,
  },
}));

type KebabProps = {
  items?: IKebabItem[];
  data?: LooseObject;
};
const Kebab: React.FC<KebabProps> = ({ items = [], data = {} }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        className={classes.icon}
      >
        <KebabIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
          style: {
            minWidth: 200,
          },
        }}
      >
        {items.map((e: IKebabItem, i) => {
          return (
            <MenuItem
              key={`kebab_MenuItem_${i}`}
              onClick={() => {
                e?.onClick(data);
                handleClose();
              }}
            >
              <Trans>{e.label}</Trans>
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

export default Kebab;
