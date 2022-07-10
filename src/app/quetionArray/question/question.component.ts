import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

interface QueType {
  id: string;
  type: string;
}
@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  queFormGroup!: FormGroup;
  radioFormGroup!: FormGroup;
  qTypeData: any;
  qtypes: QueType[] = [
    { id: '1', type: 'Short Text' },
    { id: '2', type: 'Long Text' },
    { id: '3', type: 'Radio Type' }
  ];
  questionArrayObj: any;
  questionArrayData: any

  constructor(private fb: FormBuilder, private router: Router, private snackBar: MatSnackBar) { }
  ngOnInit(): void {
    this.questionArrayObj = localStorage.getItem('questionArrayData') || '';
    if (this.questionArrayObj) {
      this.questionArrayData = JSON.parse(this.questionArrayObj);
    }
    this.intializeQuetion();
  }

  //on question type select event
  onSelectEvent($event: any, type: QueType, questionIndex: number) {
    if ($event.isUserInput) {
      this.qTypeData = type;
      const data = (this.questionArr.at(questionIndex).get('radioArr') as FormArray);
      data.controls.map((control: any) => {
        if (this.qTypeData.type !== 'Radio Type') {
          control.controls['radioValue'].setValidators([]);
          control.controls['radioValue'].updateValueAndValidity()
        }
        else {
          // this.radioArr(questionIndex).push(this.getRadioGroup());
          // this.radioArr(questionIndex).push(this.getRadioGroup());
          control.controls['radioValue'].setValidators([Validators.required]);
          control.controls['radioValue'].updateValueAndValidity()
        }
      })
    }
  }

  //question FormArray Process Start

  //Question formGroup formArray intialization
  intializeQuetion() {
    this.queFormGroup = new FormGroup(
      { questionArr: new FormArray([this.getQuestionGroup()]) }
    )

    if (this.questionArrayData) {
      this.queFormGroup = new FormGroup(
        {

          questionArr: new FormArray(
            this.questionArrayData.length === 0 ?
              this.getQuestionGroup() : this.questionArrayData.map((obj: any) => {
                return this.getQuestionGroup();
              })
          )
        }
      )
     
      this.questionArr.patchValue(this.questionArrayData)
      this.questionArr.controls.forEach((control: any, index) => {
        if (control.controls['questionsType'].value != 'Radio Type') {
          const data = (this.questionArr.at(index).get('radioArr') as FormArray);
          data.controls.map((radcontrol: any) => {
            radcontrol.controls['radioValue'].setValidators([]);
            radcontrol.controls['radioValue'].updateValueAndValidity()
          })
        }
      });
      console.log(this.questionArr)
    }
  }
  //return Question formgroup
  getQuestionGroup() {
    return this.fb.group({
      questions: new FormControl('', [Validators.required]),
      questionsType: new FormControl('', [Validators.required]),
      radioArr: this.fb.array([
        this.getRadioGroup(), this.getRadioGroup()
      ])
    })
  }

  //intialized questionArr as formArray
  get questionArr() {
    return this.queFormGroup.get('questionArr') as FormArray;
  }

  //for adding new question
  addQuestion() {
    this.queFormGroup.markAllAsTouched();
    if (this.queFormGroup.invalid) {
      return;
    }
    this.questionArr.push(this.getQuestionGroup());
  }

  //for delete quetion from formArray
  deleteQuestion(i: number) {
    this.questionArr.removeAt(i);
    this.snackBar.open('Deleted Successfully', 'Close', {
      duration: 4000
    });
  }

  //radio formArray process  

  //return radio formgroup
  getRadioGroup() {
    return this.fb.group({
      radioValue: new FormControl('', [Validators.required]),
    })
  }

  //intialized radioArr as formArray
  radioArr(i: any): FormArray {
    return this.questionArr.at(i).get('radioArr') as FormArray;
  }


  //for adding new radio
  addRadioInput(i: any) {
    this.radioArr(i).markAllAsTouched();
    if (this.radioArr(i).invalid) {
      return;
    }
    this.radioArr(i).push(this.getRadioGroup());
  }

  deleteRadioInput(i: any, j: any) {
    this.radioArr(i).removeAt(j);
    this.snackBar.open('Deleted Successfully', 'Close', {
      duration: 4000
    });
  }

  //submit question and store into local storage
  sumbitQuestion() {
    console.log(this.queFormGroup)
    this.queFormGroup.markAllAsTouched();
    if (this.queFormGroup.invalid) {
      return;
    }
    const queForm = this.questionArr.value;
    queForm.map((item: any) => {
      if (item.questionsType !== 'Radio Type') {
        delete item.radioArr;
      }
    })
    localStorage.setItem('questionArrayData', JSON.stringify(queForm));
    this.questionArrayData = localStorage.getItem('questionArrayData') || '';
    this.router.navigateByUrl('');
    this.snackBar.open('Updated Successfully', 'Close', {
      duration: 4000
    });
  }

  reset() {
    localStorage.removeItem('questionArrayData')
    this.router.navigateByUrl('');
    this.snackBar.open('Reset Successfully', 'Close', {
      duration: 4000
    });
  }

}
