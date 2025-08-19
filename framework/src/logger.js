// logger.js
export const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  OFF: 4,
};

let globalLevel = LogLevel.WARN;
const loggers = new Map();

// Set global default or per-logger level
export function setLogLevel(level, name = null) {
  if (name) {
    const logger = loggers.get(name);
    if (logger) logger.setLogLevel(level);
  } else {
    globalLevel = level;
  }
}

// Helper: auto-detect caller module name (simple fallback)
function getCallerName(stackIndex = 3) {
  try {
    const err = new Error();
    const stack = err.stack.split("\n");
    const line = stack[stackIndex] ?? "";
    const match = line.match(/at (\S+)/);
    return match ? match[1] : "unknown";
  } catch {
    return "unknown";
  }
}

export function getLogger(name = null) {
  if (!name) name = getCallerName();

  let localLevel = null;

  function getEffectiveLevel() {
    return localLevel ?? globalLevel;
  }

  function shouldLog(level) {
    return level >= getEffectiveLevel();
  }

  function log(method, level, prefix, args) {
    if (shouldLog(level)) {
      const timestamp = new Date().toISOString();
      console[method](`${timestamp} [${prefix}] ${name} -`, ...args);
    }
  }

  const logger = {
    setLogLevel: (level) => {
      localLevel = level;
    },
    debug: (...args) => log("debug", LogLevel.DEBUG, "DEBUG", args),
    info: (...args) => log("info", LogLevel.INFO, "INFO", args),
    warn: (...args) => log("warn", LogLevel.WARN, "WARN", args),
    error: (...args) => log("error", LogLevel.ERROR, "ERROR", args),
  };

  loggers.set(name, logger);
  return logger;
}
