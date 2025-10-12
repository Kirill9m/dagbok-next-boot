package cloud.dagbok.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloWorldController {
  /**
   * Provides a simple greeting message for the /hello endpoint.
   *
   * @return the string "Hello World"
   */
  @GetMapping("/hello")
  public String helloWorld() {
    return "Hello World!";
  }
}