import { Injectable } from '@angular/core';
import {GraphqlService} from './graphql.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PoolService {

  constructor(private client: GraphqlService) { }

    getCurrentSlide(idProject: string): Observable<string> {
        return this.client.request<string>(`
    query ($id: ID!) {
        project(where: {
          id: $id
        }) {
          currentSlide
        }
    }`, {
            id: idProject
        }).pipe(map(v => v.project.currentSlide));

    }

    getPoolOfSlide(idSlide: string, token: string): Observable<{
      id: string,
        text: string,
        answers: Array<{
          id: string,
            text: string,
            participants: Array<{
              id: string,
                answer: {
                  id: string
                }
            }>
        }>
    }> {
        return this.client.request(`
        query ($id: ID! $token: String!) {
        slide(where: {
          id: $id
        }) {
        id
        text
        answers {
          id
          text
          participants(where: {
            token: $token
          }) {
            id
            answer {
              id
            }
          }
        }
        }
    }
    `, {
            id: idSlide,
            token
        }).pipe(map(v => v.slide));

    }

    voteFor(idAnswer, token) {
        return this.client.request(`
        mutation ($token: String!, $idAnswer: ID!) {
          createParticipant(data: {
            token: $token,
            answer: {
              connect: {
                 id: $idAnswer
                }
            }
          }) {
            id
            answer {
                id
            }
          }
        }
    `, {
            token,
            idAnswer
        }).pipe(map(v => v.createParticipant));
    }

    removeVote(id) {
        return this.client.request(`
        mutation ($id: ID!) {
          deleteParticipant(where: {
            id: $id
          }) {
            id
          }
        }
    `, {
            id
        });
    }
}
