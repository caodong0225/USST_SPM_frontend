import {UsersVO} from "../vo/UsersVO.ts";

export interface BaseResponse {
    /** 响应状态码 */
    code: number;
    /** 响应消息 */
    message: string;
}

export interface LoginDataResponseVO extends BaseResponse {
    /** 会话ID */
    sessionId: string;

    /** 用户信息 */
    user: UsersVO;
}