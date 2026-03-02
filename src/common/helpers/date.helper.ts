export class DateTimeHelper {
  private static readonly MIN_DATE = new Date('1970-01-01T00:00:00Z');
  private static readonly MAX_DATE = new Date('2099-12-31T23:59:59Z');

  public static now(): Date {
    return new Date();
  }

  public static minDate(): Date {
    return new Date(this.MIN_DATE);
  }

  public static maxDate(): Date {
    return new Date(this.MAX_DATE);
  }
}
