/*
 * Created on Fri Jan 06 2023
 *
 * Menu item
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import Button from 'components/atoms/ButtonBase';
import ListItem from '@mui/material/ListItem';
import { INavBarItem } from 'models/INavBar';
import NavBarExpandItem from './NavBarExpandItem';
import useStyles from './styles';
import { Trans, useTranslation } from 'react-i18next';

const NavBarItem: FC<INavBarItem> = ({ active, pathname, depth, icon: Icon, title, open: openProp, href, children }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const navigate = useNavigate();

  let paddingLeft = 18;
  if (depth > 0) {
    paddingLeft = 40 + 8 * depth;
  }

  const style = { paddingLeft };

  // return menu parent with children
  if (children) {
    return (
      <NavBarExpandItem active={active} title={t(title)} icon={Icon} open={openProp} style={style}>
        {children}
      </NavBarExpandItem>
    );
  }

  const onMenuClick = () => {
    if (pathname === href) return;
    if (window.confirmEdit) {
      window.confirmEdit(() => {
        navigate(href);
      });
    } else {
      navigate(href);
    }
  };

  // render normal menu item
  return (
    <ListItem className={clsx(classes.itemLeaf)} disableGutters key={title}>
      <Button
        className={clsx(
          classes.buttonLeaf,
          `depth-${depth}`,
          active && (depth > 0 ? classes.navBarItemActive : classes.listItemActive),
        )}
        // component={RouterLink}
        onClick={onMenuClick}
        style={style}
        // to={href}
      >
        {Icon && <Icon className={classes.icon} size="20" style={{ marginRight: 8 }} />}
        <span className={depth > 0 ? classes.title : classes.parentTitle}>
          <Trans>{title}</Trans>
        </span>
      </Button>
    </ListItem>
  );
};

export default NavBarItem;
