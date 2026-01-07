package cloud.dagbok.backend.exceptionHandler;

public record ErrorResponseLimit(
    String message, Double currentCost, Double limit, String errorCode) {}
