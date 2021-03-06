import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';

import { ExampleSchemas } from './example-schemas.model';

@Component({
  selector: 'demo',
  templateUrl: 'demo.component.html',
  styleUrls: [ 'demo.component.css' ]
})
export class DemoComponent implements OnInit, AfterViewInit {
  private exampleSchemas = ExampleSchemas;
  private selectedSet: string = 'asf';
  private selectedExample: string = 'asf-basic-json-schema-type';
  private selectedFramework: string = 'bootstrap-3';

  private formActive: boolean = false;
  private aceHeight: number = 600;
  private jsonFormSchema: string;
  private jsonFormValid: boolean = false;
  private jsonFormErrorMessage: string = 'Loading form...';
  private jsonFormObject: any;
  private jsonFormOptions: any = {
    addSubmit: true, // Add a submit button if layout does not have one
    loadExternalAssets: true, // Load external css and JavaScript for frameworks
    formDefaults: { feedback: true }, // SHow inline feedback icons
    debug: false,
  };
  private liveFormData: any = {};
  private formValidationErrors: any;
  private formIsValid: boolean = null;
  private submittedFormData: any = null;
  private aceEditorOptions: any = {
    highlightActiveLine: true,
    maxLines: 1000,
    printMargin: false,
    autoScrollEditorIntoView: true,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: Http,
  ) { }

  ngOnInit() {
    // Checks query string for the name of a form to load
    this.route.queryParams.subscribe(
      params => {
        if (params['set']) { this.selectedSet = params['set']; }
        if (params['example']) { this.selectedExample = params['example']; }
        if (params['framework']) { this.selectedFramework = params['framework']; }
      }
    );
  }

  ngAfterViewInit() {
    this.loadSelectedExample();
  }

  onSubmit(data: any) {
    this.submittedFormData = data;
  }

  get prettySubmittedFormData() {
    return JSON.stringify(this.submittedFormData, null, 2);
  }

  onChanges(data: any) {
    this.liveFormData = data;
  }

  get prettyLiveFormData() {
    return JSON.stringify(this.liveFormData, null, 2);
  }

  private isValid(isValid: boolean): void {
    this.formIsValid = isValid;
  }

  private validationErrors(data: any): void {
    this.formValidationErrors = data;
  }

  get prettyValidationErrors() {
    if (!this.formValidationErrors) { return null; }
    let prettyValidationErrors = '';
    for (let error of this.formValidationErrors) {
      prettyValidationErrors += (error.dataPath.length ?
        error.dataPath.slice(1) + ' ' + error.message : error.message) + '\n';
    }
    return prettyValidationErrors;
  }

  private resizeAceEditor() {
    this.aceHeight = window.innerHeight - 230;
  }

  private loadSelectedSet(selectedSet?: string) {
    if (selectedSet && selectedSet !== this.selectedSet) {
      this.selectedSet = selectedSet;
      this.selectedExample = this.exampleSchemas.exampleList[selectedSet][0];
      this.router.navigateByUrl(
        '/?set=' + selectedSet +
        '&example=' + this.selectedExample +
        '&framework=' + this.selectedFramework
      );
      this.loadSelectedExample();
    }
  }

  // Load and display the selected schema
  // (runs whenever the user selects a schema from the drop-down menu)
  private loadSelectedExample(selectedSet?: string, selectedExample?: string) {
    if (selectedExample && selectedExample !== this.selectedExample) {
      this.selectedSet = selectedSet;
      this.selectedExample = selectedExample;
      this.router.navigateByUrl(
        '/?set=' + selectedSet +
        '&example=' + selectedExample +
        '&framework=' + this.selectedFramework
      );
      this.liveFormData = {};
      this.submittedFormData = null;
      this.formIsValid = null;
      this.formValidationErrors = null;
    }
    this.http
      .get('assets/example-schemas/' + this.selectedExample + '.json')
      .map(schema => schema.text())
      .subscribe(schema => {
        this.jsonFormSchema = schema;
        this.generateForm(this.jsonFormSchema);
      });
  }

  private loadSelectedFramework(selectedFramework: string) {
    this.router.navigateByUrl(
      '/?set=' + this.selectedSet +
      '&example=' + this.selectedExample +
      '&framework=' + selectedFramework
    );
    this.generateForm(this.jsonFormSchema);
  }

  // Display the form entered by the user
  // (runs whenever the user changes the jsonform object in the ACE input field)
  private generateForm(newFormString: string) {
    if (!newFormString) { return; }
    this.formActive = false;
    this.liveFormData = {};
    this.submittedFormData = null;

    // Most examples should be written in pure JSON,
    // but if an example schema includes a function,
    // it will be compiled it as Javascript instead
    try {

      // Parse entered content as JSON
      this.jsonFormObject = JSON.parse(newFormString);
      this.jsonFormValid = true;
    } catch (jsonError) {
      try {

        // If entered content is not valid JSON,
        // parse as JavaScript instead to include functions
        let newFormObject: any = null;
        eval('newFormObject = ' + newFormString);
        this.jsonFormObject = newFormObject;
        this.jsonFormValid = true;
      } catch (javascriptError) {

        // If entered content is not valid JSON or JavaScript, show error
        this.jsonFormValid = false;
        this.jsonFormErrorMessage =
          'Entered content is not currently a valid JSON Form object.\n' +
          'As soon as it is, you will see your form here. So keep typing. :-)\n\n' +
          'JavaScript parser returned:\n\n' + jsonError;
        return;
      }
    }
    this.formActive = true;
  }
}
