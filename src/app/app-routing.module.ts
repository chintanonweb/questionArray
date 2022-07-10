import { QuestionComponent } from './quetionArray/question/question.component';
import { HomeComponent } from './quetionArray/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', component:HomeComponent},
  {path: 'question',component: QuestionComponent},
  {path: 'edit',component: QuestionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
