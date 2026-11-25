import { Stack, Tooltip, UnstyledButton } from '@mantine/core';
import { IconClipboardText, IconFileText, IconLogout, IconStethoscope, IconUsers, type Icon } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router';
import classes from './AppNavbar.module.css';

type LinkProps = { icon: Icon; label: string; active?: boolean; disabled?: boolean; onClick?: () => void };

function NavLink({ icon: Icon, label, active, disabled, onClick }: LinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={disabled ? undefined : onClick}
        className={classes.link}
        data-active={active || undefined}
        data-disabled={disabled || undefined}
        aria-label={label}
      >
        <Icon size={20} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const links = [
  { icon: IconUsers, label: 'Patients', to: '/patients', ready: true },
  { icon: IconClipboardText, label: 'Assessments', to: '/assessments', ready: true },
  { icon: IconFileText, label: 'Reports', to: '/reports', ready: true },
];

// slim side nav, same as linkedout
export function AppNavbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <nav className={classes.navbar}>
      <IconStethoscope color="var(--mantine-color-cyan-7)" size={30} />

      <Stack className={classes.main} gap={0}>
        {links.map((l) => (
          <NavLink
            key={l.label}
            icon={l.icon}
            label={l.label}
            active={l.to === '/reports' ? pathname === '/reports' || pathname.endsWith('/report') : pathname.startsWith(l.to) && !pathname.endsWith('/report')}
            disabled={!l.ready}
            onClick={() => navigate(l.to)}
          />
        ))}
      </Stack>

      <NavLink icon={IconLogout} label="Log out" onClick={() => navigate('/login')} />
    </nav>
  );
}
