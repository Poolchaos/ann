import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';

@autoinject()
export class ArticleService {

  constructor(private httpClient: HttpClient) {}

  public createArticle(
    name: string,
    category: string,
    content: string,
    files: string[]
  ): Promise<any> {

    return new Promise(resolve => {
      // todo: read environment from .env
      // todo: make interceptor for httpClient to map response.response
      this.httpClient.createRequest('http://localhost:3000/articles')
        .asPost()
        .withContent({ 
          name,
          category,
          content,
          files
        })
        .send()
        .then(
          (response) => {
            console.log(' ::>> created ', response);
          },
          (error) => {
            console.warn(' ::>> error ', error);
          }
        );
    });
  }
  
}
