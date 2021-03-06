import { NgModule }                         from '@angular/core';
import { CommonModule }                     from '@angular/common';

import { WidgetLibraryModule }              from '../widget-library/widget-library.module';
import { MaterialDesignFrameworkModule }    from './material-design-framework/material-design-framework.module';

import { NoFrameworkComponent }             from './no-framework.component';
import { Bootstrap3FrameworkComponent }     from './bootstrap-3-framework.component';
// import { Bootstrap4FrameworkComponent }     from './bootstrap-4-framework.component';
// import { Foundation6FrameworkComponent }    from './foundation-6-framework.component';
// import { SemanticUIFrameworkComponent }     from './semantic-ui-framework.component';

import { JsonSchemaFormService }            from '../json-schema-form.service';
import { WidgetLibraryService }             from '../widget-library/widget-library.service';
import { FrameworkLibraryService }          from './framework-library.service';

const FRAMEWORK_COMPONENTS = [
  NoFrameworkComponent,
  Bootstrap3FrameworkComponent,
  // Bootstrap4FrameworkComponent,
  // Foundation6FrameworkComponent,
  // SemanticUIFrameworkComponent
];

@NgModule({
  imports:         [ CommonModule, WidgetLibraryModule, MaterialDesignFrameworkModule ],
  declarations:    [ ...FRAMEWORK_COMPONENTS ],
  exports:         [ ...FRAMEWORK_COMPONENTS, MaterialDesignFrameworkModule ],
  entryComponents: [ ...FRAMEWORK_COMPONENTS ],
  providers:       [ WidgetLibraryService, FrameworkLibraryService ]
})
export class FrameworkLibraryModule { }
