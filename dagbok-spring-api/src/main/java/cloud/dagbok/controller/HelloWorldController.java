package cloud.dagbok.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloWorldController {
  /**
   * Responds to GET requests at the root path with a greeting message.
   *
   * @return the response body string "Hello World"
   */
  @GetMapping("/")
  public String helloWorld() {
    return "Hello World";
  }
}