export function errorReport(e: Error, labels: labels): void {
  console.log(
    JSON.stringify(
      Object.assign(
        {
          severity: 'ERROR',
          stack_trace: e.stack || e.message,
        },
        labels,
      ),
    ),
  );
}

interface labels {
  [k: string]: string;
}
