export class appError extends Error {
  constructor(public message: string, public statusCode: number = 500) {
    super(message);
    Object.setPrototypeOf(this, appError.prototype);
  }
}

export const catchAsync = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    fn(req, res, next).catch(next);
  };
};