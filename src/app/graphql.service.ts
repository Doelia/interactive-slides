import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {

  endpoint = 'https://api-euwest.graphcms.com/v1/ck4iiajnn0azp01bq3s8v5pfq/master';

  constructor(private http: HttpClient) { }

  request(query: any, variables?: any): Observable<any> {
    if (!variables) {
      variables = {};
    }
    return this.http.post<{data: any}>(this.endpoint, {query, variables}).pipe(map(v => v.data));
  }

  getSlides(idProject: string): any {
    return this.request(`
      query ($id: ID!) {
        project(where: {
          id: $id
        }) {
          slides {
            id
            text
            answers {
              text
            }
          }
        }
      }
    `, {
      id: idProject
    }).pipe(map(v => v.project.slides));
  }

  setCurrentSlide(idProject: string, idSlide: string) {
    console.log('setCurrentSlide', idProject, idSlide);
    return this.request(`
      mutation ($id_slide: ID!, $id_project: ID!) {
      updateProject(data: {
        currentSlide: {
          connect: {
            id: $id_slide
          }
        }
      }, where: {
        id: $id_project
      }) {
        id
      }
    }`, {
      id_project: idProject,
      id_slide: idSlide,
    });
  }


  getCurrentPool(idProject: string): any {
    return this.request(`
    query ($id: ID!) {
        project(where: {
          id: $id
        }) {
          currentSlide {
            text
            answers {
              text
            }
          }
        }
    }`, {
      id: idProject
    }).pipe(map(v => v.project.currentSlide));

  }
}
