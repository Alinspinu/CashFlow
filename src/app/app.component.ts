
import { Component,  OnInit } from '@angular/core';
import { ContentService } from './content/content.service';
import { TablesService } from './tables/tables.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']

})
export class AppComponent implements OnInit {

  constructor(
    private contService: ContentService,
    private tablesService: TablesService
    ) {}


  ngOnInit(): void {
    this.contService.getData().subscribe()
    this.tablesService.getTables()
  }



}
