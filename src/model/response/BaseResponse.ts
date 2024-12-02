import {UsersVO} from "../vo/UsersVO.ts";

export interface BaseResponse {
    /** 响应状态码 */
    code: number;
    /** 响应消息 */
    message: string;
}

export type LoginDataResponseVO = {
    /** 响应状态码 */
    code: number;
    /** 响应消息 */
    message: string;
    /** 会话ID */
    sessionId: string;
    /** 用户信息 */
    user: UsersVO;
}