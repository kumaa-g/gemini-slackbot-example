export function debug(message: string, labels: labels): void {
  log(severity.INFO, message, labels);
}

export function info(message: string, labels: labels): void {
  log(severity.INFO, message, labels);
}

export function warn(message: string, labels: labels): void {
  log(severity.WARNING, message, labels);
}

export function error(message: string, labels: labels): void {
  log(severity.ERROR, message, labels);
}

const severity = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
} as const;

interface labels {
  [k: string]: string;
}

function log(
  s: (typeof severity)[keyof typeof severity],
  message: string,
  labels: labels,
): void {
  console.log(
    JSON.stringify(
      Object.assign(
        {
          severity: s,
          message,
        },
        labels,
      ),
    ),
  );
}
