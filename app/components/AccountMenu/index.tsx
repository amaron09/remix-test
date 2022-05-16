import { useState } from "react";
import { useSubmit } from "remix";
import type { MouseEvent } from "react";
import styles from "./styles.css";
import { Tooltip, Menu, MenuItem, Avatar } from "@mui/material";
import { User } from "~/types/user";

export const links = () => [{ rel: "stylesheet", href: styles }];

const settings = ["Profile", "Settings"];

type Props = { user: User };

export const AccountMenu = ({ user }: Props) => {
  const submit = useSubmit();
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null);

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClickLogout = (event: MouseEvent<HTMLElement>) => {
    submit(null, { method: "post", action: "/logout" });
  };

  return (
    <>
      <Tooltip title={`${user.first_name} ${user.last_name}`}>
        <Avatar
          alt={`${user.first_name} ${user.last_name}`}
          onClick={handleOpenUserMenu}
        >
          {!user.photo && user.first_name && user.last_name && (
            <>
              {user.first_name?.charAt(0)}
              {user.last_name?.charAt(0)}
            </>
          )}
        </Avatar>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map((setting) => (
          <MenuItem key={setting} onClick={handleCloseUserMenu}>
            {setting}
          </MenuItem>
        ))}
        <MenuItem onClick={handleClickLogout}>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

AccountMenu.displayName = "AccountMenu";
