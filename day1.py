#!/usr/bin/env python3
f = open('inputs/day1.txt', 'r')
ex = [int(exp.rstrip('\n')) for exp in f.readlines()]

for i in range(0, len(ex)):
    for j in range(i, len(ex)):
       if ex[i] + ex[j] == 2020:
           print('part 1', ex[i] * ex[j])

for i in range(0, len(ex)):
    for j in range(i, len(ex)):
        for k in range(j, len(ex)):
            if ex[i] + ex[j] + ex[k] == 2020:
                print('part 2', ex[i] * ex[j] * ex[k])
