// export class ErrorModel{
//     IsDone:any;
//     ResponseId:any;
//     MessegesStr:any;
//     ErrorMessegesStr:any;
//     Messages:any;
//     ErrorMessages:any;
//     ReturnedObject:any;
//   }

    export interface NormalizedNames {
    }

    export interface Headers2 {
    }

    export interface Headers {
        normalizedNames: NormalizedNames;
        lazyUpdate?: any;
        headers: Headers2;
    }

    export interface Error {
        isTrusted: boolean;
    }

    export interface ErrorModel {
        headers: Headers;
        status: number;
        statusText: string;
        url?: any;
        ok: boolean;
        name: string;
        message: string;
        error: Error;
    }
