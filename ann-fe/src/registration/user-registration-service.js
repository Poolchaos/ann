import {inject, Factory, LogManager} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
/*
 * */
import {CommandFactory} from 'zailab.common';
/*
 * */
const logger = LogManager.getLogger('UserRegistrationService');
/*
 * */
@inject(Factory.of(CommandFactory), HttpClient)
export default class {

  constructor(commandFactory, httpClient) {
    this.commandFactory = commandFactory;
    this.httpClient = httpClient;
  }

  registerOrganisation(organisation) {
    return new Promise((resolve, reject) => {
      this.httpClient.createRequest('v1/user/organisation-registrations')
        .asPost()
        .withContent({
          organisationRegistrationId: organisation.organisationRegistrationId,
          organisationName: organisation.organisationName,
          creator: organisation.creator,
          initialAgentEmail: organisation.initialAgentEmail,
          country: organisation.country,
          timezone: organisation.timezone
        })
        .send()
        .then(
          (response) => {
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
    });

  }

  retrieveInvitations(organisationId) {

    return new Promise((resolve, reject) => {
      this.httpClient.createRequest('v1/user/invitations/pending')
        .asGet()
        .withParams({organisationId: organisationId})
        .send()
        .then(
          (response) => {
            resolve(this._modelPendingInvitations(response));
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  retrieveConfiguredCountries() {
    return new Promise((resolve, reject) => {
      this.httpClient.createRequest('v1/configuration/configuration/countries')
        .asGet()
        .send()
        .then(
          (response) => {
            resolve(this._modelCountries(response));
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  _modelCountries(data) {
    let countries = [];

    if (data && data.countries)
      data.countries.forEach(country => {
        countries.push(country.shortCode.toLowerCase());
      });
    return countries;
  }

  _modelPendingInvitations(data) {
    let invites = [];

    if (data && data.invitations)
      data.invitations.forEach(_invite => {
        invites.push(_invite);
      });
    return invites;
  }
}