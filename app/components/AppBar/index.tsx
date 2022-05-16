import { useState } from "react";
import styles from "./styles.css";
import { AppBar as MuiAppBar, Toolbar, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import BreadCrumbs from '~/components/BreadCrumbs'

export const links = () => [{ rel: "stylesheet", href: styles }];

type Props = {
  onClickMenuIcon: () => void;
  children: React.ReactNode;
};

export const AppBar = ({ onClickMenuIcon, children }: Props) => {
  return (
    <div className="appBar">
      <MuiAppBar elevation={0} position="sticky" >
        <Toolbar>
          <div className="menuToggle">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={onClickMenuIcon}
            >
              <MenuIcon />
            </IconButton>
          </div>
          {children}
        </Toolbar>
      </MuiAppBar>
      <MuiAppBar elevation={0} position="sticky" >
        <BreadCrumbs />
      </MuiAppBar>
    </div>
  );
};

AppBar.displayName = "AppBar";
