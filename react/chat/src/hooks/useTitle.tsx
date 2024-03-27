import { useEffect, useRef } from 'react';

export const useTitle = (title: string) => {
  const documentDefined = typeof document !== 'undefined';
  const originalTitle = useRef(documentDefined ? document.title : null);

  useEffect(() => {
    if (!documentDefined) return;

    if (document.title !== title) document.title = title;

    const currentTitle = originalTitle.current;

    return () => {
      if (currentTitle) {
        document.title = currentTitle;
      }
    };
  }, [documentDefined, title]);
};
