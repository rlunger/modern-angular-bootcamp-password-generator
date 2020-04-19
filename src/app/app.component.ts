import { Component } from '@angular/core';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {

  ///////////////////////////////////
  // Private Members
  ///////////////////////////////////
  private useLetters = 'Use Letters';
  private useNumbers = 'Use Numbers';
  private useSymbols = 'Use Symbols';

  ///////////////////////////////////
  // Bound Members
  ///////////////////////////////////
  password = '';
  passwordLength = 8;

  options = {
    [this.useLetters]: true,
    [this.useNumbers]: true,
    [this.useSymbols]: true,
  };

  ////////////////////////////////////
  // Data Contributors
  ////////////////////////////////////
  contributors = [
    {
      name: this.useLetters, method: () => AppComponent.pickRandom('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
    },
    {
      name: this.useNumbers, method: () => AppComponent.pickRandom('0123456789')
    },
    {
      name: this.useSymbols, method: () => AppComponent.pickRandom('!@#$%^*()')
    }
  ];

  ////////////////////////////////////////////
  // Static Methods
  ////////////////////////////////////////////
  static pickRandom = (charset: string) => charset.charAt(Math.floor(Math.random() * charset.length));

  ////////////////////////////////////////////
  // Instance Methods
  ////////////////////////////////////////////
  setOption(option: string) {
    this.options[option] = !this.options[option];
  }

  onSubmit() {
    const contributorReducer = (acc: any, curr: { method: () => string; }) => {
      if (!acc || Math.random() > 0.5) {
        return curr.method();
      }

      return acc;
    };

    const enabledContributors = this.contributors.filter(contributor => this.options[contributor.name]);

    this.password = new Array(this.passwordLength)
      .fill(undefined)
      .map(each => enabledContributors.reduce(contributorReducer, each))
      .join('');
  }

  onCopy() {
    navigator.clipboard.writeText(this.getPassword());
  }

  getPassword() {
    return this.password;
  }

  getClipboardClass() {
    if (this.password === '') {
      return 'hidden';
    }
  }
}
