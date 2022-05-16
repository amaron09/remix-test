import { Link } from "remix";
import styles from "./styles.css";
import {
  Toolbar,
  Divider,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  Drawer,
} from "@mui/material";

export const links = () => [{ rel: "stylesheet", href: styles }];

const drawerWidth = 240;

type Props = {
  open: boolean;
  onClose: () => void;
};

const favoriteMenuItems = [
  {
    title: "Users",
    //secondaryTitle: "Membership, Bookings, Payments...",
    link: "/users",
  },
  {
    title: "Studios",
    //secondaryTitle: "Integration, Permissions, Visitors, Reviews",
    link: "/studios",
  },
  { title: "Companies", link: "/companies" },
  { title: "Classes", link: "/" },
  { title: "Documents", link: "/" },
  { title: "Reports", link: "/" },
];

const drawerContent = (
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
    <List
      dense
      aria-labelledby="favorites"
      /*
      subheader={
        <ListSubheader component="div" id="list-favorites">
          Favorites
        </ListSubheader>
      }
      */
    >
      {favoriteMenuItems.map((menuItem, index) => (
        <ListItem
          button
          component={Link}
          to={menuItem.link}
          key={`menu-item-${menuItem.title}-${index}`}
          prefetch="intent"
        >
          <ListItemText
            primary={menuItem.title}
            secondary={menuItem.secondaryTitle}
            secondaryTypographyProps={{
              noWrap: true,
              fontSize: 12,
              lineHeight: "16px",
            }}
          />
        </ListItem>
      ))}
    </List>
  </div>
);

export const AppNavDrawer = ({ open, onClose }: Props) => {
  return (
    <nav>
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
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
        {drawerContent}
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
        {drawerContent}
      </Drawer>
    </nav>
  );
};

AppNavDrawer.displayName = "AppNavDrawer";
