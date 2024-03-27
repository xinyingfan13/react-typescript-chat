import { Paper, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Component, FC } from 'react';
import TimeAgo, { TimeAgoProps } from 'timeago-react';

import { MessageText, UserAvatar } from '@/components';
import { IAvatar, IMessage, IRoomEvent, MSG_TYPES } from '@/types';

const TimeAgoFixed = TimeAgo as unknown as Component<TimeAgoProps> & {
  new (props: unknown): Component<TimeAgoProps>;
};

interface IMessageCard {
  roomEvents: IRoomEvent[];
  messages: IMessage[];
  currentUser: string | number;
  lang: string;
  avatars: IAvatar;
  shouldTranslate: boolean;
}

export const MessageCard: FC<IMessageCard> = ({
  roomEvents,
  messages,
  currentUser,
  lang,
  avatars,
  shouldTranslate,
}) => {
  if (messages.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{ marginTop: 'auto', background: 'transparent' }}
      >
        <Typography
          component="p"
          style={{ textAlign: 'center', color: '#fff' }}
          variant="caption"
        >
          {'Start messaging! 🎉'}
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      {roomEvents.map((roomEvent, idx) => {
        const isCurrentUser = currentUser === roomEvent.username;

        if (roomEvent.msg_type === MSG_TYPES.JOINED) {
          return (
            <Typography
              key={idx}
              component="p"
              sx={{ my: 2, color: '#fff' }}
              variant="body2"
            >
              {roomEvent.username} is in the chat! 🎉
            </Typography>
          );
        }
        return (
          <Paper
            key={idx}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignSelf: 'flex-start',
              alignItems: 'center',
              justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
              mx: 2,
              my: 0.2,
              boxShadow: 'none',
              ml: isCurrentUser ? 'auto' : 2,
              background: 'transparent',
              color: '#fff',
            }}
          >
            <UserAvatar
              avatar={avatars[roomEvent.username]}
              sx={{ order: isCurrentUser ? 1 : 0 }}
              username={roomEvent.username}
            />
            <Paper
              sx={{
                p: 1.5,
                mx: 0.5,
                overflowWrap: 'break-word',
                bgcolor: isCurrentUser ? 'primary.main' : grey[800],
                color: '#fff',
              }}
            >
              <MessageText
                lang={lang}
                roomEvent={roomEvent}
                shouldTranslate={shouldTranslate}
              />
            </Paper>
            <Typography
              component="p"
              sx={{
                alignSelf: 'flex-end',
                order: isCurrentUser ? -1 : 1,
                pb: 0.5,
              }}
              variant="caption"
            >
              <TimeAgoFixed datetime={roomEvent.timestamp} />
            </Typography>
          </Paper>
        );
      })}
    </>
  );
};
