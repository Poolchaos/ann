export class Sort {

  public static alphabetically(list: any[]): any[] {
    return list.sort((a, b) => (a.color > b.color) ? 1 : -1);
  }
}

