export class Sort {

  public static alphabetically(list: any[], key: string): any[] {
    return list.sort((a, b) => (a[key] > b[key]) ? 1 : -1);
  }
}

