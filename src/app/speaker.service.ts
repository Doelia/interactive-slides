import { Injectable } from '@angular/core';
import {GraphqlService} from './graphql.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpeakerService {

  constructor(private client: GraphqlService) { }

  getSlides(idProject: string): any {
    return this.client.request(`
      query ($id: ID!) {
        project(where: {
          id: $id
        }) {
          slides {
            id
            text
            answers {
              text
              participants {
                token
              }
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
    return this.client.request(`
      mutation ($id_slide: ID!, $id_project: ID!) {
      updateProject(data: {
        currentSlide: $id_slide
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

  getSlideWithParticipants(idSlide: string) {
    return this.client.request(`
      query ($idSlide: ID!) {
        slides(where: {
          id: $idSlide
        }) {
            id
            text
            answers {
              text
              participants {
                token
              }
            }
          }
      }
    `, {
      idSlide
    }).pipe(map(v => v.slides[0]));
  }

  clearAllResponses(idProject: string) {
    return this.client.request(`
    mutation ($idProject: ID!) {
      deleteManyParticipants(where: {
        answer: {
          slide: {
            project: {
              id: $idProject
            }
          }
        }
      }) {
        count
      }
    }
    `, {
      idProject
    });
  }
}
