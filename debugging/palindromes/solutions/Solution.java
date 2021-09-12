import java.util.Scanner;

public class Solution {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);

    int lines = scanner.nextInt();
    scanner.nextLine();

    for (int i = 0; i < lines; i++) {
      String line = scanner.nextLine();
      System.out.println(isPalindrome(line));
    }

    scanner.close();
  }

  public static String isPalindrome(String phrase) {
    String originalNoSpaces = phrase.replaceAll("\\s", "");
    String reversedNoSpaces = new StringBuilder(phrase).reverse().toString().replaceAll("\\s", "");

    return originalNoSpaces.equalsIgnoreCase(reversedNoSpaces) ? "yes" : "no";
  }
}