import Link from "next/link";

// Icons
import { BookmarkIcon, RocketIcon } from "@modulz/radix-icons";

// Mantine
import {
  Header as MHeader,
  Button,
  createStyles,
  ThemeIcon,
  Anchor,
  MediaQuery,
  Burger,
  Title,
  Group,
} from "@mantine/core";

const Header = ({ opened, handleOpen }) => {
  const { classes } = useStyles();

  return (
    <MHeader height={60}>
      <div className={classes.headerContainer}>
        {/* Navbar Btn */}
        <MediaQuery largerThan="md" styles={{ display: "none" }}>
          <Burger
            opened={opened ? opened : false}
            onClick={handleOpen ? () => handleOpen() : () => {}}
            size="sm"
            mr="xl"
          />
        </MediaQuery>

        {/* Title */}
        <Anchor component={Link} href="/">
          <Group spacing="xs" align="center">
            <ThemeIcon size="lg" radius="lg">
              <BookmarkIcon />
            </ThemeIcon>
            <Title order={2}>Book Store</Title>
          </Group>
        </Anchor>
      </div>
    </MHeader>
  );
};

// Styles
const useStyles = createStyles((theme, _params) => {
  return {
    headerContainer: {
      height: "100%",
      width: "100%",
      display: "flex",
      alignItems: "center",
      paddingLeft: "1rem",
    },
    headerTitle: {
      fontWeight: 500,
      color: theme.primaryColor,
      fontSize: "1.25rem",
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
    headerLoginBtn: {
      height: "100%",
      marginLeft: "auto",
      borderRadius: 0,
    },
  };
});

export default Header;
