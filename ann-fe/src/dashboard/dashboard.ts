import { autoinject } from 'aurelia-framework';
import { HttpClient } from "aurelia-http-client";

@autoinject()
export class Dashboard {
  constructor(
    private httpClient: HttpClient
  ) {
    console.log(' ::>> Dashboard ');
  }

  public activate(): void {
    this.retrieveUsers();
  }

  public saveUser(): void {
    this.httpClient.createRequest('http://localhost:3000/users')
      .asPost()
      .withContent({  })
      .send()
      .then(
        (response) => {
          console.log(' ::>> response ', response);
        },
        (error) => {
          console.warn(' ::>> error ', error);
        }
      );
  }

  private retrieveUsers(): void {
    this.httpClient.createRequest('http://localhost:3000/users')
      .asGet()
      .withParams({})
      .send()
      .then(
        (response) => {
          console.log(' ::>> response ', response);
        },
        (error) => {
          console.warn(' ::>> error ', error);
        }
      );
  }
}