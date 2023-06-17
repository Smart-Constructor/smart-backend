import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from "class-validator";
import { IsCPF } from "class-validator-cpf";

export class AuhtDtoSignup {
  @IsEmail()
   @IsNotEmpty()
  email: string;

  @IsCPF()
   @IsNotEmpty()
  cpf: string;

  @IsString()
   @IsNotEmpty()
   @IsStrongPassword()
  password: string;
}

export class AuhtDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
