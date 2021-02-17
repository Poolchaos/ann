import {Aurelia, FrameworkConfiguration, LogManager, Container} from 'aurelia-framework';
import { AureliaConfiguration } from 'aurelia-configuration';
import { HttpClient, HttpRequestMessage, HttpResponseMessage, RequestBuilder, RequestMessage } from 'aurelia-http-client';
import { DataStore } from 'stores/data-store';

const logger = LogManager.getLogger('HttpInterceptor');
const codes: Array<number> = [500, 501, 502, 503, 504];

let configure = Container.instance.get(AureliaConfiguration);
const environment = configure.get('environment');

console.log(' ::>> environment >>>> ', environment);

export default class HttpInterceptor {

  private retryInstances = {};
  private environment: string = '';

  constructor(private httpClient: HttpClient, private dataStore: DataStore) {}

  public request(message: IHttpRequestMessage): IHttpRequestMessage {
    return message;
  }

  public requestError(error: HttpResponseMessage): HttpResponseMessage {
    throw error;
  }

  public response(message: IHttpRequestMessage): IHttpRequestMessage {
    if (canIgnoreMessageStructure(message)) {
      return message;
    }

    let msg = parseMessage(message);
    let formattedResponse = msg._embedded || msg;

    if (msg instanceof Object && msg.page) {
      formattedResponse.page = msg.page;
    }
    return formattedResponse;
  }

  public responseError(error: HttpResponseMessage): any {
    const requestMessage = error.requestMessage;

    const url = requestMessage.url.includes(requestMessage.baseUrl) ? requestMessage.url : requestMessage.baseUrl + requestMessage.url;

    return new Promise((resolve, reject) => {

      const statusCode = error.statusCode;

      if (!isRetryStatus(statusCode) || !this.dataStore.user) {
        reject(error);
        return;
      }

      if (this.retryInstances[url]) {
        if ((environment !== 'prod' || environment !== 'staging') && this.retryInstances[url].retryCount === 1) {
          reject(error);
          return;
        }
        if (this.retryInstances[url].retryCount === 6) {
          reject(error);
          return;
        }
        this.retryInstances[url].retryCount++;
      } else {
        this.retryInstances[url] = { retryCount: 0 };
      }

      const requestMessage: RequestMessage = error.requestMessage;
      let request = this.newRequest(url);
      let content = typeof requestMessage.content === 'string' ? JSON.parse(requestMessage.content) : requestMessage.content;

      // @ts-ignore
      console.log(' ::>> requestMessage.params >>>> ', requestMessage.params);
      // @ts-ignore
      request = this.setMethod(request, requestMessage.method, content, requestMessage.params);

      const delay = Math.pow(2, this.retryInstances[url].retryCount) * 1000;

      setTimeout(() => {
        this.retryRequest(request, resolve, url);
      }, delay);
    });
  }

  private newRequest(url: string): RequestBuilder {
    return this.httpClient.createRequest(url);
  }

  private setMethod(request: RequestBuilder, method: string, content: string, params: any): RequestBuilder {

    if (method === 'PUT') {
      request = request.asPut().withContent(content);
    } else if (method === 'POST') {
      request = request.asPost().withContent(content);
    } else if (method === 'GET') {
      request = request.asGet().withParams(params);
    }
    return request;
  }

  private retryRequest(request: RequestBuilder, resolve: (data: any) => void, url: string): void {
    request.send()
      .then((response) => {
        delete this.retryInstances[url];
        resolve(response);
      })
      .catch((error) => { });
  }
}

const canIgnoreMessageStructure = (message: IHttpRequestMessage): boolean => {
  if (!message.response && message.response !== '') {
    return true;
  }
  if (message.responseType === 'application/zip') {
    return true;
  }
  return false;
};

const parseMessage = (message: IHttpRequestMessage): any => {
  try {
    return typeof message.response === 'string' ? JSON.parse(message.response) : message.response;
  } catch (e) {
    return message.response;
  }
}

const isRetryStatus = (statusCode: number): boolean => {
  // @ts-ignore
  return codes.includes(statusCode);
}

interface IHttpRequestMessage {
  headers: Headers;
  isSuccess: boolean;
  mimeType: string;
  requestMessage: HttpRequestMessage;
  response: string;
  responseType: string;
  reviver: any; // HttpReviver
  statusCode: number;
  statusText: string;
  content: any;
}
