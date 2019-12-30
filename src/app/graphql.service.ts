import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {

  // endpoint = 'https://api-euwest.graphcms.com/v1/ck4iiajnn0azp01bq3s8v5pfq/master';
    endpoint = 'https://eu1.prisma.sh/stephane-wouters-5362a4/slides/dev/';

  constructor(private http: HttpClient) { }

  request(query: any, variables?: any): Observable<any> {
    if (!variables) {
      variables = {};
    }
    return this.http.post<{data: any}>(this.endpoint, {query, variables}).pipe(map(v => v.data));
  }

  



}

