/**
 * We need to throttle resize and mousemove events. Adapted from
 * https://developer.mozilla.org/en-US/docs/Web/Events/resize#requestAnimationFrame
 */

type Listener<T = Event> = (e: T) => void;

const callbacks: Record<string, Listener<$AnyFixMe>[]> = {};
let running = false;

// run the actual callbacks
function runCallbacks(event: string, e: MouseEvent | Event): void {
  if (event in callbacks) {
    callbacks[event].forEach(cb => cb(e));
    running = false;
  }
}

function handler(event: string) {
  return (e: Event) => {
    if (!running) {
      running = true;
      window.requestAnimationFrame(() => runCallbacks(event, e));
    }
  };
}

// adds callback to loop
function addCallback(event: string, callback: Listener): void {
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

export function elementsFromPoint(x: number, y: number): HTMLElement[] {
  const elements: [HTMLElement, string][] = [];

  let element: HTMLElement = document.elementFromPoint(x, y) as HTMLElement;

  while (element && element !== document.documentElement) {
    elements.push([element, element.style.visibility]);
    element.style.visibility = 'hidden';
    element = document.elementFromPoint(x, y) as HTMLElement;
  }

  for (const [element, visibility] of elements) {
    element.style.visibility = visibility;
  }

  return elements.map(i => i[0]).reverse();
}
