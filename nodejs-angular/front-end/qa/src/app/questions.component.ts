import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question } from './question';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
  questions: Question[] = [];
  newQuestion: Question = {
    id: 0,
    question: '',
    answer: '',
    type: ''
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getQuestions();
  }

  getQuestions(): void {
    this.http.get<Question[]>('http://localhost:3000/questions').subscribe(questions => {
      this.questions = questions;
    });
  }

  addQuestion(): void {
    this.http.post('http://localhost:3000/questions', this.newQuestion).subscribe(() => {
      this.getQuestions();
      this.newQuestion = {
        id: 0,
        question: '',
        answer: '',
        type: ''
      };
    });
  }

  updateQuestion(question: Question): void {
    this.http.put(`http://localhost:3000/questions/${question.id}`, question).subscribe(() => {
      this.getQuestions();
    });
  }

  deleteQuestion(question: Question): void {
    this.http.delete(`http://localhost:3000/questions/${question.id}`).subscribe(() => {
      this.getQuestions();
    });
  }
}