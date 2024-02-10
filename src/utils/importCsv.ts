export const importCsv = (file: Blob, cb: Function) => {
  const reader = new FileReader();

  reader.onload = function () {
    const contents = reader.result;

    if (typeof contents === 'string') {
      const rows = contents.split('\n');
      const data = [];
      
      for (let i = 0; i < rows.length; i++) {
        const _r = rows[i].replace('\r', '');
        console.log(_r);
        if (_r) {
          const columns = _r.split(',');
          data.push(columns);
        }
      }
      

      cb(data);
    }
  };

  reader.readAsText(file, 'utf-8');
};
