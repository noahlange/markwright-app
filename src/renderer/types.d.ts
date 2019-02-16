import Events from '@common/events';

type CallbackHandler = (e: Event, ...args: $AnyFixMe[]) => void;

declare global {
  var homedir: () => string;
  var platform: () => string;
  var events: {
    on: (event: Events, callback: CallbackHandler) => void;
    once: (event: Events, callback: CallbackHandler) => void;
    off: (events: Events[]) => void;
    send: (event: Events, ...args: $AnyFixMe[]) => void;
  };
  var MonacoEnvironment: $AnyFixMe;
}
