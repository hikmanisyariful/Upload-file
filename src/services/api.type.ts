type OptionValue = string | string[] | number | number[] | boolean;

export type OptionRecord = Record<string, OptionValue>;

/**
 * Standard option object for services.
 *
 * @template H - The type of the headers.
 * @template P - The type of the parameters.
 * @template Q - The type of the query parameters.
 * @template B - The type of the request body.
 */
export interface BaseServiceOptions<
  U = string,
  H = OptionRecord,
  P = OptionRecord,
  Q = OptionRecord,
  B = OptionRecord
> {
  url?: U;
  headers?: H;
  params?: P;
  query?: Q;
  body?: B;
}

export type QueryPagination = {
  limit?: number;
  offset?: number;
};
