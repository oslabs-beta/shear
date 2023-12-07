export default interface CustomError extends Error {
    status?: number;
    requestDetails?: { body: string };
    // Add any additional properties or structure you need for your CustomError type
  }