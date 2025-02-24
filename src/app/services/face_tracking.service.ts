import { Injectable } from '@angular/core';
import { FaceMesh } from '@mediapipe/face_mesh';

@Injectable({ providedIn: 'root' })
export class FaceTrackingService {
  private faceMesh: FaceMesh;

  constructor() {
    this.faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });
    this.faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
  }

  async detectFace(video: HTMLVideoElement, callback: (results: any) => void) {
    this.faceMesh.onResults(callback);
    await this.processVideo(video);
  }

  private async processVideo(video: HTMLVideoElement) {
    const sendFrame = async () => {
      if (!video.paused && !video.ended) {
        await this.faceMesh.send({ image: video });
        requestAnimationFrame(sendFrame);
      }
    };
    sendFrame();
  }
}