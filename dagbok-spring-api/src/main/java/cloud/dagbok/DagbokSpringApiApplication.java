package cloud.dagbok;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DagbokSpringApiApplication {
  /**
   * Bootstraps and launches the Spring Boot application.
   *
   * @param args command-line arguments passed to the application
   */
  public static void main(String[] args) {
    SpringApplication.run(DagbokSpringApiApplication.class, args);
  }
}