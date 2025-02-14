import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { Report } from 'src/app/models/report.model';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { EntryViewPage } from 'src/app/modals/entry-view/entry-view.page';

@Component({
  selector: 'app-spend',
  templateUrl: './spend.page.html',
  styleUrls: ['./spend.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SpendPage implements OnInit {

  report!: Report
  totalSpendings: number = 0
  constructor(
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private navParams: NavParams,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.getData()
  }

  getData(){
    const data = this.navParams.get('options')
    if(data){
      this.report = data.report
      this.totalSpendings = data.totalSpendings
      console.log(this.totalSpendings)
    }

  }

  showEntry(entry: any, title: string){
    this.actionSheet.openAdd(EntryViewPage, {total: this.report.diverse.total, entries: entry, title}, 'medium-two')
  }

  showEntries(entry: any, title: string){
    this.actionSheet.openAdd(EntryViewPage, {total: entry.total, entries: entry.entries, sub: true, title}, 'medium')
  }


  close(){
    this.modalCtrl.dismiss(null)
  }

}
