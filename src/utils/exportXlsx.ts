// 引入 js-xlsx 模块
import * as XLSX from 'xlsx';

export const exportXlsx = (columns: any[], sourceData: any[], tableName: string) => {
  const colKeys = columns.map((col) => col.key);
  const colData = columns.map((col) => col.title);

  const rowData = sourceData.map((item: any) => {
    return colKeys.map((key) => item[key]);
  });

  // 创建工作簿对象
  const workbook = XLSX.utils.book_new();

  // 定义要导出的数据
  const data = [colData, ...rowData];

  // 转换数据为 Worksheet 对象
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // 添加 Worksheet 到工作簿
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // 保存工作簿为 Excel 文件
  XLSX.writeFile(workbook, `${tableName}-${Date.now()}.xlsx`);
};
