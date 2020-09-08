import { Component, OnInit, OnDestroy } from '@angular/core';
import { SermonsService } from '../sermons.service';
import { Sermon } from '../sermon.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sermon-list',
  templateUrl: './sermon-list.component.html',
  styleUrls: ['./sermon-list.component.scss']
})
export class SermonListComponent implements OnInit, OnDestroy {
  sermons: Sermon[] = [];
  isLoading: boolean = false;
  // Subscription handler - used for preventing memory leaks
  sermonsSubscription: Subscription;

  constructor(public sermonsService: SermonsService) { }

  ngOnInit() {
    this.isLoading = true;
    this.sermonsService.getSermons();
    // Listen for updates to the sermons list
    this.sermonsSubscription = this.sermonsService.getSermonsUpdatedListener()
      .subscribe((sermons: Sermon[]) => {
        this.sermons = sermons;
        this.isLoading = false;
      });
  }

  formatDate(date: string) {
    const newDate = new Date(date);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return newDate.toLocaleDateString(undefined, options);
  }

  onDelete(id: string) {
    this.sermonsService.deleteSermon(id).subscribe(() => {
      this.sermonsService.getSermons();
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.sermonsSubscription.unsubscribe;
  }
}
