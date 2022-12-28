import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import { navBarCommon } from 'routes/navBarCommon';
import { PATH_NAME } from 'configs';
import { IChildNavBar } from 'models/INavBar';
import NavBarItem from './NavBarItem';
import useStyles from './styles';
import { Trans } from 'react-i18next';

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

  const renderNavItems = ({ items, pathname, depth }: IChildNavBar) => {
    return <List disablePadding>{items?.reduce((acc, curr) => renderChildRoutes({ acc, curr, pathname, depth }), [])}</List>;
  };

  const renderChildRoutes = ({ acc, curr, pathname, depth = 0 }: IChildRoutes) => {
    const key = curr.title + depth;
    const active = pathname.includes(curr.href);
    if (curr.items) {
      acc.push(
        <NavBarItem
          active={active}
          key={`multi-${key}`}
          depth={depth}
          icon={curr.icon}
          open={true}
          title={curr.title}
          href={curr.href}
          isExternalLink={curr.isExternalLink}
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
          depth={depth}
          href={curr.href}
          icon={curr.icon}
          title={curr.title}
          isExternalLink={curr.isExternalLink}
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
          <img src="/logo-full.svg" alt="Logo" title="logo" />
        </Link>
      </div>
      <Divider />

      {renderNavItems({ items: navBarCommon as any, pathname: location.pathname })}
    </Drawer>
  );
}

export default memo(NavBar);
