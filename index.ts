import * as fs from "fs";
import * as readLine from "readline";

const WORD_NUMBERS = ["one",
"two",
"three",
"four",
"five",
"six",
"seven",
"eight",
"nine",
"ten",]

const NUMBERS_AS_WORDS = {
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "ten": 10,
 };


async function parseNumberFromFileAndAdd(): Promise<number> {
    const readStream = fs.createReadStream("./data.txt");
    const readLineInterface = readLine.createInterface({
        input: readStream,
        crlfDelay: Infinity
      });
    let total = 0;
    for await (const line of readLineInterface) {
        // have to loop over forwards then backwards
        console.log(line);
        // forwards
        const forwardsStringArray = [];
        let firstNumber = 0;
        for (const letterOrNumber of line) {
            if (isNaN(parseInt(letterOrNumber))) {
                // must be a letter
                forwardsStringArray.push(letterOrNumber);
                // currentString
                const currentString = forwardsStringArray.join("");
                if (Object.keys(NUMBERS_AS_WORDS).filter((numberAsWord) => currentString.includes(numberAsWord)).length) {
                    // console.log(`Matched a number forwards for line: ${line} : ${currentString}`)
                    const firstNumberKey = Object.keys(NUMBERS_AS_WORDS).filter((numberAsWord) => currentString.includes(numberAsWord))[0];
                    firstNumber = NUMBERS_AS_WORDS[firstNumberKey];
                    break;
                }
            } else {
                firstNumber = parseInt(letterOrNumber);
                break;
            }
        }
        //backwards
        const backwardsStringArray = [];
        let lastNumber = 0;
        const reversedLine = line.split("").reverse().join("");
        // console.log(`Reversed line: ${reversedLine}`);
        for (const letterOrNumber of reversedLine) {
            backwardsStringArray.push(letterOrNumber);
            if (isNaN(parseInt(letterOrNumber))) {
                // must be a letter
                // currentString
                const copyOfArray = backwardsStringArray.slice();
                const currentBackwardString = copyOfArray.reverse().join("");
                if (Object.keys(NUMBERS_AS_WORDS).filter((numberAsWord) => currentBackwardString.indexOf(numberAsWord) > -1).length) {
                    // console.log(`Matched a number in reverse for line: ${line}, reversed line: ${reversedLine} : ${currentBackwardString}`)
                    const firstNumberKey = Object.keys(NUMBERS_AS_WORDS).filter((numberAsWord) => currentBackwardString.includes(numberAsWord))[0];
                    lastNumber = NUMBERS_AS_WORDS[firstNumberKey];
                    break;
                }
            } else {
                // console.log(`Matched a number in reverse for line: ${line}, reversed line: ${reversedLine} : ${letterOrNumber}`)
                lastNumber = parseInt(letterOrNumber);
                break;
            }
        }
        console.log(`String of numbers to add ${[firstNumber, lastNumber].join("")}`);
        const joinedTogether = parseInt([firstNumber, lastNumber].join(""), 10);
        total += joinedTogether;    
    }
    return total;
}


async function main() {
    const result = await parseNumberFromFileAndAdd();
    console.log(`The total is ${result}`);
}

main();
