export interface CreateCourseDTO {
    /**
     * 课程名称
     */
    courseName: string;

    /**
     * 课程描述
     */
    courseDesc: string;

    /**
     * 课程图片
     */
    coursePic: string;

    /**
     * 课程开始时间
     */
    startTime: string; // 或者使用 Date，如果你需要更复杂的时间操作

    /**
     * 课程结束时间
     */
    endTime: string; // 或者使用 Date，如果你需要更复杂的时间操作
}
