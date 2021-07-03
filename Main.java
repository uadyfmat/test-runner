import java.util.Scanner;

public class Main {

  /**
   * Returns "yes" if the phrase is a palindrome, "no" otherwise.
   * 
   * @param phrase to test if it is a palindrome.
   * @return "yes" or "no".
   */
  public static String isPalindrome(String phrase) {
    // Your solution here
    return "yes";
  }

  // You don't require to modify this method.
  public static void main(String... args) {
    Scanner scanner = new Scanner(System.in);
    System.out.println(isPalindrome(scanner.nextLine()));
    scanner.close();
  }
}