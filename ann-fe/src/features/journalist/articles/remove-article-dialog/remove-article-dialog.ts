import { autoinject } from 'aurelia-framework';
import { DialogController } from "aurelia-dialog";

import { IUser } from "stores/data-store";

@autoinject()
export class RemoveArticleDialog {

  public article: any;// todo: implement article typings

  constructor(private dialogController: DialogController) {}
  
  public activate(article: any){
    console.log(' ::>> article >>>> ', article);
    this.article = article;
  }

  public confirm(): void {
    this.dialogController.ok();
  }

  public cancel(): void {
    this.dialogController.cancel();
  }
}