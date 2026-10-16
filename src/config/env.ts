const DEFAULT_PORT = 3000;

const parsePort = (value: string | undefined): number => {
  if (value === undefined || value.trim() === "") {
    return DEFAULT_PORT;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error(`Invalid PORT environment value: "${value}"`);
  }

  return port;
};

export const config = {
  port: parsePort(process.env.PORT),
} as const;
