import { Injectable }                       from '@angular/core';

import { WidgetLibraryService }             from '../widget-library/widget-library.service';

// No framework - unmodified HTML controls, with styles from layout only
import { NoFrameworkComponent }             from './no-framework.component';

// Material Design Framework (under construction)
// https://github.com/angular/material2
// https://www.muicss.com/docs/v1/css-js/forms
// http://materializecss.com/forms.html
import { MaterialAddReferenceComponent }    from './material-design-framework/material-add-reference.component';
import { MaterialButtonComponent }          from './material-design-framework/material-button.component';
import { MaterialButtonGroupComponent }     from './material-design-framework/material-button-group.component';
import { MaterialCardComponent }            from './material-design-framework/material-card.component';
import { MaterialCheckboxComponent }        from './material-design-framework/material-checkbox.component';
import { MaterialCheckboxesComponent }      from './material-design-framework/material-checkboxes.component';
import { MaterialDatepickerComponent }      from './material-design-framework/material-datepicker.component';
import { MaterialFileComponent }            from './material-design-framework/material-file.component';
import { MaterialInputComponent }           from './material-design-framework/material-input.component';
import { MaterialNumberComponent }          from './material-design-framework/material-number.component';
import { MaterialRadiosComponent }          from './material-design-framework/material-radios.component';
import { MaterialSelectComponent }          from './material-design-framework/material-select.component';
import { MaterialSliderComponent }          from './material-design-framework/material-slider.component';
import { MaterialTabsComponent }            from './material-design-framework/material-tabs.component';
import { MaterialTextareaComponent }        from './material-design-framework/material-textarea.component';
import { MaterialDesignFrameworkComponent } from './material-design-framework/material-design-framework.component';

// Bootstrap 3 Framework
// https://github.com/valor-software/ng2-bootstrap
import { Bootstrap3FrameworkComponent }     from './bootstrap-3-framework.component';

// Bootstrap 4 Framework (not started)
// https://github.com/ng-bootstrap/ng-bootstrap
// http://v4-alpha.getbootstrap.com/components/forms/
// import { Bootstrap4FrameworkComponent }     from './bootstrap-4-framework.component';

// Foundation 6 Framework (not started)
// https://github.com/zurb/foundation-sites
// import { Foundation6FrameworkComponent }    from './foundation-6-framework.component';

// Semantic UI Framework (not started)
// https://github.com/vladotesanovic/ngSemantic
// import { SemanticUIFrameworkComponent }     from './semantic-ui-framework.component';

export type Framework = {
  framework: any,
  widgets?: { [key: string]: any },
  stylesheets?: string[],
  scripts?: string[]
};

export type FrameworkLibrary = { [key: string]: Framework };

@Injectable()
export class FrameworkLibraryService {
  private activeFramework: Framework = null;
  private stylesheets: (HTMLStyleElement|HTMLLinkElement)[];
  private scripts: HTMLScriptElement[];
  private loadExternalAssets: boolean = false;
  private defaultFramework: string = 'bootstrap-3';
  private frameworkLibrary: FrameworkLibrary = {
    'no-framework': { framework: NoFrameworkComponent },
    'material-design': {
      framework: MaterialDesignFrameworkComponent,
      widgets: {
        '$ref': MaterialAddReferenceComponent,
        'number': MaterialNumberComponent,
        'slider': MaterialSliderComponent,
        'text': MaterialInputComponent,
        'date': MaterialDatepickerComponent,
        'file': MaterialFileComponent,
        'checkbox': MaterialCheckboxComponent,
        'button': MaterialButtonComponent,
        'buttonGroup': MaterialButtonGroupComponent,
        'select': MaterialSelectComponent,
        'textarea': MaterialTextareaComponent,
        'checkboxes': MaterialCheckboxesComponent,
        'radios': MaterialRadiosComponent,
        'card': MaterialCardComponent,
        'tabs': MaterialTabsComponent,
        'alt-date': 'date',
        'range': 'slider',
        'submit': 'button',
        'radiobuttons': 'buttonGroup',
        'color': 'none',
        'hidden': 'none',
        'image': 'none',
      },
      stylesheets: [
        '//fonts.googleapis.com/icon?family=Material+Icons',
        '//fonts.googleapis.com/css?family=Roboto:300,400,500,700',
        // '//maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css',
        // './node_modules/@angular/material/core/theming/prebuilt/deeppurple-amber.css',
        // './node_modules/@angular/material/core/theming/prebuilt/indigo-pink.css',
      ],
    },
    'bootstrap-3': {
      framework: Bootstrap3FrameworkComponent,
      stylesheets: [
        '//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
        '//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css',
      ],
      scripts: [
        // '//code.jquery.com/jquery-2.1.1.min.js',
        '//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js',
        // '//code.jquery.com/ui/1.12.1/jquery-ui.min.js',
        '//ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js',
        '//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js',
      ],
    },
    // 'bootstrap-4': { framework: Bootstrap4FrameworkComponent, },
    // 'foundation-6': { framework: Foundation6FrameworkComponent, },
    // 'smantic-ui': { framework: SemanticUIFrameworkComponent, },
  };

  constructor(
    private widgetLibrary: WidgetLibraryService
  ) { }

  private registerFrameworkWidgets(framework: Framework): boolean {
    if (framework.hasOwnProperty('widgets')) {
      this.widgetLibrary.registerFrameworkWidgets(framework.widgets);
      return true;
    }
    this.widgetLibrary.unRegisterFrameworkWidgets();
    return false;
  }

  private unloadFrameworkExternalAssets(): void {
    for (let node of [...(this.scripts || []), ...(this.stylesheets || [])]) {
      node.parentNode.removeChild(node);
    }
    this.scripts = [];
    this.stylesheets = [];
  }

  private loadFrameworkExternalAssets(framework: Framework): boolean {
    this.unloadFrameworkExternalAssets();
    if (framework.hasOwnProperty('scripts')) {
      for (let script of framework.scripts) {
        let newScript: HTMLScriptElement = document.createElement('script');
        if (script.slice(0, 1) === '/' || script.slice(0, 2) === './'
          || script.slice(0, 4) === 'http'
        ) { // Attach URL to remote javascript
          newScript.src = script;
        } else { // Attach content as javascript
          newScript.innerHTML = script;
        }
        this.scripts.push(newScript);
        document.head.appendChild(newScript);
      }
    }
    if (framework.hasOwnProperty('stylesheets')) {
      for (let stylesheet of framework.stylesheets) {
        let newStylesheet: HTMLStyleElement|HTMLLinkElement;
        if (stylesheet.slice(0, 1) === '/' || stylesheet.slice(0, 2) === './'
          || stylesheet.slice(0, 4) === 'http'
        ) { // Attach URL to remote stylesheet
          newStylesheet = document.createElement('link');
          (<HTMLLinkElement>newStylesheet).rel = 'stylesheet';
          (<HTMLLinkElement>newStylesheet).href = stylesheet;
        } else { // Attach content as stylesheet
          newStylesheet = document.createElement('style');
          newStylesheet.innerHTML = stylesheet;
        }
        this.stylesheets.push(newStylesheet);
        document.head.appendChild(newStylesheet);
      }
    }
    return !!(framework.stylesheets || framework.scripts);
  }

  public setLoadExternalAssets(loadExternalAssets: boolean = true): void {
    this.loadExternalAssets = !!loadExternalAssets;
  }

  public setFramework(
    framework?: string|Framework, loadExternalAssets: boolean = this.loadExternalAssets
  ): boolean {
    if (!framework) return false;
    let validNewFramework: boolean = false;
    if (!framework || framework === 'default') {
      this.activeFramework = this.frameworkLibrary[this.defaultFramework];
      validNewFramework = true;
    } else if (typeof framework === 'string' && this.hasFramework(framework)) {
      this.activeFramework = this.frameworkLibrary[framework];
      validNewFramework = true;
    } else if (typeof framework === 'object' && framework.hasOwnProperty('framework')) {
      this.activeFramework = framework;
      validNewFramework = true;
    }
    if (validNewFramework) {
      this.registerFrameworkWidgets(this.activeFramework);
      if (loadExternalAssets) {
        this.loadFrameworkExternalAssets(this.activeFramework);
      } else {
        this.unloadFrameworkExternalAssets();
      }
    }
    return validNewFramework;
  }

  public hasFramework(type: string): boolean {
    if (!type || typeof type !== 'string') return false;
    return this.frameworkLibrary.hasOwnProperty(type);
  }

  public getFramework(): any {
    if (!this.activeFramework) this.setFramework('default', true);
    return this.activeFramework.framework;
  }

  public getFrameworkWidgets(): any {
    return this.activeFramework.widgets || {};
  }

  public getFrameworkStylesheets(): string[] {
    return this.activeFramework.stylesheets || [];
  }

  public getFrameworkScritps(): string[] {
    return this.activeFramework.scripts || [];
  }
}
