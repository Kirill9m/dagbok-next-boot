package cloud.dagbok.backend.exceptionHandler;

public class ConflictException extends RuntimeException {

  public ConflictException(String email) {
    super(email);
  }
}
