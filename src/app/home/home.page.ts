import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { CameraPreviewComponent } from '../components/camera_preview/camera_preview.component';
import { LogComponent } from '../components/log/log.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, CameraPreviewComponent, LogComponent],
})
export class HomePage {
  constructor() {}
}
