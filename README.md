# Test Runner

Test Runner (`test-runner`) is a command-line tool to test a code file against stdin/stdout test cases written in a single, easy to read and write test cases file (`spec.inout`).

## Installation and usage

Install using the following command:

```txt
npm i -g uadyfmat/test-runner
```

The general API of the CLI is the following:

```txt
Usage: test-runner [options] [dir]
```

Use `--help` to get a more thorough help message.

`[dir]` expects a [valid coding exercise project structure](#coding-exercise-project-structure).

**Notice that you must separately install the language-specific compiler or interpreter for your language of choice.** For instance, when working with Java, make sure that the commands `javac` and `java` are available in the terminal.

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
- Update [config.js](./src/config.js) to add the new supported language extension.

## Development

### Requirements

- Node.js

When using Windows, use GitBash, not CMD.

### Code guidelines

Two types of JavaScript files are used:

1. 'Class-like', where each file defines a constructor function and methods attached to the constructed object. This is similar to Java's idea of 1 class per file. Here, the constructor function is the first line after imports, then prototype attachments follow, then private functions and finally the export of the constructor.
2. 'Free-form', where the file has a config object, does some imports, or performs or is something else which would not benefit from a constructor function.

Naming conventions:

- JS file type #1: Use `PascalCase` for the file name, equal to the name of the constructor function.
- JS file type #2: Use `camelCase` for the file name, whatever makes sense.

Order of imports:

1. Local imports
2. Node.js imports
3. Third-party imports

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