import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.css']
})
export class SlideComponent implements OnInit {

  @Input() slide;

  constructor() { }

  ngOnInit() {
    console.log('slide', this.slide);
  }


}
