import * as fs from "fs";

export const getFileContent = (location: string) => {
  return fs.readFileSync(location, "utf8");
};

export const getDataAsArray = (data: string, separator = "\n") => {
  return data.split(separator);
};

export const getDataAsArrayOfNumbers = (data: string, separator = "\n") => {
  return data.split(separator).map((x) => parseInt(x));
};
