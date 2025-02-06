declare module '*.csv' {
  const content: Array<{
    year: number;
    [key: string]: number | string;
  }>;
  export default content;
}
