
export default class Logger {
    static info(message: any, ...rest: any[]) {
      const date = new Date()
        .toISOString()
        .replace(/T/, " ") // replace T with a space
        .replace(/\..+/, ""); // delete the dot and everything after;
      return console.log(`[${date}] ${message}`, ...rest);
    }
  
    static error(message: any , ...rest: any[]) {
      const date = new Date()
        .toISOString()
        .replace(/T/, " ") // replace T with a space
        .replace(/\..+/, ""); // delete the dot and everything after;
      return console.error(`[${date}] ${message}`, ...rest);
    }
  }