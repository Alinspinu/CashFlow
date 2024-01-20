import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-pdf-view',
  templateUrl: './pdf-view.page.html',
  styleUrls: ['./pdf-view.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NgxExtendedPdfViewerModule]
})
export class PdfViewPage implements OnInit {

  pdfUrl: string = ''

  constructor() { }

  ngOnInit() {
  }

}
