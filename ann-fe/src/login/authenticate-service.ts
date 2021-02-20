import { autoinject } from 'aurelia-framework';
import { HttpClient, HttpResponseMessage } from 'aurelia-http-client';

import { UserRegistrationSettings } from 'registration/user-registration-settings';
import { EncryptService } from 'services/encrypt-service';
import { IUser } from 'stores/data-store';

@autoinject()
export class AuthenticateService {

  constructor(private httpClient: HttpClient) {}

  public authenticate(email: string, password: string): Promise<any> {

    const encryptedPassword = EncryptService.encrypt(password);

    return new Promise(resolve => {
      this.httpClient.createRequest('passport/authenticate')
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
            // @ts-ignore
            const user: IUser = response;
            this.setHeader(user.token);
            resolve(user);
          },
          (error) => {
            console.warn(' ::>> error ', error);
          }
        );
    });
  }
  
  public authenticateWithToken(): Promise<any> {

    return new Promise((resolve, reject) => {
      this.httpClient.createRequest('passport/authenticate-token')
        .asPost()
        .withContent({})
        .send()
        .then(resolve)
        .catch(reject);
    });
  }

  public requestPasswordReset(email: string): Promise<void> {
    
    return new Promise((resolve, reject) => {
      this.httpClient.createRequest('passport/reset-password')
        .withHeader('Authorization', UserRegistrationSettings.ANONYMOUS_TOKEN)
        .asPost()
        .withContent({ email })
        .send()
        .then(() => {
          console.log(' VALID ::>> is valid user ');
        })
        .catch(error => {
          console.log(' VALID ::>> invalid user ');
          reject(error);
        });
    });
  }

  public validateToken(token: string): Promise<any> {
    
    return this.httpClient.createRequest('passport/token')
      .withHeader('Authorization', UserRegistrationSettings.ANONYMOUS_TOKEN)
      .asPost()
      .withContent({ token })
      .send();
  }

  public resetPassword(token: string, password: string): Promise<any> {

    const encryptedPassword = EncryptService.encrypt(password);

    return this.httpClient
      .createRequest('passport/reset-password')
      .asPut()
      .withContent({
        password: encryptedPassword
      })
      .withHeader('Content-Type', 'application/json')
      .withHeader('Authorization', `Bearer ${token}`)
      .send();
  }

  public setHeader(token: string): void {
    this.httpClient.configure(req => {
      req.withHeader('Content-Type', 'application/json');
      req.withHeader('Authorization', 'Bearer ' + token);
    });
  }

  public logout(): void {
    this.httpClient.configure(req => {
      req.withHeader('Authorization', UserRegistrationSettings.ANONYMOUS_TOKEN);
    });
  }

}
