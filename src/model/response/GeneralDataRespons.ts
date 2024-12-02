import {BaseResponse} from "./BaseResponse";

export interface GeneralDataResponse<T> extends BaseResponse {
    /** 响应数据 */
    data: T;
}
