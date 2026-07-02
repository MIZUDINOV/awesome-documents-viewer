export interface Document {
  name: string;
  pages: Page[];
}

export interface Page {
  number: number;
  imageUrl: `pages/${number}.png`;
}
