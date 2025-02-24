import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonGrid, IonCol, IonRow, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { FaceTrackingService } from '../../services/face_tracking.service';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-camera-preview',
  standalone: true,
  templateUrl: 'camera_preview.component.html',
  styleUrls: ['camera_preview.component.scss'],
  imports: [
    IonGrid,
    IonCol,
    IonRow,
    IonSelect,
    IonSelectOption,
    NgFor,
    FormsModule
  ]
})
export class CameraPreviewComponent implements OnInit {
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement', { static: true }) canvasElement!: ElementRef<HTMLCanvasElement>;

  cameras: MediaDeviceInfo[] = [];
  selectedCameraId: string | null = null;
  private stream: MediaStream | null = null;

  constructor(private faceTrackingService: FaceTrackingService, private logService: LogService) {}

  async ngOnInit() {
    this.logService.addLog('Initializing camera preview...');
    await this.getAvailableCameras();
    if (this.cameras.length > 0) {
      this.selectedCameraId = this.cameras[0].deviceId;
      await this.startCamera();
    }
  }

  async getAvailableCameras() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    this.cameras = devices.filter(device => device.kind === 'videoinput');

    if (this.cameras.length > 0) {
      this.logService.addLog(`Found ${this.cameras.length} cameras.`);
    } else {
      this.logService.addLog('No cameras found.');
    }
  }

  async startCamera() {
    if (!this.selectedCameraId) return;

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.logService.addLog('Stopped previous camera stream.');
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: this.selectedCameraId } }
      });

      if (this.videoElement) {
        this.videoElement.nativeElement.srcObject = this.stream;
        this.videoElement.nativeElement.onloadedmetadata = () => {
          this.logService.addLog('Camera stream started.');
          this.trackFace();
        };
      }
    } catch (error) {
      this.logService.addLog(`Error accessing camera: ${error}`);
    }
  }

  trackFace() {
    this.logService.addLog('Starting face tracking...');
    this.faceTrackingService.detectFace(this.videoElement.nativeElement, results => {
      if (results.multiFaceLandmarks?.length) {
        this.logService.addLog(`Detected ${results.multiFaceLandmarks[0].length} face landmarks.`);
        this.drawLandmarks(results.multiFaceLandmarks[0]);
      } else {
        this.logService.addLog('No face detected.');
        this.clearCanvas();
      }
    });
  }

  drawLandmarks(landmarks: { x: number; y: number }[]) {
    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const video = this.videoElement.nativeElement;
    const videoRect = video.getBoundingClientRect();
    canvas.width = videoRect.width;
    canvas.height = videoRect.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);

    ctx.fillStyle = 'green';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;

    landmarks.forEach(point => {
      const x = (1 - point.x) * canvas.width;
      const y = point.y * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, 0.9, 1, 1 * Math.PI);
      ctx.fill();
      ctx.stroke();
    });

    ctx.restore();
  }

  clearCanvas() {
    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.logService.addLog('Cleared canvas.');
    }
  }
}
