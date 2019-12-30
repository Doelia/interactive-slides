import { Component, OnInit } from '@angular/core';
import {GraphqlService} from "../graphql.service";
import {ActivatedRoute} from "@angular/router";
import {WebsocketService} from '../websocket.service';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css']
})
export class PoolComponent implements OnInit {

  public pool: any = null;

  constructor(
      private client: GraphqlService,
      private route: ActivatedRoute,
      private socket: WebsocketService,
  ) { }

  ngOnInit() {
    const idProject = this.route.snapshot.paramMap.get('id');
    this.client.getCurrentSlide(idProject).subscribe(idSlide => {
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
    this.client.getPoolOfSlide(idSlide).subscribe(pool => this.pool = pool);
  }


}
