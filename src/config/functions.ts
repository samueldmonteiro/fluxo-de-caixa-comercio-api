export function excludeParam<T, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const clone = { ...obj };
  for (const key of keys) delete clone[key];
  return clone;
}

export function getDatetimeNowFormatted(): string {
  const dateObj = new Date();
  
  // toISOString() retorna 'YYYY-MM-DDTHH:mm:ss.sssZ'
  const isoString = dateObj.toISOString(); 

  // Ajusta para o formato do MySQL: 'YYYY-MM-DD HH:mm:ss'
  // Remove o 'T' e a parte dos milissegundos e fuso horário ('Z')
  const mysqlDatetime = isoString.slice(0, 19).replace('T', ' '); 

  return mysqlDatetime;
}
