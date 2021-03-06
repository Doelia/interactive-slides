import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {WebsocketService} from '../websocket.service';
import {SpeakerService} from '../speaker.service';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.css']
})
export class SlideComponent implements OnInit, OnDestroy, OnChanges {

  @Input() slide;
  showResponses = false;

  $socketSubscription;

  constructor(
    private socket: WebsocketService,
    private client: SpeakerService
  ) { }

  onSlideChange() {
    this.showResponses = false;
  }

  ngOnChanges() {
    this.onSlideChange();
  }

  ngOnInit() {
    console.log('slide', this.slide);

    this.$socketSubscription = this.socket.subscribeTo(`
    subscription {
      participant(where: {
        mutation_in: CREATED
      }) {
        node {
          id
        }
      }
    }
    `);

    this.$socketSubscription.subscribe(v => this.loadParticipants());

  }

  loadParticipants() {
    this.client.getSlideWithParticipants(this.slide.id).subscribe(slide => this.slide = slide);
  }

  ngOnDestroy(): void {
    this.$socketSubscription.unsubscribe();
  }

  togleShowResponse() {
    this.showResponses = !this.showResponses;
  }


}
