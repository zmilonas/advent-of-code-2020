package main

import (
	"bufio"
	"fmt"
	"os"
)

func check(e error) {
	if e != nil {
		panic(e)
	}
}


func main() {
	file, err := os.Open("./inputs/day6.txt")
	check(err)
	defer file.Close()

	answerSet := make(map[string]int)
	totalCount := 0
	groupCount := 0
	p2count := 0

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		if line == "" {
			totalCount += len(answerSet)
			for _, val := range answerSet {
				if val == groupCount {
					p2count++
				}
			}

			answerSet = make(map[string]int)
			groupCount = 0
			continue
		}
		groupCount++
		for _, r := range line {
			char := string(r)
			_, has := answerSet[char]
			if has {
				answerSet[char]++
			} else {
				answerSet[char] = 1
			}
		}

	}
	check(scanner.Err())

	totalCount += len(answerSet)
	for _, val := range answerSet {
		if val == groupCount-1 {
			p2count++
		}
	}

	fmt.Println("part 1", totalCount)
	fmt.Println("part 2", p2count)
}

