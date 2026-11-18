export class ValidationError extends Error {
  name = this.constructor.name; 
  
  constructor(message: string, public statusCode: number = 400) {
    super(message);
  }
}