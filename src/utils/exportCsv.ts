export const exportCsv = (columns: any[], data: any[], tableName: string) => {
  const tHeader = columns.map((col) => col.title).join(',');
  const filterVal = columns.map((col) => col.key);

  let csvString = tHeader;
  csvString += '\r\n';

  data.forEach((item: any) => {
    filterVal.forEach((key) => {
      csvString += item[key] + ',';
    });
    csvString += '\r\n';
  });

  csvString = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(csvString);

  const link = document.createElement('a');
  link.href = csvString;
  link.download = `${tableName}-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
