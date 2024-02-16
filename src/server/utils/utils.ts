import CustomError from "../types.js"

export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function calculateCosts(resultObj: { [key: number]: number }): { [key: number]: number } {
  const newObj: { [key: number]: number } = {};

  for (const key in resultObj) {
    if (Object.prototype.hasOwnProperty.call(resultObj, key)) {
      const originalValue = resultObj[key];

      const megabytesToGigabytes = Number(key) / 1024; // 1 GB = 1024 MB


      const millisecondsToSeconds = originalValue / 1000;

      // Calculate the new value in gigabyte-seconds
      //PER THOUSAND INVOCATIONS
      const newValue = megabytesToGigabytes * millisecondsToSeconds * 0.0000166667 * 1000000;
      newObj[Number(key)] = newValue;
    }
  }

  return newObj;
}

export function extractBilledDurationFrom64(logText) {

  const billedDurationRegex = /Billed Duration: (\d+(\.\d+)?) ms/;
  const match = logText.match(billedDurationRegex);


  if (match) {

    return match[1]
  } else {
    return 'error!'
  }
}

export function reduceObjectToMedian(inputObj: object) {
  const result = {};

  for (const key in inputObj) {
    if (Object.prototype.hasOwnProperty.call(inputObj, key)) {
      const values = inputObj[key].map(Number);
      values.sort((a, b) => a - b); //sort

      let median;
      const middle = Math.floor(values.length / 2);

      if (values.length % 2 === 0) {
        median = (values[middle - 1] + values[middle]) / 2;
      } else {
        median = values[middle];
      }

      result[key] = median;
    }
  }

  return result;
}

export function createCustomError(message, status, requestDetails) {
  const error: CustomError = new Error(message);
  error.status = status;
  error.requestDetails = requestDetails;
  return error;
}

export function getRegionFromARN(arn) {
  const arnParts = arn.split(':');
  if (arnParts.length >= 4) {
    return arnParts[3];
  } else {
    return null;
  }
}