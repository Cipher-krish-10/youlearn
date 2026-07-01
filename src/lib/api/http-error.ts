/**
 * Base class for typed client-side API errors. Subclasses just fix the `code`
 * union and inherit a consistent shape (`code`, `message`, `status`), so each
 * feature doesn't redeclare the same boilerplate.
 */
export class HttpError<Code extends string = string> extends Error {
  readonly code: Code;
  readonly status: number;

  constructor(code: Code, message: string, status: number) {
    super(message);
    this.name = new.target.name;
    this.code = code;
    this.status = status;
  }
}
