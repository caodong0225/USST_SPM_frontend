export interface UserCoursesVO {
    /**
     * 课程ID
     */
    courseId: number;

    /**
     * 课程名称
     */
    courseName: string;

    /**
     * 课程图片
     */
    coursePic: string;

    /**
     * 课程描述
     */
    courseDesc: string;

    /**
     * 课程开始时间
     */
    startTime: string; // 使用 ISO 8601 格式的字符串或 Date 对象

    /**
     * 课程结束时间
     */
    endTime: string; // 使用 ISO 8601 格式的字符串或 Date 对象

    /**
     * 课程状态
     */
    status: string;

    /**
     * 参与者评论
     */
    participantComment: string;
}
