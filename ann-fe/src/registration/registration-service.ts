import {autoinject, LogManager} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';

import { UserRegistrationSettings } from './user-registration-settings';
import { EncryptService } from '../services/encrypt-service';

const logger = LogManager.getLogger('RegistrationService'); // todo: add logger in all ts files

@autoinject()
export class RegistrationService {

  private route = 'passport';

  constructor(private httpClient: HttpClient) {}

  public registerUser(
    firstName: string,
    surname: string,
    email: string,
    number: string,
    role: string
  ): Promise<void> {
    return new Promise(resolve => {
      this.httpClient.createRequest(this.route + '/submit')
        .asPost()
        .withContent({ firstName, surname, email, number, role })
        .withHeader('Content-Type', 'application/json')
        .withHeader('Authorization', UserRegistrationSettings.ANONYMOUS_TOKEN)
        .send()
        .then((response) => {
          //@ts-ignore
          resolve(response);
        })
        .catch((error) => {
          console.warn(' ::>> error ', error);
        });
    })
  }

  public completeRegistration(token: string, password: string): Promise<void> {

    const encryptedPassword = EncryptService.encrypt(password);

    return new Promise(resolve => {
      this.httpClient.createRequest(this.route + '/complete-registration')
        .asPost()
        .withContent({
          password: encryptedPassword
        })
        .withHeader('Content-Type', 'application/json')
        .withHeader('Authorization', `Bearer ${token}`)
        .send()
        .then(
          (response) => {
            console.log(' ::>> response ', response);
            resolve();
          },
          (error) => {
            console.warn(' ::>> error ', error);
          }
        );
    });
  }
}
