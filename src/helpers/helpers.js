import { directions } from "../constants/constants";

export function areDirectionsOpposite(dir1, dir2) {
  return dir1 === directions.UP && dir2 === directions.DOWN
    || dir1 === directions.DOWN && dir2 === directions.UP
    || dir1 === directions.RIGHT && dir2 === directions.LEFT
    || dir1 === directions.LEFT && dir2 === directions.RIGHT;
}

export function getOppositeDirection(direction) {
  switch (direction) {
    case directions.UP:
      return directions.DOWN;
    case directions.DOWN:
      return directions.UP;
    case directions.LEFT:
      return directions.RIGHT;
    case directions.RIGHT:
      return directions.LEFT;
  }
}