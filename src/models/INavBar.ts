/*
 * Created on Fri Jan 06 2023
 *
 * Navbar common type
 *
 * Copyright (c) 2023 - Novus Fintech
 */

type IITems = {
  title?: string;
  icon?: React.ReactNode;
  href?: string;
  depth?: number;
};

type IStyle = {
  paddingLeft: number;
};

export type IChildNavBar = IITems & {
  items?: IITems[];
  pathname: string;
  label?: string;
};

export type INavBarCommon = {
  title?: string;
  icon: any;
  items: IChildNavBar[];
};

export type INavBarItem = {
  depth: number;
  icon: any;
  title: string;
  open?: boolean;
  active?: boolean;
  pathname?: string;
  href: string;
  label?: string;
  children?: any;
  requireRoles?: string | string[];
  requiredApps?: boolean;
};

export type INavBarExpandItem = {
  icon: any;
  title: string;
  open?: boolean;
  active?: boolean;
  children?: any;
  style: IStyle;
};
