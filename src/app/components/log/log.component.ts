import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-log',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: 'log.component.html',
  styleUrls: ['log.component.scss']
})
export class LogComponent {
  @ViewChild('logTextarea') logTextarea!: ElementRef<HTMLTextAreaElement>;
  logs: string[] = [];

  constructor(private logService: LogService) {
    this.logService.logs$.subscribe((logs) => {
      this.logs = logs;
    });
  }

  copyToClipboard() {
    if (this.logTextarea) {
      this.logTextarea.nativeElement.select();
      navigator.clipboard.writeText(this.logs.join('\n')).then(() => {
        alert('📋 Logs copiados al portapapeles');
      }).catch(err => {
        alert('❌ Error al copiar los logs');
        console.error(err);
      });
    }
  }
}
