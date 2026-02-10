export const TOTAL_ROWS = 15;
export const SEATS_PER_ROW = 4;
export const MAX_SEATS_PER_USER = 6;
export const SEAT_PRICE = 25;

export interface Seat {
  id: string;
  row: number;
  col: string;
  isAisle: boolean;
  type: "window" | "aisle";
}
export const generateSeatLayout = (): Seat[] => {
  const layout: Seat[] = [];
  const columns = ["A", "B", "C", "D"];

  for (let r = 1; r <= TOTAL_ROWS; r++) {
    for (let c = 0; c < columns.length; c++) {
      layout.push({
        id: `${columns[c]}${r}`,
        row: r,
        col: columns[c],
        isAisle: c === 1,
        type: c === 0 || c === 3 ? "window" : "aisle",
      });
    }
  }
  return layout;
};
