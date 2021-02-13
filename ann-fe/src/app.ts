import { HttpClient } from 'aurelia-http-client';
import { autoinject } from 'aurelia-framework';

@autoinject()
export class App {
  public message = 'Hello World!';

  constructor(private httpClient: HttpClient) {}

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
