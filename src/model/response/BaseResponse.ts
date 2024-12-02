import {UsersVO} from "../vo/UsersVO.ts";

export type LoginDataResponseVO = {
    /** 用户信息 */
    users: UsersVO;
    /** sessionId */
    sessionId: string;
    /** 用户权限 */
    roles: string[];
}