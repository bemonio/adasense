import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private logMessages = new BehaviorSubject<string[]>([]);
  logs$ = this.logMessages.asObservable();

  addLog(message: string) {
    const currentLogs = this.logMessages.getValue();
    this.logMessages.next([...currentLogs, message]);
  }

  clearLogs() {
    this.logMessages.next([]);
  }
}
