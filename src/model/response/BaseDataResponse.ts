import {BaseResponse} from "./BaseResponse";

export interface BaseDataResponse extends BaseResponse {
    /** 响应数据 */
    data: any; // 可以根据需求替换为具体类型
}
