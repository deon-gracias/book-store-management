import Link from "next/link";

// Icons
import { Books, Home } from "tabler-icons-react";

// Mantine
import {
  Navbar,
  ScrollArea,
  Menu,
  UnstyledButton,
  Group,
  ThemeIcon,
  Text,
} from "@mantine/core";

const navItems = [
  {
    icon: <Home size={16} />,
    color: "blue",
    href: "/",
    label: "Home",
  },
  {
    icon: <Books size={16} />,
    color: "blue",
    href: "/books",
    label: "Books",
  },
];

const CustomNavbar = ({ opened }) => {
  return (
    <Navbar
      padding="md"
      width={{ base: 250 }}
      hidden={!opened}
      hiddenBreakpoint="md"
    >
      <Navbar.Section grow component={ScrollArea} mt="xs">
        {navItems.map((link) => (
          <MainLink {...link} key={link.label} />
        ))}
      </Navbar.Section>
    </Navbar>
  );
};

function MainLink({ icon, color, label, href }) {
  return (
    <Link href={href} passHref>
      <UnstyledButton
        sx={(theme) => ({
          display: "block",
          width: "100%",
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        })}
      >
        <Group>
          <ThemeIcon color={color} variant="light">
            {icon}
          </ThemeIcon>

          <Text size="sm">{label}</Text>
        </Group>
      </UnstyledButton>
    </Link>
  );
}

export default CustomNavbar;
