/*
 * Created on Fri Jan 06 2023
 *
 * Menu item
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React, { FC } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import { INavBarItem } from 'models/INavBar';
import NavBarExpandItem from './NavBarExpandItem';
import useStyles from './styles';
import { Trans, useTranslation } from 'react-i18next';

const NavBarItem: FC<INavBarItem> = ({ active, depth, icon: Icon, title, open: openProp, href, children }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  let paddingLeft = 24;
  if (depth > 0) {
    paddingLeft = 40 + 8 * depth;
  }

  const style = { paddingLeft };

  if (children) {
    return (
      <NavBarExpandItem active={active} title={t(title)} icon={Icon} open={openProp} style={style}>
        {children}
      </NavBarExpandItem>
    );
  }

  return (
    <ListItem className={clsx(classes.itemLeaf)} disableGutters key={title}>
      <Button
        className={clsx(classes.buttonLeaf, `depth-${depth}`, active && classes.navBarItemActive)}
        component={RouterLink}
        style={style}
        to={href}
      >
        {Icon && <Icon className={classes.icon} size="20" />}
        <span className={classes.title}>
          <Trans>{title}</Trans>
        </span>
      </Button>
    </ListItem>
  );
};

export default NavBarItem;
