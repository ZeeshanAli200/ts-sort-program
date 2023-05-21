import fs from "fs";
import path from "path";
import readline from "readline";

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

type numberArray = number[];
type OrderByType = string;
const AscendingOrder = "asc";
const DecendingOrder = "desc";

class Sort {
  orderBy: OrderByType;
  constructor(orderName: OrderByType) {
    this.orderBy = orderName;
  }

  //here we are breaking an array using recursion until its breakdown to length one
  sortAlgoMergeSort(newArr: numberArray): numberArray {
    if (newArr?.length < 2) {
      // console.log({ newArr });

      return newArr;
    }

    let mid = Math.floor(newArr.length / 2);
    let leftSide: numberArray = newArr.slice(0, mid);
    let rightSide: numberArray = newArr.slice(mid);

    // in the below code recursion happens until the array length is one

    let merged = this.mergingTwoArrays(
      this.sortAlgoMergeSort(leftSide),
      this.sortAlgoMergeSort(rightSide)
    );

    // console.log({ merged, leftSide, rightSide });

    return merged;
  }

  //here we are comparing and merging two separate arrays that were divided from one

  mergingTwoArrays(left: numberArray, right: numberArray): numberArray {
    let sorted: numberArray = [];

    while (left.length && right.length) {
      // orderBy is a user input if the user wants the array to be ascending or descending

      if (this.orderBy === DecendingOrder) {
        if (left[0]! >= right[0]!) {
          sorted.push(left.shift()!);
        } else {
          sorted.push(right.shift()!);
        }
      } else {
        if (left[0]! <= right[0]!) {
          sorted.push(left.shift()!);
        } else {
          sorted.push(right.shift()!);
        }
      }
    }
    // console.log({ left, right, sorted });

    return [...sorted, ...left, ...right];
  }
}

class Input extends Sort {
  getSortedList(list: numberArray) {
    return this.sortAlgoMergeSort(list);
  }
}

//function for adding +ve integers in input

function addNumberToInput(numberLength: number) {
  let randomArr = Array.from({ length: numberLength }, () =>
    Math.ceil(Math.random() * 100)
  );
  console.log({ randomArr });

  fs.writeFileSync(path.join(__dirname, "input.txt"), randomArr.join(", "));
}

function main() {
  //function for adding integers
  addNumberToInput(1000);

  const file = fs.readFileSync(path.join(__dirname, "input.txt"), "utf-8");
  const [list] = file.split("\n");

  const newList = list.split(", ").map(Number);
  console.log({ list, newList });

  // i have used readline lib to get input from user that if user wants ascending or descending order
  rl.setPrompt(
    "Type asc for Ascending order and desc for Descending order output : "
  );
  rl.prompt();

  let errorExist = false,
    timeForSort = 0;

  rl.on("line", function (input) {
    const inputNew = new Input(input);

    if (!list || newList?.some((item) => isNaN(Number(item)))) {
      console.log("hello");

      errorExist = true;
      rl.close();
    } else {
      if (input === DecendingOrder || input === AscendingOrder) {
        let startTime = Date.now();
        let sorted = inputNew.getSortedList(newList);
        timeForSort = Date.now() - startTime;

        fs.writeFileSync(
          path.join(__dirname, "output.txt"),
          sorted?.join(", ").toString()
        );

        rl.close();
      } else {
        rl.prompt();
      }
    }
  }).on("close", function () {
    if (errorExist) {
      console.log("Input file should be valid i.e:'1, 2, ' format");
    } else {
      console.log(
        `*********************Sorted in ${timeForSort} ms *************************`
      );
    }
    process.exit(0);
  });
}
main();
