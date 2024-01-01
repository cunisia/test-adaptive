export const URL = "http://localhost:3000/";
export const LIST_RUNS = "list_runs";
export const RUN = "run";
export const getListRunUrl = () =>  URL + LIST_RUNS;
export const getRunUrl = (name: string, iteration: number) => {
  return `${URL}${RUN}/${name}/${iteration}`;
}