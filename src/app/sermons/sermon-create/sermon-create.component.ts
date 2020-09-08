import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Sermon } from '../sermon.model';
import { SermonsService } from '../sermons.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mp3Validator } from './mp3.validator';

@Component({
  selector: 'app-sermon-create',
  templateUrl: './sermon-create.component.html',
  styleUrls: ['./sermon-create.component.scss']
})
export class SermonCreateComponent implements OnInit {
  sermon: Sermon;
  isLoading = false;
  mp3Preview: string;
  didMP3Upload: boolean = false;
  form: FormGroup;
  mode = 'create';
  private sermonId: string;

  constructor(public sermonsService: SermonsService, public route: ActivatedRoute) { 
  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required] }),
      scripture: new FormControl(null, { validators: [Validators.required] }),
      speaker: new FormControl(null, { validators: [Validators.required] }),
      date: new FormControl(null, { validators: [Validators.required] }),
      mp3: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mp3Validator]
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('sermonId')) {
        this.mode = 'edit';
        this.sermonId = paramMap.get('sermonId');
        this.isLoading = true;
        this.sermonsService.getSermon(this.sermonId).subscribe(sermonData => {
          this.isLoading = false;
          
          this.sermon = {
            id: sermonData.sermon._id,
            title: sermonData.sermon.title,
            scripture: sermonData.sermon.scripture,
            speaker: sermonData.sermon.speaker,
            date: sermonData.sermon.date,
            mp3: sermonData.sermon.mp3
          };

          this.form.setValue({
            title: this.sermon.title,
            scripture: this.sermon.scripture,
            speaker: this.sermon.speaker,
            date: this.sermon.date,
            mp3: this.sermon.mp3
          });

          this.mp3Preview = this.sermon.mp3;
        });
      } else {
        this.mode = 'create';
        this.sermonId = null;
      }
    });
  }

  onSelectMP3(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];

    this.form.patchValue({ mp3: file });
    this.form.get('mp3').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.isLoading = false;
      this.didMP3Upload = true;
    }
    reader.readAsDataURL(file);

    this.isLoading = true;
  }

  onSaveSermon() {
    if (this.form.invalid) {
      return;
    };

    if (this.mode == 'create') {
      this.sermonsService.addSermon(
        this.form.value.title, 
        this.form.value.scripture,
        this.form.value.speaker,
        new Date(this.form.value.date),
        this.form.value.mp3
      );
    } else {
      this.sermonsService.updateSermon(
        this.sermonId,
        this.form.value.title, 
        this.form.value.scripture,
        this.form.value.speaker,
        new Date(this.form.value.date),
        this.form.value.mp3
      );
    }    

    this.form.reset();
    this.isLoading = true;
  }

}
