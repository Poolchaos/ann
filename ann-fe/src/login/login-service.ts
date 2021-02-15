import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';

import { UserRegistrationSettings } from 'registration/user-registration-settings';
import { EncryptService } from 'services/encrypt-service';

@autoinject()
export class LoginService {

  constructor(private httpClient: HttpClient) {}

  public authenticate(email: string, password: string): Promise<any> {

    const encryptedPassword = EncryptService.encrypt(password);

    return new Promise(resolve => {
      this.httpClient.createRequest('http://localhost:3000/passport/authenticate')
        .asPost()
        .withContent({
          email,
          password: encryptedPassword
        })
        .withHeader('Content-Type', 'application/json')
        .withHeader('Authorization', UserRegistrationSettings.ANONYMOUS_TOKEN)
        .send()
        .then(
          (response) => {
            console.log(' ::>> response ', response);
            try {
              const user = JSON.parse(response.response);
              
              this.httpClient.configure(req => {
                req.withHeader('Authorization', 'Bearer ' + user.token);
              });

              resolve(user);
            } catch(e) {
              resolve(response.response);
            }
          },
          (error) => {
            console.warn(' ::>> error ', error);
          }
        );
    });
  }

}
