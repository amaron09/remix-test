import { useState } from "react";
import styles from "./styles.css";

import { CssBaseline } from "@mui/material";

import { AppBar, links as appBarLinks } from "~/components/AppBar";
import {
  AppNavDrawer,
  links as appNavDrawerLinks,
} from "~/components/AppNavDrawer";
import { AppSearch, links as appSearchLinks } from "~/components/AppSearch";
import { AccountMenu } from "~/components/AccountMenu";

import type { User } from "~/types/user";

export const links = () => [
  ...appBarLinks(),
  ...appNavDrawerLinks(),
  ...appSearchLinks(),
  { rel: "stylesheet", href: styles },
];

type Props = {
  children: React.ReactNode;
  user: User | null;
};

export const AppLayout = ({ children, user }: Props) => {
  const [showAppNavDrawer, setShowAppNavDrawer] = useState(false);

  const handleToggleAppNavDrawer = () => {
    setShowAppNavDrawer(!showAppNavDrawer);
  };

  return (
    <div className="appLayout">
      <CssBaseline />
      <AppBar onClickMenuIcon={handleToggleAppNavDrawer}>
        <div className="appBarItems">
          <div className="primary">
            <AppSearch />
          </div>
          <div className="actions">{user && <AccountMenu user={user} />}</div>
        </div>
      </AppBar>
      <AppNavDrawer
        open={showAppNavDrawer}
        onClose={handleToggleAppNavDrawer}
      />

      <main className="content">{children}</main>
    </div>
  );
};

AppLayout.displayName = "AppLayout";
