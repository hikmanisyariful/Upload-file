/* eslint-disable @typescript-eslint/no-unused-expressions */
import getApiBaseUrl from "@/utils/getBaseUrl";
import { errorCode, iApiRequest, iApiResponse } from "./fetcher.type";
import toast from "react-hot-toast";

const getCustomMessageError = (statusCode: errorCode) => {
  let errorMessage = "";

  switch (statusCode) {
    case "400":
      errorMessage =
        "The request could not be understood by the server due to malformed syntax.";
      break;
    case "401":
      errorMessage = "The request requires user authentication.";
      break;
    case "403":
      errorMessage =
        "The server understood the request, but is refusing to fulfill it.";
      break;
    case "404":
      errorMessage =
        "The server has not found anything matching the Request-URI.";
      break;
    case "500":
      errorMessage =
        "The server encountered an unexpected condition which prevented it from fulfilling the request.";
      break;
    case "502":
      errorMessage =
        "The server received an invalid response from the upstream server it accessed in attempting to fulfill the request.";
      break;
    case "503":
      errorMessage =
        "The server is currently unable to handle the request due to a temporary overloading or maintenance of the server";
      break;
    default:
      errorMessage = "Sorry, something went wrong.";
      break;
  }

  return `${errorMessage}`;
};

const fetcher = async <R>({
  url,
  subdomain,
  method = "GET",
  body,
  headers,
  cache = "default",
  apiName,
  isShowToast = false,
  isUseMessageServer = false,
  isUseDataServer = false,
  isMultipart = false,
  signal,
  ...props
}: iApiRequest): Promise<iApiResponse<R>> => {
  const options: RequestInit = {
    method,
    cache,
    headers: {
      "X-From": "Web",
      ...headers,
    },
  };
  if (!isMultipart)
    options.headers = {
      ...options.headers,
      "Content-Type": "application/json",
    };
  if (body)
    options.body = isMultipart ? (body as FormData) : JSON.stringify(body);

  const response: iApiResponse<R> = {
    isError: false,
    data: {} as R,
  };
  try {
    const res = await fetch(subdomain ? getApiBaseUrl(subdomain) + url : url, {
      ...options,
      signal,
    });
    response.statusCode = res.status.toString() as errorCode;
    const resData = (await res.json()) as iApiResponse<R>;
    if (!res.ok) {
      // 1. set response error
      response.isError = true;
      const customErrrorMessage = isUseMessageServer
        ? resData.message
        : getCustomMessageError(res.status.toString() as errorCode);

      response.message = customErrrorMessage;
      if (isUseDataServer) {
        response.data = resData.data;
      }
      // 2. Send error info to error log monitoring
      // dikirim time, apiName, statusCode, message, fromFile, fromFunction
      // temporary with console.log
      console.log(
        `Error: ${apiName} - ${res.status.toString()}: ${customErrrorMessage} ( ${
          props?.fromFunction
        } - ${props?.fromFile} )`
      );

      // 3. handle error showing for client side
      isShowToast && toast.error(customErrrorMessage!);
    } else {
      response.data = resData.data;
      response.message = resData.message;
    }
  } catch (error) {
    console.log("Catch Error: ", apiName, error);
    response.isError = true;
  }

  return response;
};

export default fetcher;
