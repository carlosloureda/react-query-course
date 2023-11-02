import * as React from "react";

type ScrollContainer = HTMLElement | Document;

const useScrollToBottomAction = (
  container: ScrollContainer | null,
  callback: () => void,
  offset: number = 0
): void => {
  const callbackRef = React.useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  React.useEffect(() => {
    if (!container) return;

    const handleScroll = () => {
      let scrollContainer: ScrollContainer;
      let scrollTop: number;
      let clientHeight: number;
      let scrollHeight: number;

      if (container === document) {
        scrollContainer = document.scrollingElement as HTMLElement;
        scrollTop = scrollContainer.scrollTop;
        clientHeight = scrollContainer.clientHeight;
        scrollHeight = scrollContainer.scrollHeight;
      } else {
        scrollContainer = container as HTMLElement;
        scrollTop = scrollContainer.scrollTop;
        clientHeight = scrollContainer.clientHeight;
        scrollHeight = scrollContainer.scrollHeight;
      }

      if (scrollTop + clientHeight >= scrollHeight - offset) {
        callbackRef.current();
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [container, offset]);
};

export default useScrollToBottomAction;
