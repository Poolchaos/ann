import { autoinject } from 'aurelia-framework';
import {
  ValidationControllerFactory,
  ValidationController,
  validateTrigger
} from 'aurelia-validation';
import { Router } from 'aurelia-router';

import { ArticleService } from '../articles-service';

@autoinject()
export class CreateArticle {

  public title: string;
  public category: string;
  public submitted: boolean = false;
  private fileContents = [];
  
  private validation: ValidationController;

  constructor(
    private articleService: ArticleService,
    private router: Router,
    validationControllerFactory: ValidationControllerFactory
  ) {
    this.validation = validationControllerFactory.createForCurrentScope();
    this.validation.validateTrigger = validateTrigger.change;
  }

  public uploadFlow(event: Event): void {
    this.fileContents = [];
    // @ts-ignore
    const files = event.target.files;
    if (files.length > 0) {

      files.forEach(file => {
        
        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (evt: any) => {
          try {
            this.fileContents.push(evt.target.result);
          } catch(e) {
            console.warn('Failed to parse uploaded file ', evt);
          }
        }
        reader.onerror = (evt: any) =>  {
            console.warn('Failed to upload file ', evt);
        }
      });
    }
  }
  
  public createArticle(): void {
    let element: any = document.querySelector('#x');
    let content = element.value;

    // todo: validate

    if (content) {
      const messageContent = content.replace(/<div>|<\/div>/gi, '');
      const payload = {
        title: this.title,
        category: this.category,
        content: messageContent,
        files: this.fileContents
      };

      console.log(' ::>> payload >>> ', payload);
      this.articleService
        .createArticle(
          this.title,
          this.category,
          messageContent,
          this.fileContents
        )
        .then(() => {
          console.log(' ::>> article created >>>> ');
          this.router.navigate('articles');
        })
        .catch(error => {
          console.log(' ::>> failed to create article >>>> ');
        });
    }
  }
}