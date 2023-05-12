/*
 * Created on Fri Jan 06 2023
 *
 * Side menu
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { navBarCommon } from 'routes/navBarCommon';
import { PATH_NAME } from 'configs';
import { IChildNavBar } from 'models/INavBar';
import NavBarItem from './NavBarItem';
import useStyles from './styles';
import Version from './Version';

type IProps = {
  isDrawer: boolean;
};

type IChildRoutes = {
  acc: any;
  curr: any;
  pathname: string;
  depth?: number;
};

function NavBar({ isDrawer }: IProps) {
  const classes = useStyles();
  const location = useLocation();

  /**
   * Render list menu item
   * @param param0 list item data, parent path name, group level
   * @returns HTML
   */
  const renderNavItems = ({ items, pathname, depth }: IChildNavBar) => {
    return <List disablePadding>{items?.reduce((acc, curr) => renderChildRoutes({ acc, curr, pathname, depth }), [])}</List>;
  };

  /**
   * Return list navigation item
   * @param param0 list data return, current item, path name, level
   * @returns array of list item html
   */
  const renderChildRoutes = ({ acc, curr, pathname, depth = 0 }: IChildRoutes) => {
    const key = curr.title + depth;
    const active = pathname.includes(curr.href);
    if (curr.items) {
      acc.push(
        <NavBarItem
          active={active}
          pathname={pathname}
          key={`multi-${key}`}
          depth={depth}
          icon={curr.icon}
          open
          title={curr.title}
          href={curr.href}
          requireRoles={curr.requireRoles}
          requiredApps={curr.requiredApps}
        >
          {renderNavItems({
            depth: depth + 1,
            pathname,
            items: curr.items,
          })}
        </NavBarItem>,
      );
    } else {
      acc.push(
        <NavBarItem
          active={active}
          key={`alone-${key}`}
          pathname={pathname}
          depth={depth}
          href={curr.href}
          requireRoles={curr.requireRoles}
          requiredApps={curr.requiredApps}
          icon={curr.icon}
          title={curr.title}
        />,
      );
    }
    return acc;
  };

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={isDrawer}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerHeader}>
        <Link to={PATH_NAME.ROOT} className={classes.navBar_link}>
          <img src={'/logo-full-dark.svg'} alt="Logo" />
        </Link>
      </div>

      <Box className={classes.menuContainer}>{renderNavItems({ items: navBarCommon as any, pathname: location.pathname })}</Box>
      <Version />
    </Drawer>
  );
}

export default memo(NavBar);
