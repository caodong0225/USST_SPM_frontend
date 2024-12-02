// 定义分页数据格式
export interface IPage<T> {
    records: T[]; // 当前页的数据列表
    total: number; // 总记录数
    size: number; // 每页数据量
    current: number; // 当前页码
}