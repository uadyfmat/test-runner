import java.util.Scanner;

public class Echo {
  public static void main(String[] args) {
  Scanner scanner = new Scanner(System.in);

  while (scanner.hasNextLine()) {
  System.out.println("READ: " + scanner.nextLine());
  }

  scanner.close();
  }
}
