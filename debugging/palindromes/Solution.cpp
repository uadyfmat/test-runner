#include <algorithm>
#include <cctype>
#include <iostream>
#include <string>

using namespace std;

string toLowercase(string phrase)
{
  string output = phrase;

  // From: https://stackoverflow.com/a/313990/12591546
  transform(output.begin(), output.end(), output.begin(),
            [](unsigned char c)
            { return tolower(c); });

  return output;
}

string removeWhitespace(string phrase)
{
  string output = phrase;

  // From: https://stackoverflow.com/a/83538/12591546
  output.erase(remove_if(output.begin(), output.end(), ::isspace), output.end());

  return output;
}

string reverseString(string phrase)
{
  string output = phrase;
  reverse(output.begin(), output.end());
  return output;
}

string isPalindrome(string phrase)
{
  string originalLowercaseNoSpaces = removeWhitespace(toLowercase(phrase));
  string reversedOriginalLowercaseNoSpaces = reverseString(removeWhitespace(toLowercase(phrase)));

  return originalLowercaseNoSpaces.compare(reversedOriginalLowercaseNoSpaces) == 0 ? "yes" : "no";
}

int main()
{
  cout << isPalindrome("Anita lava la tina");
  return 0;
}