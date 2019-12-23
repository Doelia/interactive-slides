import { Component, OnInit } from '@angular/core';
import {GraphqlService} from "../graphql.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css']
})
export class PoolComponent implements OnInit {

  public pool: any = null;

  constructor(private client: GraphqlService, private route: ActivatedRoute) { }

  ngOnInit() {
    const idProject = this.route.snapshot.paramMap.get('id');
    this.client.getCurrentPool(idProject).subscribe(pool => this.pool = pool);
  }

}
