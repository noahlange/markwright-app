/**
 * We need to throttle resize and mousemove events. Adapted from
 * https://developer.mozilla.org/en-US/docs/Web/Events/resize#requestAnimationFrame
 */

type Listener<T = Event> = (e: T) => void;

const callbacks: Record<string, Array<Listener<$AnyFixMe>>> = {};
let running: boolean = false;

function handler(event: string) {
  return (e: Event) => {
    if (!running) {
      running = true;
      window.requestAnimationFrame(() => runCallbacks(event, e));
    }
  };
}

// run the actual callbacks
function runCallbacks(event: string, e: MouseEvent | Event) {
  if (event in callbacks) {
    callbacks[event].forEach(cb => cb(e));
    running = false;
  }
}

// adds callback to loop
function addCallback(event: string, callback: Listener) {
  if (callback) {
    event in callbacks
      ? callbacks[event].push(callback)
      : (callbacks[event] = [callback]);
  }
}

export function unlisten(...events: string[]): void {
  for (const event of events) {
    if (event in callbacks) {
      callbacks[event] = [];
    }
  }
}

export function listen(
  event: 'keydown' | 'keyup' | 'keypress',
  callback: Listener<KeyboardEvent>
): void;
export function listen(
  event: 'mousewheel',
  callback: Listener<WheelEvent>
): void;
export function listen(
  event: 'mousemove',
  callback: Listener<MouseEvent>
): void;
export function listen(event: 'resize', callback: Listener<UIEvent>): void;
export function listen(event: string, callback: Listener<$AnyFixMe>): void {
  const toThrottle = ['mousewheel', 'mousemove', 'resize'];
  if (!callbacks.length) {
    if (toThrottle.includes(event)) {
      addCallback(event, callback);
      window.addEventListener(event, handler(event));
    } else {
      window.addEventListener(event, callback);
    }
  }
}
