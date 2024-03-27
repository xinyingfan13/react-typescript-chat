import { Avatar, Typography } from '@mui/material';
import { Stack, StackProps } from '@mui/system';
import { FC } from 'react';

interface IUserAvatar extends StackProps {
  username: string;
  avatar: string;
}

export const UserAvatar: FC<IUserAvatar> = ({ username, avatar, ...props }) => {
  return (
    <Stack {...props}>
      <Avatar alt={username} src={avatar} />
      <Typography component="p" variant="body2">
        {username}
      </Typography>
    </Stack>
  );
};
