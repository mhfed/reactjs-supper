/*
 * Created on Fri Jan 06 2023
 *
 * Common type for routers
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React, { ComponentType } from 'react';

type ICommon = {
  exact?: boolean;
  path?: string;
  guard?: React.LazyExoticComponent<ComponentType<unknown>> | ComponentType<unknown>;
  layout?: any;
  component?: any;
  requireRoles?: string[] | [];
};

export type IRoutes = ICommon & {
  routes?: ICommon[];
};

export type IParams = {
  id?: string;
};
