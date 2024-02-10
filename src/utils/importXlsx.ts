// 引入 js-xlsx 模块
import * as XLSX from 'xlsx';

export const importXlsx = (file: Blob, cb: Function) => {
  const reader = new FileReader(); // 创建文件读取器

  reader.onload = function (event) {
    if (event.target) {
      const data = event.target.result; // 读取文件内容

      const workbook = XLSX.read(data); // 将文件内容转换为工作簿对象
      const worksheetName = workbook.SheetNames[0]; // 获取第一个工作表名称
      const worksheet = workbook.Sheets[worksheetName]; // 根据工作表名称获取工作表对象

      // 从工作表对象中提取数据
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      cb(jsonData)
    }
  };

  reader.readAsArrayBuffer(file); // 开始读取文件内容
};
