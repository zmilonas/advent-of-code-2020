#!/usr/bin/env deno run --allow-read
import {assertEquals} from "https://deno.land/std/testing/asserts.ts";

function getTuple(partition: string): [number, number] {
  const row = [...partition].slice(0, 7).reduce((n, c, i) => n + (1 << 6 - i) * (c === 'B' ? 1 : 0), 0);
  const col = [...partition].slice(7).reduce((n, c, i) => n + (1 << 2 - i) * (c === 'R' ? 1 : 0), 0);

  return [row, col];
}

function getSeatId([row, col]: [number, number]): number {
  return row * 8 + col;
}

const data = await Deno.readTextFile("./inputs/day5.txt");
const seats = data
    .split('\n').filter(a => a !== '')
    .map(getTuple)
    .map(getSeatId)
    .sort((a, b) => a - b);

console.log('part 1', seats.pop());
const mySeat = seats.find((val, i, obj) =>  i > 0 && val - obj[i - 1] > 1) || 0;
console.log('part 2', mySeat - 1);

Deno.test("BFFFBBFRRR", function () {
  assertEquals(getTuple("BFFFBBFRRR"), [70, 7]);
});
Deno.test("FFFBBBFRRR", function () {
  assertEquals(getTuple("FFFBBBFRRR"), [14, 7]);
});
Deno.test("BBFFBBFRLL", function () {
  assertEquals(getTuple("BBFFBBFRLL"), [102, 4]);
});
Deno.test("Seat ID", function () {
  assertEquals(getSeatId([70, 7]), 567);
  assertEquals(getSeatId([14, 7]), 119);
  assertEquals(getSeatId([102, 4]), 820);
});
Deno.test("Seat ID of BBFFBBFRLL", function () {
  assertEquals(getSeatId(getTuple("BBFFBBFRLL")), 820);
})
Deno.test("Seat ID of FFFBBBFRRR", function () {
  assertEquals(getSeatId(getTuple("FFFBBBFRRR")), 119);
})
Deno.test("Seat ID of BFFFBBFRRR", function () {
  assertEquals(getSeatId(getTuple("BFFFBBFRRR")), 567);
})

Deno.test("Tuple and Seat ID of FBFBBFFRLR", function() {
  const seat = getTuple('FBFBBFFRLR');
  assertEquals(seat, [44, 5]);
  assertEquals(getSeatId(seat), 357);
})
