import { AppShell, Container } from '@mantine/core';
import { Outlet } from 'react-router';
import { AppNavbar } from './AppNavbar';

// side nav + page content for every signed-in page
export function AppLayout() {
  return (
    <AppShell navbar={{ width: 80, breakpoint: 0 }}>
      <AppShell.Navbar>
        <AppNavbar />
      </AppShell.Navbar>
      <AppShell.Main>
        <Container size="xl" py="xl" px="xl">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
