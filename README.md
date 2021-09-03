# Test Runner

Test Runner (`test-runner`) is a command-line tool to test a code file against stdin/stdout test cases written in a single, easy to read and write test cases file (`spec.inout`).

## CLI abbreviated API

```txt
Usage: test-runner [options] [dir]
```

Use `--help` to get a more thorough help message.

## Coding exercise project structure

Test Runner works on a directory like `exercise-name`, as shown below. A `Solution` file in a [supported language](#supported-languages) is required, as well as a [valid `spec.inout`](#test-cases-file-specinout) file. A `README.md` is the recommended way to explain what the exercise is about, although is not required by the CLI.

```txt
.
└── exercise-name
    ├── README.md (optional)
    ├── Solution.java
    └── spec.inout
```

## Test cases file (`spec.inout`)

`spec.inout` is the file where test cases are defined. A single test case has the following structure:

```txt
//
The data for the test case is placed between two
double slashes (//). This is provided to the Solution
file as standard input. Multi-line input is supported.
//
$$
The expected output from the Solution file is
placed between double dollar symbols ($$). This
should be the standard output of the Solution.
Multi-line output is supported.
$$
```

The file `spec.inout` can contain as many of these `//in//$$out$$` pairs as required test cases.

## Supported languages

Currently: Java, Python, C and C++.

Supporting a new language requires the following changes:

- Update [run](./src/run) to add the required commands.
- Update [cli.js](./src/cli.js) to mention the new supported language in the help message of the CLI.

## Development

### Requirements

- Node.js

When using Windows, use GitBash, not CMD.

### Sample `Solution` and `spec.inout` files

### `Solution.java`

```java
import java.util.Scanner;

public class Solution {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);

    while (scanner.hasNextLine()) {
      String line = scanner.nextLine();
      System.out.println(isPalindrome(line));
    }

    scanner.close();
  }

  public static String isPalindrome(String phrase) {
    String originalNoSpaces = phrase.replaceAll("\\s", "");
    String reversedNoSpaces = new StringBuilder(phrase)
        .reverse().toString().replaceAll("\\s", "");

    return originalNoSpaces.equalsIgnoreCase(reversedNoSpaces)
        ? "yes" : "no";
  }
}
```

### `spec.inout`

```txt
//
Amor a Roma
//
$$
yes
$$

//
Amor a Roma
Salida a la casa
Anita lava la tina
//
$$
yes
no
yes
$$
```