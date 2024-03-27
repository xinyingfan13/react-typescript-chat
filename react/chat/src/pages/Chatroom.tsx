import SendIcon from '@mui/icons-material/Send';
import { Box, Grid } from '@mui/material';
import * as COLORS from '@mui/material/colors';
import Paper from '@mui/material/Paper';
import { FC, useEffect, useMemo, useRef, useState } from 'react';

import {
  FormSubmit,
  InputForm,
  MessageCard,
  Navbar,
  TextInput,
} from '@/components';
import { validateInputs } from '@/helpers';
import { useAuth, useTitle } from '@/hooks';
import { IAvatar, IFormInputs, IMessage, IRoomEvent } from '@/types';

interface IChatroom {
  username: string;
  lang: string;
  roomEvents: IRoomEvent[];
  messages: IMessage[];
  avatars: IAvatar;
  onButtonClicked: (input: string) => void;
}

const Chatroom: FC<IChatroom> = ({
  username,
  lang,
  roomEvents,
  messages,
  avatars,
  onButtonClicked,
}) => {
  const [shouldTranslate, setShouldTranslate] = useState(false);

  const { user } = useAuth();

  const roomName = user?.roomName ?? 'room';
  useTitle(roomName);

  const lastDivRef = useRef<HTMLDivElement>(null);

  const setValue = (input: IFormInputs) => {
    onButtonClicked(input['Message'].value);
  };

  const [background, backgroundSize] = useMemo(() => {
    const totalLangs = new Set([
      ...roomEvents.map((roomEvent) => roomEvent.lang),
    ]).size;
    const backgroundSize = `${(totalLangs + 1) * 200}% ${
      (totalLangs + 1) * 200
    }%`;

    const colors = Object.keys(COLORS).map((color: string) => {
      return Object(COLORS)[color][800];
    });
    let colorStr = '';
    let prefix = '';
    colors.slice(0, totalLangs + 1).forEach((color) => {
      if (!color) return;
      colorStr += prefix + color;
      prefix = ', ';
    });
    return [`linear-gradient(45deg, ${colorStr})`, backgroundSize];
  }, [roomEvents]);

  useEffect(() => {
    lastDivRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomEvents]);

  if (!user) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        background,
        backgroundSize,
        animation: 'gradient 10s ease infinite',
        overflow: 'hidden',
      }}
    >
      <Navbar
        avatar={avatars[username]}
        setShouldTranslate={setShouldTranslate}
        shouldTranslate={shouldTranslate}
        username={username}
      />
      <Paper
        square
        sx={{
          boxShadow: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          height: '100%',
          width: '100%',
          pb: 1,
          borderBottom: 'none',
          background: 'transparent',
          overflow: 'auto',
        }}
        variant="elevation"
      >
        <MessageCard
          avatars={avatars}
          currentUser={username}
          lang={lang}
          messages={messages}
          roomEvents={roomEvents}
          shouldTranslate={shouldTranslate}
        />
        <div ref={lastDivRef} aria-hidden />
      </Paper>
      <InputForm
        resetOnSubmit={true}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          mt: 'auto',
        }}
        validateInputs={validateInputs}
        onSubmit={setValue}
      >
        <Grid
          container
          justifyContent="flex-end"
          px={2}
          spacing={0.5}
          sx={{
            backgroundColor: 'rgba(255,255,255,0.3)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.6)',
            },
            '&:focus-within': {
              backgroundColor: 'rgba(255,255,255,0.6)',
            },
            '&:active-within': {
              backgroundColor: 'rgba(255,255,255,0.6)',
            },
            borderRadius: '2rem',
          }}
          width={'95%'}
        >
          <Grid
            item
            sx={{
              width: '100%',
              maxWidth: '90%',
              alignSelf: 'flex-end',
              justifySelf: 'flex-start',
            }}
            xs={11}
          >
            <TextInput
              autoFocus
              removeHelperText
              color="primary"
              id="send-message"
              label=" "
              name="Message"
              placeholder="Type a message"
              type="text"
              variant="standard"
            />
          </Grid>
          <Grid item xs={1}>
            <FormSubmit color="primary" variant="contained">
              <SendIcon
                sx={{
                  height: '1em',
                  width: '1em',
                }}
              />
            </FormSubmit>
          </Grid>
        </Grid>
      </InputForm>
    </Box>
  );
};

export default Chatroom;
