import { personas } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { useEffect, useMemo, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

import Logo from './assets/logo.png';
import { useAuth } from './hooks';
import { useNotification } from './hooks/useNotification';
import Chatroom from './pages/Chatroom';
import JoinRoom from './pages/JoinRoom';
import { IAvatar, IMessage, IRoomEvent, MSG_TYPES } from './types';

const App = () => {
  const [userID, setUserID] = useState(-1);
  const [client, setClient] = useState<W3CWebSocket | null>(null);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [roomEvents, setRoomEvents] = useState<IRoomEvent[]>([]);

  const { isLoggedIn, user } = useAuth();

  useNotification({ events: roomEvents, userID });

  const avatars: IAvatar = useMemo(() => {
    const newAvatars: IAvatar = {};
    const users = [
      ...new Set(roomEvents.map((roomEvent) => roomEvent.username)),
    ];
    users.forEach((user) => {
      newAvatars[user] = createAvatar(personas, {
        size: 40,
        seed: user,
      }).toDataUriSync();
    });
    return newAvatars;
  }, [roomEvents]);

  useEffect(() => {
    if (!isLoggedIn || userID > 0 || !user) return;
    const { roomName, username, lang } = user;
    const newClient = new W3CWebSocket(
      `ws://${import.meta.env.VITE_SERVER_URL}/ws/chat/${roomName}/`,
    );
    newClient.onopen = () => {
      console.log('Websocket connected!');
      setClient(newClient);
      if (userID === -1) {
        try {
          newClient.send(
            JSON.stringify({
              msg_type: MSG_TYPES.JOINED,
              username,
              lang,
            }),
          );
        } catch (err) {
          if (err instanceof Error) {
            console.log(err.message);
          }
        }
      }
    };

    newClient.onmessage = (message) => {
      if (typeof message.data != 'string') {
        console.log('invalid message data');
        return;
      }
      try {
        const dataFromServer = JSON.parse(message.data);
        if (dataFromServer) {
          const { msg_type, message, user_id, username, lang, timestamp } =
            dataFromServer;

          // handle based on msg_type
          switch (msg_type) {
            case MSG_TYPES.JOINED:
              setRoomEvents((prevEvents) => [
                ...prevEvents,
                {
                  msg_type,
                  timestamp,
                  username,
                },
              ]);
              if (userID === -1) {
                setUserID(user_id);
              }
              break;
            case MSG_TYPES.MESSAGE:
              setRoomEvents((prevEvents) => [
                ...prevEvents,
                {
                  msg_type,
                  message,
                  timestamp,
                  user_id,
                  username,
                  lang,
                },
              ]);
              setMessages((prevMessages) => [
                ...prevMessages,
                {
                  message,
                  timestamp,
                  username,
                  lang,
                },
              ]);
              break;
            default:
              console.log('unexpected msg_type', msg_type);
          }
        }
      } catch (err) {
        if (err instanceof Error) {
          console.log(err.message);
        }
      }
    };
  }, [isLoggedIn, user, userID]);

  const sendMessage = (input: string) => {
    if (client == null) {
      return;
    }
    try {
      client.send(
        JSON.stringify({
          msg_type: MSG_TYPES.MESSAGE,
          message: input,
          user_id: userID,
          username,
          lang,
        }),
      );
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  };

  useEffect(() => {
    if (roomEvents.length === 0) {
      return;
    }
    let notification: Notification | undefined;

    const handleClose = () => {
      if (notification != undefined && document.visibilityState === 'visible') {
        notification.close();
      }
    };

    const handlePermissions = async () => {
      switch (Notification.permission) {
        case 'denied':
          return false;
        case 'granted':
          return true;
        case 'default': {
          const permission = await Notification.requestPermission();
          return permission === 'granted';
        }
        default:
          return false;
      }
    };

    const handleNotification = async () => {
      const permission = await handlePermissions();
      if (!permission) {
        return;
      }
      const latestEvent = roomEvents[roomEvents.length - 1];
      if (
        latestEvent.userID !== userID ||
        latestEvent.msg_type !== MSG_TYPES.MESSAGE
      ) {
        return;
      }
      notification = new Notification('New Message', {
        body: latestEvent.message,
        icon: Logo,
      });
    };

    document.addEventListener('visibilitychange', handleClose);
    handleNotification();

    return () => {
      document.removeEventListener('visibilitychange', handleClose);
    };
  }, [roomEvents, userID]);

  if (!isLoggedIn) {
    return <JoinRoom />;
  }

  return (
    <Chatroom
      avatars={avatars}
      messages={messages}
      roomEvents={roomEvents}
      onButtonClicked={sendMessage}
    />
  );
};

export default App;
