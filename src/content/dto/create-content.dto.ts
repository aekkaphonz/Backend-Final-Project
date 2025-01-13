import { IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateContentDto {

     
        readonly   userId?: Types.ObjectId;
 
    readonly title: string;
    readonly detail: string;
    readonly description: string;
    readonly image :string

}

 
  