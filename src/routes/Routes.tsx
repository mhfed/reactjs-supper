import React, { Fragment, lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PATH_NAME } from 'configs';
import { IRoutes } from 'models/IRoutes';
import MainLayout from 'layouts/MainLayout';
import AuthGuard from 'guards/AuthGuard';
import GuestGuard from 'guards/GuestGuard';
import RoleRoute from './RoleRoute';

// modules
const Error404View = lazy(() => import('features/Error404View'));
const UserManagement = lazy(() => import('features/User/UserManagement'));
const CreateNewUser = lazy(() => import('features/User/CreateNewUser'));
const Notifications = lazy(() => import('features/Notification/Notifications'));
const CreateNewNotification = lazy(() => import('features/Notification/CreateNewNotification'));
const Segments = lazy(() => import('features/Notification/Segments'));
const CreateNewSegment = lazy(() => import('features/Notification/CreateNewSegment'));
const Subscribers = lazy(() => import('features/Notification/Subscribers'));
const Articles = lazy(() => import('features/Article/Articles'));
const CreateNewArticle = lazy(() => import('features/Article/CreateNewArticle'));
const Report = lazy(() => import('features/Report'));
const Login = lazy(() => import('features/Login'));
const DenyView = lazy(() => import('features/DenyView'));

const routesConfig: IRoutes[] = [
  {
    path: '/',
    component: () => <Navigate to={PATH_NAME.USER_MANAGEMENT} replace />,
  },
  {
    path: PATH_NAME.ERROR_404,
    component: Error404View,
  },
  {
    guard: GuestGuard,
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
      {
        path: PATH_NAME.USER_MANAGEMENT,
        component: UserManagement,
        requireRoles: [],
      },
      {
        path: PATH_NAME.CREATE_NEW_USER,
        component: CreateNewUser,
        requireRoles: [],
      },
      {
        path: PATH_NAME.CREATE_NEW_NOTIFICATION,
        component: CreateNewNotification,
        requireRoles: [],
      },
      {
        path: PATH_NAME.NOTIFICATIONS,
        component: Notifications,
        requireRoles: [],
      },
      {
        path: PATH_NAME.SEGMENTS,
        component: Segments,
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
        path: PATH_NAME.ARTICLES,
        component: Articles,
        requireRoles: [],
      },
      {
        path: PATH_NAME.CREATE_NEW_ARTICLE,
        component: CreateNewArticle,
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
