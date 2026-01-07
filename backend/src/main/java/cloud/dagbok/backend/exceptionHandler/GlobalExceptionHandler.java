package cloud.dagbok.backend.exceptionHandler;

import cloud.dagbok.backend.dto.ErrorResponse;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(EntityNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleEntityNotFoundException(EntityNotFoundException ex) {
    final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    log.error("Handling EntityNotFoundException: {}", ex.getMessage());

    ErrorResponse errorResponse = new ErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND.value());

    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
  }

  @ExceptionHandler(SecurityException.class)
  public ResponseEntity<ErrorResponse> handleSecurityException(
      SecurityException ex, HttpServletRequest request) {
    final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    String bearer = request.getHeader("X-API-KEY");
    log.error("Handling SecurityException for API key: {}. Message: {}", bearer, ex.getMessage());

    ErrorResponse errorResponse =
        new ErrorResponse("API key not valid for this user", HttpStatus.FORBIDDEN.value());
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
  }

  @ExceptionHandler(ConflictException.class)
  public ResponseEntity<ErrorResponse> handleExists(ConflictException ex) {
    ErrorResponse errorResponse = new ErrorResponse(ex.getMessage(), HttpStatus.CONFLICT.value());
    return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
    ErrorResponse errorResponse =
        new ErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST.value());
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
  }

  @ExceptionHandler(MonthlyCostLimitExceededException.class)
  public ResponseEntity<ErrorResponseLimit> handleMonthlyCostLimitExceeded(
      MonthlyCostLimitExceededException e) {

    ErrorResponseLimit error =
        new ErrorResponseLimit(
            e.getMessage(), e.getCurrentCost(), e.getLimit(), "MONTHLY_COST_LIMIT_EXCEEDED");

    return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED) // 402
        .body(error);
  }
}
