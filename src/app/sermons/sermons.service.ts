import { Injectable } from '@angular/core';
import { Sermon } from './sermon.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SermonsService {
  private sermons: Sermon[] = [];

  // Subject used as an observable
  private updatedSermons = new Subject<Sermon[]>();

  constructor(private http: HttpClient, private router: Router) { }

  // Allows classes to subscribe to this observable
  getSermonsUpdatedListener() {
    return this.updatedSermons.asObservable();
  }

  // Gets a list of all sermons
  getSermons() {
    this.http.get<{ sermons: any[] }>(`${environment.apiUrl}api/sermons`)
      .pipe(map(data => {
        return {
          sermons: data.sermons.map(sermon => {
            return {
              id: sermon._id,
              title: sermon.title,
              scripture: sermon.scripture,
              speaker: sermon.speaker,
              date: sermon.date,
              mp3: sermon.mp3
            };
          })
        };
      }))
      .subscribe(transformedData => {
        this.sermons = transformedData.sermons;
        this.updatedSermons.next([...this.sermons]);
      }, error => {
        this.updatedSermons.next([]);
      });
  }

  // Adds a single sermon
  addSermon(title: string, scripture: string, speaker: string, date: Date, mp3: File) {
    const sermonData = new FormData();
    sermonData.append('title', title);
    sermonData.append('scripture', scripture);
    sermonData.append('speaker', speaker);
    sermonData.append('date', date.toISOString());
    sermonData.append('mp3', mp3, title);

    this.http.post(`${environment.apiUrl}api/sermons`, sermonData)
      .subscribe(response => {
        this.router.navigate(["/sermons"]);
      });
  }

  getSermon(id: string) {
    return this.http.get<{ sermon: any }>(`${environment.apiUrl}api/sermons/` + id);
  }

  updateSermon(id: string, title: string, scripture: string, speaker: string, date: Date, mp3: string) {
    let sermonData: Sermon | FormData;
    
    if (typeof mp3 === "object") {
      sermonData = new FormData();
      sermonData.append('id', id);
      sermonData.append('title', title);
      sermonData.append('scripture', scripture);
      sermonData.append('speaker', speaker);
      sermonData.append('date', date.toISOString());
      sermonData.append('mp3', mp3, title);
    } else {
      sermonData = {
        id: id,
        title: title,
        scripture: scripture,
        speaker: speaker,
        date: date,
        mp3: mp3
      };
    }

    this.http.put(`${environment.apiUrl}api/sermons/` + id, sermonData)
      .subscribe(response => {
        this.router.navigate(["/sermons"]);
      });
  }

  deleteSermon(sermonId: string) {
    return this.http.delete(`${environment.apiUrl}api/sermons/` + sermonId);
  }
}
