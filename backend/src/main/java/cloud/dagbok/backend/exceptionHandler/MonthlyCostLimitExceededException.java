package cloud.dagbok.backend.exceptionHandler;

public class MonthlyCostLimitExceededException extends RuntimeException {
  private final Double currentCost;
  private static final Double LIMIT = 0.01;

  public MonthlyCostLimitExceededException(Double currentCost) {
    super(
        String.format("Monthly cost limit of $%.2f exceeded. Current: $%.4f", LIMIT, currentCost));
    this.currentCost = currentCost;
  }

  public Double getCurrentCost() {
    return currentCost;
  }

  public Double getLimit() {
    return LIMIT;
  }
}
