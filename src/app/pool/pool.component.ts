import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {WebsocketService} from '../websocket.service';
import {TokenService} from '../token.service';
import {PoolService} from '../pool.service';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css']
})
export class PoolComponent implements OnInit {

  public pool: any = null;
  public myresponse: {
      id: string,
      answer: {
          id: string
      }
  } = null;

  constructor(
      private poolService: PoolService,
      private route: ActivatedRoute,
      private socket: WebsocketService,
      private tokenService: TokenService
  ) { }

    ngOnInit() {

        const idProject = this.route.snapshot.paramMap.get('id');
        this.poolService.getCurrentSlide(idProject).subscribe(idSlide => {
            this.loadSlide(idSlide);
        });

        this.socket.subscribeTo(`
        subscription {
          project(where: {
            node: {
              id: "${ idProject }"
            },
            mutation_in: [UPDATED]
          }) {
            mutation
            node {
            currentSlide
            }
          }
        }
      `).subscribe(event => {
            this.loadSlide(event.project.node.currentSlide);
        });
    }

  loadSlide(idSlide: string) {
      const token = this.tokenService.getToken();
        this.poolService.getPoolOfSlide(idSlide, token).subscribe(pool => {
            this.pool = pool;
            pool.answers.forEach(answer => {
                if (answer.participants.length) {
                    this.myresponse = answer.participants[0];
                    console.log('myresponse', this.myresponse);
                }
            });
        });
  }

  voteFor(idAnswer: string) {
      if (this.myresponse) {
          this.poolService.removeVote(this.myresponse.id).subscribe();
      }
      const token = this.tokenService.getToken();
      this.poolService.voteFor(idAnswer, token).subscribe(v => {
          this.myresponse = v;
          console.log('myresponse', this.myresponse);
      });
  }


}
