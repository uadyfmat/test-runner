#include <algorithm>
#include <cctype>
#include <iostream>
#include <string>

using namespace std;

string isPalindrome(string phrase)
{
  string originalLowercaseNoSpaces = phrase;
  string reversedOriginalLowercaseNoSpaces = phrase;

  transform(originalLowercaseNoSpaces.begin(), originalLowercaseNoSpaces.end(), originalLowercaseNoSpaces.begin(),
            [](unsigned char c)
            { return tolower(c); });
  originalLowercaseNoSpaces.erase(remove_if(originalLowercaseNoSpaces.begin(), originalLowercaseNoSpaces.end(), ::isspace), originalLowercaseNoSpaces.end());

  transform(reversedOriginalLowercaseNoSpaces.begin(), reversedOriginalLowercaseNoSpaces.end(), reversedOriginalLowercaseNoSpaces.begin(),
            [](unsigned char c)
            { return tolower(c); });
  reversedOriginalLowercaseNoSpaces.erase(remove_if(reversedOriginalLowercaseNoSpaces.begin(), reversedOriginalLowercaseNoSpaces.end(), ::isspace), reversedOriginalLowercaseNoSpaces.end());
  reverse(reversedOriginalLowercaseNoSpaces.begin(), reversedOriginalLowercaseNoSpaces.end());

  cout << originalLowercaseNoSpaces << "\n";
  cout << reversedOriginalLowercaseNoSpaces << "\n";

  return originalLowercaseNoSpaces.compare(reversedOriginalLowercaseNoSpaces) == 0 ? "yes" : "no";
}

int main()
{
  cout << isPalindrome("Anita lava la tina");
  return 0;
}