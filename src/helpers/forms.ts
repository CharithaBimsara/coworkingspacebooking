// src/helpers/forms.ts
import { SignInRequestDto, SignUpRequestDto } from '../dto/request';

export class SignInForm {
  email: string;
  password: string;

  constructor(email: string = '', password: string = '') {
    this.email = email;
    this.password = password;
  }

  reset(): void {
    this.email = '';
    this.password = '';
  }

  isValid(): boolean {
    return this.email.trim() !== '' && this.password.trim() !== '';
  }

  toDto(): SignInRequestDto {
    return new SignInRequestDto(this.email, this.password);
  }
}

export class SignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;

  constructor(
    firstName: string = '',
    lastName: string = '',
    email: string = '',
    password: string = '',
    confirmPassword: string = '',
    agreeToTerms: boolean = false
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.agreeToTerms = agreeToTerms;
  }

  reset(): void {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.agreeToTerms = false;
  }

  isValid(): boolean {
    return (
      this.firstName.trim() !== '' &&
      this.lastName.trim() !== '' &&
      this.email.trim() !== '' &&
      this.password.trim() !== '' &&
      this.confirmPassword.trim() !== '' &&
      this.agreeToTerms
    );
  }

  passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }

  toDto(): SignUpRequestDto {
    return new SignUpRequestDto(
      this.firstName,
      this.lastName,
      this.email,
      this.password,
      this.confirmPassword
    );
  }
}