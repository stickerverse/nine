(() => {
  window.duet =
    window.duet ||
    (function () {
      const iframe = document.createElement("iframe"); // private
      let isLoaded = false;

      const sendMessageSafely = (message) => {
        if (isLoaded) {
          iframe.contentWindow.postMessage(message, "https://decagon.ai");
        } else {
          window.addEventListener(
            "decagonload",
            () => {
              iframe.contentWindow.postMessage(message, "https://decagon.ai");
            },
            { once: true },
          );
        }
      };

      return {
        init: function () {
          const loadWidget = () => {
            const iframeStyle = iframe.style;

            iframeStyle.boxSizing = "borderBox";
            iframeStyle.position = "fixed";
            iframeStyle.right = 0;
            iframeStyle.bottom = 0;
            iframeStyle.border = 0;
            iframeStyle.margin = 0;
            iframeStyle.padding = 0;
            iframeStyle.zIndex = 99999999;
            iframeStyle.display = "none";
            iframeStyle.outline = "none";
            iframeStyle.pointerEvents = "none";

            iframeStyle.width = `220px`;
            iframeStyle.height = `100px`;

            iframe.addEventListener("load", () => {
              iframe.style.display = "block";
            });

            const widgetUrl = `https://decagon.ai/demo/fourthwall`;

            iframe.src = widgetUrl;

            document.body.appendChild(iframe);

            window.addEventListener("message", function (e) {
              const key = e.message ? "message" : "data";
              const data = e[key];

              if (typeof data !== "object") return;

              if (data.type === "DECAGON_HOVER") {
                iframe.style.pointerEvents = "auto";
                const desiredWidth = Math.min(window.innerWidth, 500);
                const desiredHeight = Math.min(window.innerHeight, 700);
                iframeStyle.width = `${desiredWidth}px`;
                iframeStyle.height = `${desiredHeight}px`;
              } else if (data.type === "DECAGON_UNHOVER") {
                iframe.style.pointerEvents = "none";
              } else if (data.type === "DECAGON_INACTIVE") {
                iframe.style.width = "220px";
                iframe.style.height = "100px";
              } else if (data.type === "DECAGON_LOADED") {
                if (isLoaded) return;
                window.dispatchEvent(new CustomEvent("decagonload"));
                isLoaded = true;
              }
            });

            document.addEventListener("mousemove", function (e) {
              if (!isLoaded) return;

              const coord = {
                x: e.clientX - iframe.offsetLeft,
                y: e.clientY - iframe.offsetTop,
              };

              iframe.contentWindow.postMessage({ coord }, "*");
            });
          };

          if (document.readyState === "complete") {
            loadWidget();
          } else {
            document.addEventListener("readystatechange", () => {
              if (document.readyState === "complete") {
                loadWidget();
              }
            });
          }
        },
        addMetadata: function (metadata) {
          sendMessageSafely({ addMetadata: metadata });
        },
        setMetadata: function (metadata) {
          sendMessageSafely({ metadata });
        },
        setUserIdAuth: function (signature, epoch) {
          sendMessageSafely({ userIdAuth: { signature, epoch } });
        },
        setUserId: function (userId) {
          sendMessageSafely({ userId });
        },
        hide: function () {
          sendMessageSafely({ hiddenMode: true });
        },
        unhide: function () {
          sendMessageSafely({ hiddenMode: false });
        },
        open: function () {
          sendMessageSafely({ isVisible: true });
        },
        close: function () {
          sendMessageSafely({ isVisible: false });
        },
        setChatSessionDuration: function (durationInHours) {
          sendMessageSafely({ chatSessionDuration: durationInHours });
        },
        openConversation: function (conversationId) {
          sendMessageSafely({ conversationId });
        },
        setTriggerMessage: function (triggerMessage, isProactive = false) {
          sendMessageSafely({ triggerMessage, isProactive });
        },
        setProactiveMessage: function (proactiveMessage) {
          sendMessageSafely({ proactiveMessage });
        },
        setInitialUserMessage: function (initialUserMessage) {
          sendMessageSafely({ initialUserMessage });
        },
        startNewConversation: function () {
          sendMessageSafely({ startNewConversation: true });
        },
        isReady: function () {
          return isLoaded;
        },
        sendMessage: function (sdkMessage) {
          sendMessageSafely({ sdkMessage });
        },
        setLocalizationData: function (localizationData) {
          sendMessageSafely({ localizationData });
        },
        setEventListener: function (callback) {
          window.addEventListener("message", function (e) {
            const key = e.message ? "message" : "data";
            const data = e[key];

            if (
              typeof data === "object" &&
              data.type === "USER_ACTION" &&
              data.payload
            )
              callback(data.payload);
          });
        },
      };
    })();

  window.duet.init();
})();
