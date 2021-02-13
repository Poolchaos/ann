import { HttpClient } from 'aurelia-http-client';
import { autoinject } from 'aurelia-framework';
import { UserRegistrationSettings } from 'registration/user-registration-settings';

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

  public register(): void {
    
    var user = {
      firstName: "phillip-juan",
      surname: "van der Berg",
      email: "bt1phillip@gmail.com",
      contactNumbers: ["0712569431"]
    };

    this.httpClient.createRequest('http://localhost:3000/passport/user-registration/submit')
      .asPost()
      .withContent(user)
      .withHeader('Content-Type', 'application/json')
      .withHeader('Authorization', UserRegistrationSettings.ANONYMOUS_TOKEN)
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
