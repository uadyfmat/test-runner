#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include <stdlib.h>

char *toLowercase(char phrase[])
{
  int phraseLength = strlen(phrase);
  char *lowercasePhrase = malloc(sizeof(char) * (phraseLength + 1));

  for (int i = 0; i < phraseLength; i++)
  {
    lowercasePhrase[i] = tolower(phrase[i]);
  }

  lowercasePhrase[phraseLength] = '\0';

  return lowercasePhrase;
}

char *removeWhitespace(char phrase[])
{
  int phraseLength = strlen(phrase);
  char *noWhitespacePhrase = malloc(sizeof(char) * (phraseLength + 1));
  int noWhitespacePhraseIndex = 0;

  for (int i = 0; i < phraseLength; i++)
  {
    if (phrase[i] != ' ')
    {
      noWhitespacePhrase[noWhitespacePhraseIndex++] = phrase[i];
    }
  }

  noWhitespacePhrase[noWhitespacePhraseIndex] = '\0';

  return noWhitespacePhrase;
}

char *isPalindrome(char phrase[])
{
  char *isPalindrome = malloc(sizeof(char) * 3);

  char *originalLowercaseNoSpaces = removeWhitespace(toLowercase(phrase));
  char *reversedOriginalLowercaseNoSpaces = malloc(sizeof(char) * strlen(originalLowercaseNoSpaces));

  strcpy(reversedOriginalLowercaseNoSpaces, originalLowercaseNoSpaces);
  strrev(reversedOriginalLowercaseNoSpaces);

  int comparison = strcmp(originalLowercaseNoSpaces, reversedOriginalLowercaseNoSpaces);

  if (comparison == 0)
  {
    strcpy(isPalindrome, "yes");
  }
  else
  {
    strcpy(isPalindrome, "no");
  }

  free(originalLowercaseNoSpaces);
  free(reversedOriginalLowercaseNoSpaces);

  return isPalindrome;
}

char *readLineStdin(int maxSize)
{
  char *line = malloc(maxSize);
  fgets(line, maxSize, stdin);

  // Remove ending new line, if any
  if ((strlen(line) > 0) && (line[strlen(line) - 1] == '\n'))
    line[strlen(line) - 1] = '\0';

  return line;
}

int readIntStdin()
{
  int number;
  int bytesForLine = 32;

  char *line = malloc(bytesForLine);
  fgets(line, bytesForLine, stdin);
  sscanf(line, "%d", &number);

  free(line);

  return number;
}

int main(void)
{
  // char *result0 = toLowercase("HELLO");
  // printf("%s\n", result0);

  // char *result1 = removeWhitespace("HE LL O");
  // printf("%s\n", result1);

  // free(result0);
  // free(result1);

  // char *isIt = isPalindrome("Anita lava la tina");
  // printf("%s\n", isIt);

  // isIt = isPalindrome("La casa grande");
  // printf("%s\n", isIt);

  // isIt = isPalindrome("Amor a Roma");
  // printf("%s\n", isIt);

  // free(isIt);

  // int numberOfTestCases;
  // scanf("%d", &numberOfTestCases);

  // printf("%d\n", numberOfTestCases);

  // READ WITH gets()
  // char line[100];
  // char *readLine;

  // readLine = gets(line);
  // printf("%s\n", readLine);

  // free(readLine);

  int numberOfTestCases = readIntStdin();

  printf("%d\n", numberOfTestCases);

  char *line;

  line = readLineStdin(256);

  printf("%s\n", line);

  line = readLineStdin(256);

  printf("%s\n", line);

  return 0;
}