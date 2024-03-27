import { useCallback, useEffect, useMemo, useState } from 'react';

import { INACTIVE_DURATION } from '@/constants';
import { parseDate } from '@/helpers/ParseDate';
import { IRoomEvent, MSG_TYPES } from '@/types';

interface INotification {
  events: IRoomEvent[];
  userID: number;
}

export const useNotification = ({ events, userID }: INotification) => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastActive, setLastActive] = useState<number>(Date.now());
  const [notification, setNotification] = useState<Notification | null>(null);

  const latestEvent = useMemo(() => {
    if (events.length <= 0) {
      return null;
    }
    const latestEvent = events[events.length - 1];
    const latestEventTime = parseDate(latestEvent.timestamp).getTime();
    if (!isVisible) {
      if (latestEventTime > lastActive) {
        return latestEvent;
      }
    } else {
      if (latestEventTime > lastActive + INACTIVE_DURATION) {
        return latestEvent;
      }
    }
    return null;
  }, [events, lastActive, isVisible]);

  const handleVisibility = useCallback(() => {
    if (document.visibilityState === 'visible') {
      if (notification != null) {
        notification.close();
      }
      setIsVisible(true);
      setLastActive(Date.now());
    } else {
      setIsVisible(false);
    }
  }, [notification]);

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

  const handleNotification = useCallback(async () => {
    if (!latestEvent) {
      return;
    }
    const permission = await handlePermissions();
    if (!permission) {
      return;
    }
    if (
      latestEvent.userID !== userID ||
      latestEvent.msg_type !== MSG_TYPES.MESSAGE
    ) {
      return;
    }
    const notification = new Notification('New Message', {
      body: latestEvent.message,
      icon: 'Logo',
    });
    setNotification(notification);
  }, [latestEvent, userID]);

  useEffect(() => {
    const handleActive = () => {
      setLastActive(Date.now());
    };
    document.onmousemove = handleActive;
    document.onmousedown = handleActive;
    document.ontouchstart = handleActive;
    document.onclick = handleActive;
    document.onkeydown = handleActive;
    document.addEventListener('scroll', handleActive, true);
    document.addEventListener('visibilitychange', handleVisibility);
    handleNotification();

    return () => {
      document.removeEventListener('scroll', handleActive, true);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [handleVisibility, handleNotification]);
};
