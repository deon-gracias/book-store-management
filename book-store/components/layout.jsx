import { AppShell, Container, ThemeIcon, useMantineTheme } from "@mantine/core";
import Header from "./header";
import CustomNavbar from "./navbar";
import { useState } from "react";

const Layout = ({ login, user, children }) => {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();

  return (
    <AppShell
      navbarOffsetBreakpoint="md"
      sx={{
        backgroundColor:
          theme.colorScheme === "light"
            ? theme.colors.gray[0]
            : theme.colors.gray[9],
      }}
      header={<Header opened={opened} handleOpen={() => setOpened(!opened)} />}
      navbar={<CustomNavbar opened={opened} />}
    >
      {children}
    </AppShell>
  );
};

export default Layout;
