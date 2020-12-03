#!/usr/bin/env python3
from operator import itemgetter

with open('inputs/day3.txt', 'r') as file:
	slope = [ (1,1), (3,1), (5,1), (7,1), (1,2)]
	max_x = max(slope,key=itemgetter(0))[0]
	hash_count = {key: 0 for key in slope}

	for ln_no, line in enumerate(file):
		l = line.rstrip()
		while ln_no * max_x > len(l):
			l += l
		for x, y in slope:
			if ln_no % y != 0:
				continue
			index = int((ln_no / y) * x)
			hash_count[(x,y)] += int(l[index] == "#")

	part2 = 1
	for i in hash_count:
		part2 = part2 * hash_count[i]
	
	print('part 1', hash_count[(3,1)])
	print('part 2', part2)
