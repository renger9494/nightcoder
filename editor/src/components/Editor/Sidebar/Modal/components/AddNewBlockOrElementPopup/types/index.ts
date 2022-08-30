export interface IBlock {
  id?: number;
  name: string;
  title: string;
  files: Array<any>;
}

export interface IBlocksData {
  id?: number;
  title: string;
  blocks: Array<IBlock>;
}
