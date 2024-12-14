type Options = {
  min?: number;
  max?: number;
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function delayExecution(fn: (...args: unknown[]) => void, {max = 1000 * 60, min = 0}: Options= {}) {
  const delay = getRandomInt(min, max);

  setTimeout(fn, delay);
}

export function randomWait({min = 0, max = 1000 * 60}: Options= {}) {
  return new Promise((resolve) => {
    const delay = getRandomInt(min, max);

    setTimeout(resolve, delay);
  });
}
