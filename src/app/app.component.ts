import { Component } from '@angular/core';
import { stringify } from 'querystring';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {

  constructor() {
    this.reset();
  }

  // Static Members
  static useLetters = 'Use Letters';
  static useNumbers = 'Use Numbers';
  static useSymbols = 'Use Symbols';

  static minLength = 6;
  static maxLength = 32;


  static defaultOptions = {
    [AppComponent.useLetters]: true,
    [AppComponent.useNumbers]: true,
    [AppComponent.useSymbols]: true,
  };

  static contributors = [
    {
      name: AppComponent.useLetters, method: () => AppComponent.pickRandom('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
    },
    {
      name: AppComponent.useNumbers, method: () => AppComponent.pickRandom('0123456789')
    },
    {
      name: AppComponent.useSymbols, method: () => AppComponent.pickRandom('!@#$%^*()')
    }
  ];
  
  // Static Methods //////////////////////

  static pickRandom(charset: string) {
  // Pick a random character from a string.
    return charset.charAt(Math.floor(Math.random() * charset.length));
  }
   
  static contributorReducer (acc: string, curr: { method: () => string; }) {
  // If the character doesn't have a value yet, set one.
  // Otherwise, maybe overwrite it.
    return (!acc || Math.random() > 0.5) ? curr.method() : acc;
  }

  // Instance Members ///////////////////
  password : string;
  passwordLength : number;
  options : {};

  // Instance Methods ////////////////////

  setOption(option: string) {
  // Toggle checkbox options on or off.
    this.options[option] = !this.options[option];
  }

  onSubmit() {
  // Filter out the password character contributors
  // based on selected options. Build a string of the 
  // requested length out of enabled character set.
    const enabledContributors = AppComponent.contributors.filter(c => this.options[c.name]);

    this.password = new Array(this.passwordLength)
      .fill(undefined)
      .map(each => enabledContributors.reduce(AppComponent.contributorReducer, each))
      .join('');
  }

  onCopy() {
  // Send the generated password to the clipboard
  // Don't write if empty (overwriting previously-generated password).
    if (this.password) {
      navigator.clipboard.writeText(this.password);
    }
  }

  get FormNotValid() {
  // Validate entries
    return !(this.validOptions() && this.validLength());
  }

  validOptions() {
  // At least one option must be selected
    for (let opt in this.options) {
      if (this.options[opt]) {
        return true;
      }
    }

    return false;
  }

  validLength () {
  // Password can't be empty or too long.
    return (this.passwordLength >= AppComponent.minLength) 
        && (this.passwordLength <= AppComponent.maxLength)
  }

  getClipboardClass() {
  // Don't show the copy to clipboard button if 
  // we don't have a password to copy.
    return (this.password) ? '' : 'hidden';
  }

  reset() {
  // Set form back to original state.
    this.password = '';
    this.passwordLength = AppComponent.minLength;
    this.options = { ... AppComponent.defaultOptions };
  }

  get MinLength() {
    return AppComponent.minLength;
  }

  get MaxLength() {
    return AppComponent.maxLength;
  }

}
