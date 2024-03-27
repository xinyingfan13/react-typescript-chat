import { Paper, Toolbar, Typography, useScrollTrigger } from '@mui/material';
import { FC } from 'react';

import { TranslationSwitch } from '@/components/TranslationSwitch';
import { useAuth } from '@/hooks';
import { setFn } from '@/types';

interface INavbar {
  username: string;
  avatar: string;
  shouldTranslate: boolean;
  setShouldTranslate: setFn<boolean>;
}

export const Navbar: FC<INavbar> = ({
  username,
  avatar,
  shouldTranslate,
  setShouldTranslate,
}) => {
  const { roomName } = useAuth();

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return (
    <Paper
      square
      elevation={trigger ? 4 : 2}
      sx={{
        bgcolor: 'primary.main',
        width: '100%',
        color: '#fff',
        zIndex: 10,
      }}
    >
      <Toolbar sx={{ display: 'grid', gridTemplateColumns: '1fr 3fr 1fr' }}>
        <Typography component="h5" sx={{ gridColumn: '1/2' }} variant="h5">
          {roomName}
        </Typography>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            alt={username}
            src={avatar}
            style={{ height: '3em', width: '3em' }}
          />
          <Typography
            component="h6"
            sx={{ gridColumn: '2/3', textAlign: 'center' }}
            variant="h6"
          >
            {username}
          </Typography>
        </div>
        <TranslationSwitch
          setShouldTranslate={setShouldTranslate}
          shouldTranslate={shouldTranslate}
        />
      </Toolbar>
    </Paper>
  );
};
