import { Component, OnInit } from '@angular/core';
import {GraphqlService} from '../graphql.service';
import {ActivatedRoute} from "@angular/router";
import {switchMap} from "rxjs/operators";

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.css']
})
export class SlidesComponent implements OnInit {

  slides: Array<any> = [];
  iCurrentSlide = 0;
  idProject: string = '1234';

  constructor(private client: GraphqlService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.idProject = this.route.snapshot.paramMap.get('id');

    this.client.getSlides(this.idProject).subscribe(slides => {
      this.slides = slides;
      this.iCurrentSlide = 0;
      this.sendCurrentSlide();
    });
  }

  next() {
    this.iCurrentSlide++;
    if (this.iCurrentSlide > this.slides.length - 1) {
      this.iCurrentSlide = this.slides.length - 1;
    }
    this.sendCurrentSlide();
  }

  previous() {
    this.iCurrentSlide--;
    if (this.iCurrentSlide < 0) {
      this.iCurrentSlide = 0;
    }
    this.sendCurrentSlide();
  }

  private sendCurrentSlide() {
    this.client.setCurrentSlide(this.idProject, this.slides[this.iCurrentSlide].id).subscribe();
  }

}
