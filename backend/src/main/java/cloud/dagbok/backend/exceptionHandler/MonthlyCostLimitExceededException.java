package cloud.dagbok.backend.exceptionHandler;

public class MonthlyCostLimitExceededException extends RuntimeException {
  private final Double currentCost;
  private final Double limit = 0.1;

  public MonthlyCostLimitExceededException(Double currentCost) {
    super(String.format("Monthly cost limit of $0.10 exceeded. Current: $%.4f", currentCost));
    this.currentCost = currentCost;
  }

  public Double getCurrentCost() {
    return currentCost;
  }

  public Double getLimit() {
    return limit;
  }
}
