import React, { ReactNode } from "react";
import { Avatar } from "@react-md/avatar";
import {
  HomeSVGIcon,
  InfoOutlineSVGIcon,
  ColorLensSVGIcon,
  BuildSVGIcon,
} from "@react-md/material-icons";
import { IFlattenedTree, TreeDataList } from "@react-md/tree";
import MaterialDesignSVGIcon from "icons/MaterialDesignSVGIcon";
import ReactSVGIcon from "icons/ReactSVGIcon";
import { toTitle } from "utils/toTitle";

export interface IRouteLink {
  children: ReactNode;
  target?: string;
  href?: string;
  leftIcon?: ReactNode;
}

export interface IRouteSubheader extends IRouteLink {
  subheader: true;
}

export interface IRouteDivider {
  divider: boolean;
}

export type RoutesTreeData = (IRouteLink | IRouteSubheader) | IRouteDivider;
export type RoutesTree = IFlattenedTree<RoutesTreeData>;

interface IChildRouteConfig {
  path: string;
  children: ReactNode;
  childRoutes?: IChildRouteConfig[];
}

interface IRouteConfig {
  icon?: ReactNode;
  childRoutes?: IChildRouteConfig[];
  parentPath?: string | null;
}

export const routesTree: RoutesTree = {};

/**
 * A small helper function to create a child route from the base `createRoute`
 * function. This is really used so that the parent pathnames can be prepended
 * the the provided child route's path.
 */
function createChildRoute(childRoute: IChildRouteConfig, parentPath: string) {
  const { path, children, childRoutes } = childRoute;
  createRoute(path, children, { childRoutes, parentPath });
}

/**
 * Creates a route in the `routesTree` from the provided configuration. When
 * child routes are provided, they will also be inserted into the tree with
 * the parentId set automatically to the current route path and will be
 * updated to be prepended with the current route path.
 *
 * This will render as an expandable tree item when there are no child routes,
 * otherwise it will render as a link tree item.
 */
function createRoute(path: string, children: ReactNode, config: IRouteConfig) {
  const { icon, childRoutes = [], parentPath = null } = config;
  const href = `${parentPath || ""}${path}`;
  routesTree[href] = {
    itemId: href,
    parentId: parentPath,
    children,
    leftIcon: icon,
    href: childRoutes.length ? undefined : href,
  };

  childRoutes.forEach(childRoute => createChildRoute(childRoute, href));
}

interface IPackageRouteConfig {
  install?: boolean;
  api?: boolean;
  demos?: boolean;
  sassdoc?: boolean;
}

function createPackageRoute(name: string, config: IPackageRouteConfig = {}) {
  const { install = true, api = true, demos = true, sassdoc = true } = config;

  const childRoutes: IChildRouteConfig[] = [];
  if (install) {
    childRoutes.push({
      path: "/installation",
      children: "Installation",
    });
  }

  if (demos) {
    childRoutes.push({
      path: "/demos",
      children: "Demos",
    });
  }

  if (api) {
    childRoutes.push({
      path: "/api",
      children: "API",
    });
  }

  if (sassdoc) {
    childRoutes.push({
      path: "/sassdoc",
      children: "SassDoc",
    });
  }

  return {
    path: `/${name}`,
    children: toTitle(name),
    childRoutes,
  };
}

/**
 * Creates a divider in the tree.
 */
function createDivider(index: number, parentId: string | null = null) {
  const itemId = `divider-${index}`;
  routesTree[itemId] = {
    itemId,
    parentId,
    divider: true,
  };
}

/**
 * Creates a subheader in the tree.
 */
function createSubheader(
  itemId: string,
  children: ReactNode,
  parentId: string | null = null
) {
  routesTree[itemId] = {
    itemId,
    parentId,
    children,
    subheader: true,
  };
}

/**
 * Creates an external route in the tree that will open the link
 * in an external tab.
 */
function createExternalRoute(
  href: string,
  children: ReactNode,
  icon?: ReactNode
) {
  routesTree[href] = {
    itemId: href,
    parentId: null,
    children,
    href,
    target: "_blank",
    leftIcon: icon,
  };
}

createRoute("/", "Home", { icon: <HomeSVGIcon /> });
createRoute("/getting-started", "Getting Started", {
  icon: <InfoOutlineSVGIcon />,
  childRoutes: [
    { path: "/quick-start", children: "Quick Start" },
    { path: "/installation", children: "Installation" },
    {
      path: "/updating-create-react-app",
      children: "Updating create-react-app",
    },
  ],
});
createRoute("/customization", "Customization", {
  icon: <ColorLensSVGIcon />,
  childRoutes: [
    { path: "/overriding-defaults", children: "Overriding Defaults" },
    { path: "/creating-dynamic-themes", children: "Creating Dynamic Themes" },
  ],
});
createRoute("/packages", "Packages", {
  icon: <BuildSVGIcon />,
  childRoutes: [
    createPackageRoute("app-bar"),
    createPackageRoute("avatar"),
    createPackageRoute("button"),
    createPackageRoute("divider"),
    createPackageRoute("elevation", { api: false }),
    createPackageRoute("icon"),
    createPackageRoute("link"),
    createPackageRoute("list"),
    createPackageRoute("material-icons"),
    createPackageRoute("media"),
    createPackageRoute("portal"),
    createPackageRoute("sheet"),
    createPackageRoute("states"),
    createPackageRoute("theme"),
    createPackageRoute("transition"),
    createPackageRoute("tree"),
    createPackageRoute("typography"),
    createPackageRoute("utils"),
    createPackageRoute("wia-aria"),
  ],
});
createDivider(0);
createSubheader("references", "References");
createExternalRoute("https://reactjs.org", "React", <ReactSVGIcon />);
createExternalRoute(
  "https://material.io/design",
  "Material Design",
  <MaterialDesignSVGIcon />
);