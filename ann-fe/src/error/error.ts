export class Error {
  
  private code: number;
  
  public activate(params: { code: number }): void {
    this.code = params.code;
  }
  
  public back(): void {
    window.history.go(-1 * this.code);
  }
}