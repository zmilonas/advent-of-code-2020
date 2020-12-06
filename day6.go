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

	answerSet := make(map[string]struct{})
	count := 0

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		if line == "" {
			count += len(answerSet)
			answerSet = make(map[string]struct{})
		}
		for _, r := range line {
			char := string(r)
			_, has := answerSet[char]
			if has {
				continue
			}
			answerSet[char] = struct{}{}
		}

	}
	count += len(answerSet)
	check(scanner.Err())
	fmt.Println("part 1", count)
}

