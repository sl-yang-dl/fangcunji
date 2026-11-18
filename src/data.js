/**
 * 中国邮票册数据（兼容入口）
 *
 * 数据已按年拆分至 src/data/{年份}.js，本文件仅做汇总转发，
 * 供既有组件（import STAMP_DATA from "./data.js"）无感使用。
 *
 * 字段说明：
 *   id        : 唯一标识（{年份}-{序号}）
 *   zihao     : 邮票志号（暂为 Colnect 编号，正式志号待补）
 *   name      : 邮票名称（Colnect 英文名，中文名待补）
 *   year      : 发行年份（数字）
 *   date      : 发行日期（"YYYY年M月D日"）
 *   category  : 类别（纪念邮票/特种邮票/普通邮票 等）
 *   layout    : 版式（邮票/小本票/版张）
 *   theme     : 专题
 *   total     : 全套枚数（一邮票一记录，恒为 1）
 *   faceValue : 面值
 *   spec      : 邮票规格（"宽×高毫米"）
 *   designer  : 设计者
 *   printer   : 印制厂
 *   intro     : 背景介绍（Colnect 说明）
 *   stamps    : 各枚图案（一邮票一记录，为空）
 *   color     : 颜色
 *   mintage   : 发行数量
 *   colnectId : Colnect 页面 ID
 *   source    : 数据来源（colnect）
 */

export { default, STAMP_DATA, YEARS } from "./data/index.js";
export { DATA_META } from "./data/meta.js";
