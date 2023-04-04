/*
 * Created on Fri Jan 06 2023
 *
 * Main routers
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React, { Fragment, Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PATH_NAME } from 'configs';
import { IRoutes } from 'models/IRoutes';
import MainLayout from 'layouts/MainLayout';
import AuthGuard from 'guards/AuthGuard';
import RoleRoute from './RoleRoute';

// modules
const Error404View = lazy(() => import('features/Error404View'));
// const UserManagement = lazy(() => import('features/User/UserManagement'));
const Portfolio = lazy(() => import('features/Portfolio'));
const CreateNewUser = lazy(() => import('features/User/CreateNewUser'));
const UserDetailEdit = lazy(() => import('features/User/UserDetailEdit'));
const NotificationManagement = lazy(() => import('features/Notification/NotificationManagement'));
const CreateNewNotification = lazy(() => import('features/Notification/CreateNewNotification'));
const SegmentManagement = lazy(() => import('features/Notification/SegmentManagement'));
const CreateNewSegment = lazy(() => import('features/Notification/CreateNewSegment'));
const Subscribers = lazy(() => import('features/Notification/Subscribers'));
const ArticlesManagement = lazy(() => import('features/Articles/ArticlesManagement'));
const CreateNewArticles = lazy(() => import('features/Articles/CreateNewArticles'));
const Report = lazy(() => import('features/Report'));
const Login = lazy(() => import('features/Login'));
const DenyView = lazy(() => import('features/DenyView'));

const routesConfig: IRoutes[] = [
  {
    path: PATH_NAME.ROOT,
    component: () => <Navigate to={PATH_NAME.NOTIFICATION_MANAGEMENT} replace />,
  },
  {
    path: PATH_NAME.ERROR_404,
    component: Error404View,
  },
  {
    path: PATH_NAME.LOGIN,
    component: Login,
  },
  {
    path: PATH_NAME.ERROR_403,
    component: DenyView,
  },
  {
    path: '/',
    guard: AuthGuard,
    layout: MainLayout,
    routes: [
      // {
      //   path: PATH_NAME.USER_MANAGEMENT,
      //   component: UserManagement,
      //   requireRoles: [],
      // },
      {
        path: PATH_NAME.CREATE_NEW_USER,
        component: CreateNewUser,
        requireRoles: [],
      },
      {
        path: PATH_NAME.USER_DETAIL,
        component: UserDetailEdit,
        requireRoles: [],
      },
      {
        path: PATH_NAME.PORTFOLIO,
        component: Portfolio,
        requireRoles: [],
      },
      {
        path: PATH_NAME.CREATE_NEW_NOTIFICATION,
        component: CreateNewNotification,
        requireRoles: [],
      },
      {
        path: PATH_NAME.NOTIFICATION_MANAGEMENT,
        component: NotificationManagement,
        requireRoles: [],
      },
      {
        path: PATH_NAME.SEGMENT_MANAGEMENT,
        component: SegmentManagement,
        requireRoles: [],
      },
      {
        path: PATH_NAME.CREATE_NEW_SEGMENT,
        component: CreateNewSegment,
        requireRoles: [],
      },
      {
        path: PATH_NAME.SUBSCRIBERS,
        component: Subscribers,
        requireRoles: [],
      },
      {
        path: PATH_NAME.ARTICLES_MANAGEMENT,
        component: ArticlesManagement,
        requireRoles: [],
      },
      {
        path: PATH_NAME.CREATE_NEW_ARTICLES,
        component: CreateNewArticles,
        requireRoles: [],
      },
      {
        path: PATH_NAME.REPORT,
        component: Report,
        requireRoles: [],
      },
      {
        component: () => <Navigate to={PATH_NAME.ERROR_404} />,
      },
    ],
  },
  {
    path: '*',
    component: () => <Navigate to={PATH_NAME.ERROR_404} />,
  },
];

const renderNestedRoutes = (routes: IRoutes[], guard: any) => {
  return routes.map((route: IRoutes, idx: number) => {
    const Guard = guard || Fragment;
    const Component = route.component;
    const requireRoles = route.requireRoles || [];

    return (
      <Route
        key={`routes-nested-${idx}`}
        path={route.path}
        element={
          <Suspense fallback={<div />}>
            <Guard>
              <RoleRoute requireRoles={requireRoles}>
                <Component />
              </RoleRoute>
            </Guard>
          </Suspense>
        }
      ></Route>
    );
  });
};

const renderRoutes = (routes: IRoutes[]) => {
  return (
    <Routes>
      {routes.map((route: IRoutes, idx: number) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Component = route.component;
        const requireRoles = route.requireRoles || [];

        if (route.routes) {
          return (
            <Route key={`routes-${idx}`} path={route.path} element={<Layout />}>
              {renderNestedRoutes(route.routes, route.guard)}
            </Route>
          );
        }

        return (
          <Route
            key={`routes-${idx}`}
            path={route.path}
            element={
              <Suspense fallback={<div />}>
                <Guard>
                  <RoleRoute requireRoles={requireRoles}>
                    <Component />
                  </RoleRoute>
                </Guard>
              </Suspense>
            }
          ></Route>
        );
      })}
    </Routes>
  );
};

function MyRoutes() {
  return renderRoutes(routesConfig);
}

export default MyRoutes;
