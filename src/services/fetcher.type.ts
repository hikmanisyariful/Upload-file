import { subdomain } from '@/utils/getBaseUrl';

export interface iApiResponse<R> {
    isError: boolean;
    message?: string;
    statusCode?: errorCode;
    data?: R;
}

export interface iIdentityFetch {
    fromFunction?: string;
    fromFile?: string;
}

export interface iApiRequest extends iIdentityFetch {
    subdomain?: subdomain;
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: Object | FormData | null;
    headers?: {};
    cache?: 'default' | 'force-cache' | 'no-cache' | 'no-store' | 'only-if-cached' | 'reload';
    apiName: string;
    isShowToast?: boolean;
    isUseMessageServer?: boolean;
    isUseDataServer?: boolean;
    isMultipart?: boolean;
    signal?: AbortSignal;
}

export type errorCode = '400' | '401' | '403' | '404' | '500' | '502' | '503';

// Default response for function
export const defaultResponseError = {
    isError: true,
    message: 'Sorry, something went wrong',
};

export const defaultResponseSuccess = {
    isError: false,
    message: 'Success',
};
