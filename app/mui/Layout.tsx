import { useState } from "react";
import { Link } from "remix";
import {
  AppBar,
  Toolbar,
  IconButton,
  Autocomplete,
  TextField,
  CssBaseline,
  Box,
  Divider,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  Drawer,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { tempStudios, tempUsers } from "./tempOptions";

const options = [...tempStudios, ...tempUsers].map((option) => {
  const firstLetter = option.title[0].toUpperCase();
  return {
    firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
    ...option,
  };
});

const drawerWidth = 240;

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const favoriteMenuItems = [
    { title: "Users", secondaryTitle: 'Membership, Bookings, Payments...', link: "/" },
    { title: "Studios", secondaryTitle: 'Integration, Permissions, Visitors, Reviews', link: "/studios" },
    { title: "Companies", link: "/" },
    { title: "Classes", link: "/" },
    { title: "Documents", link: "/" },
    { title: "Reports", link: "/" },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Link to="/">
          <img
            src="/bruce-logo.svg"
            width={511}
            height={112}
            alt="Bruce"
            style={{ width: 87, height: "auto", display: "block" }}
          />
        </Link>
      </Toolbar>
      <Divider />
      <List
        aria-labelledby="favorites"
        subheader={
          <ListSubheader component="div" id="list-favorites">
            Favorites
          </ListSubheader>
        }
      >
        {favoriteMenuItems.map((menuItem, index) => (
          <ListItem
            button
            component={Link}
            to={menuItem.link}
            key={`menu-item-${menuItem.title}-${index}`}
            prefetch="intent"
          >
            <ListItemText primary={menuItem.title} secondary={menuItem.secondaryTitle} secondaryTypographyProps={{
                    noWrap: true,
                    fontSize: 12,
                    lineHeight: '16px',
                  }}/>
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );

  return (
    <>
      <CssBaseline />
      <AppBar
        elevation={0}
        position="sticky"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Autocomplete
            disablePortal
            options={options.sort(
              (a, b) => -b.type.localeCompare(a.type)
            )}
            groupBy={(option: any) => option.type}
            getOptionLabel={(option: any) => option.title}
            size="small"
            sx={{ width: "100%", maxWidth: 640 }}
            renderInput={(params: any) => (
              <TextField
                {...params}
                placeholder="Search for studios, users and more..."
              />
            )}
          />
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="div"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { xs: 0, sm: `${drawerWidth}px` }
        }}
      >
        {children}
      </Box>
    </>
  );
}
