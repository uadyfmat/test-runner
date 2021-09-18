def isPalindrome(phrase):
    originalLowercaseNoSpaces = phrase.lower().replace(" ", "")
    reversedOriginalLowercaseNoSpaces = phrase.lower().replace(" ", "")[::-1]

    return "yes" if originalLowercaseNoSpaces == reversedOriginalLowercaseNoSpaces else "no"


def main():
    numberOfTestCases = int(input())

    for i in range(numberOfTestCases):
        line = input()
        print(isPalindrome(line))


main()
