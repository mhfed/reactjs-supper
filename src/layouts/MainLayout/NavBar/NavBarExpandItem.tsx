/*
 * Created on Fri Jan 06 2023
 *
 * Menu item can expand
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React, { useState, memo } from 'react';
import clsx from 'clsx';

// material core
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';

// material icon
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// types
import { INavBarExpandItem } from 'models/INavBar';

// styles
import useStyles from './styles';

function NavBarExpandItem({ active, title, icon: Icon, open = false, children, style }: INavBarExpandItem) {
  const classes = useStyles();
  const [isExpand, setIsExpand] = useState(open);

  /**
   * Handle expand, collapse menu group
   */
  const handleToggle = () => {
    setIsExpand((prevOpen: boolean) => !prevOpen);
  };

  return (
    <ListItem className={clsx(classes.item)} disableGutters key={title}>
      <Button className={clsx(classes.button, active && classes.listItemActive)} onClick={handleToggle} style={style}>
        {Icon && <Icon className={classes.icon} size="20" />}
        <span className={classes.title}>{title}</span>
        {isExpand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Button>
      <Collapse in={isExpand}>{children}</Collapse>
    </ListItem>
  );
}

export default memo(NavBarExpandItem);
