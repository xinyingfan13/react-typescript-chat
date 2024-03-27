import { Typography } from '@mui/material';
import { FC, useCallback, useEffect, useState } from 'react';

import { IRoomEvent } from '@/types';

interface IMessageText {
  roomEvent: IRoomEvent;
  lang: string;
  shouldTranslate: boolean;
}

export const MessageText: FC<IMessageText> = ({
  roomEvent,
  lang,
  shouldTranslate,
}) => {
  const [text, setText] = useState(roomEvent.message);

  const translateText = useCallback(
    async (roomEvent: IRoomEvent) => {
      const data = await fetch(
        `${import.meta.env.VITE_LIBRE_BASE_URL}/translate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: roomEvent.message,
            source: roomEvent.lang,
            target: lang,
          }),
        },
      )
        .then((res) => res.json())
        .then((data) => data);
      return data.translatedText;
    },
    [lang],
  );

  useEffect(() => {
    if (!shouldTranslate) {
      setText(roomEvent.message);
      return;
    }
    if (roomEvent.lang != lang) {
      translateText(roomEvent).then((data) => {
        setText(data);
      });
    }
  }, [roomEvent, lang, shouldTranslate, translateText]);

  return (
    <Typography component="p" variant="body1">
      {text}
    </Typography>
  );
};
