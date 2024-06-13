import { LogLevel } from "../type";

export function log(
  level: LogLevel,
  message: string,
  ...optionalParams: unknown[]
): void {
  const cache = new Set();

  const formattedParams = optionalParams
    .map((param) => {
      if (typeof param === "object") {
        return JSON.stringify(
          param,
          (_key, value) => {
            if (typeof value === "object" && value !== null) {
              if (cache.has(value)) {
                return;
              }
              cache.add(value);
            }
            return value instanceof HTMLElement
              ? `HTMLElement: ${value.tagName}`
              : value;
          },
          2
        );
      } else {
        return String(param);
      }
    })
    .join(" ");

  console[level](`${message} ${formattedParams}`);
  cache.clear();
}
