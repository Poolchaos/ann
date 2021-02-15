import { autoinject } from 'aurelia-framework';
import { DialogController } from "aurelia-dialog";

import { IUser } from "stores/data-store";

@autoinject()
export class RemoveUserDialog {

  public user: IUser;

  constructor(private dialogController: DialogController) {}
  
  public activate(user: IUser){
    this.user = user;
  }

  public confirm(): void {
    this.dialogController.ok();
  }

  public cancel(): void {
    this.dialogController.cancel();
  }
}