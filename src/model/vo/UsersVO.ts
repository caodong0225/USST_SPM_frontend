export type UsersVO = {
    /** 用户ID */
    id: number;

    /** 创建时间 */
    createdAt?: string; // 使用 string 来表示日期时间格式（例如 ISO8601 格式）

    /** 更新时间 */
    updatedAt?: string; // 同上，使用 string 来表示日期时间

    /** 用户名 */
    username: string;

    /** 昵称 */
    nickname: string;

    /** 邮箱 */
    email?: string;

    /** 手机号码 */
    phone?: string;
}