import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  questionArrayData:any;
  questionArrayObj:any;
  constructor(private route: Router) { }

  ngOnInit(): void {
    this.questionArrayObj = localStorage.getItem('questionArrayData') || '';
    if(this.questionArrayObj){
      this.questionArrayData = JSON.parse(this.questionArrayObj);
    }
  }
  addQuestion(){
    this.route.navigateByUrl('edit');
  }

}
