import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Option } from './models/option.model';
import { calculateCustomWorkArea, DEFAULT_POSITION, MAXIMIZED, POSITION_TYPES } from './constants/constants';
import { v4 as uuidv4 } from 'uuid';
import { DisplayInfo, MonitorOption, PositionOption, PositionType } from './models/share.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class AppComponent implements OnInit {
  tabOptions!: Option[];
  tabOption!: Option;
  showEditOptionDialog = false;
  submitted = false;
  monitors!: DisplayInfo[];
  positionOptions!: PositionOption[];
  monitorOptions!: MonitorOption[];
  selectedMonitor!: DisplayInfo;
  selectedPositionType!: PositionType;
  get defaultTabOption(): Option {
    return {
      id: uuidv4(),
      name: '',
      active: false,
      url: '',
      monitor: null,
      position: DEFAULT_POSITION,
      customPosition: DEFAULT_POSITION,
      positionType: MAXIMIZED,
      defaultMonitor: null
    };
  }
  ngOnInit() {
    this.tabOptions = [];
    this.monitorOptions = [];
    this.initTabOptions();
    chrome.system.display.getInfo().then(displayInfos => {
      this.monitorOptions = displayInfos.map<MonitorOption>(display => ({label: display.name, value: display})) || [];
    });
    this.positionOptions = POSITION_TYPES.map<PositionOption>(item => ({label: item, value: item})) || [];
    console.log('positionOptions: ', this.positionOptions);
  }

  initTabOptions() {
    return chrome.storage.sync.get('tabOptions').then(
      storage => this.tabOptions = storage['tabOptions'] as Option[] || [],
      error => console.log('[Error] Get tab options from storage error: ', error),
    );
  }

  openNew() {
    this.tabOption = this.defaultTabOption;
    this.selectedPositionType = this.positionOptions[0].value;
    this.selectedMonitor = this.monitorOptions[0].value;
    const {workArea, state} = calculateCustomWorkArea(this.selectedPositionType, this.selectedMonitor);
    this.tabOption.position = workArea;
    this.tabOption.state = state;
    this.showEditOptionDialog = true;
  }

  editTabOption(option: Option) {
    this.tabOption = JSON.parse(JSON.stringify(option));
    this.selectedPositionType = this.tabOption.positionType || this.positionOptions[0].value;;
    this.selectedMonitor = this.tabOption.monitor as DisplayInfo || this.monitorOptions[0].value;
    const {workArea, state} = calculateCustomWorkArea(this.selectedPositionType, this.selectedMonitor);
    this.tabOption.position = workArea;
    this.tabOption.state = state;
    this.showEditOptionDialog = true;
  }

  deleteTabOption(tabOption: Option) {
    const deletedIndex = this.tabOptions.findIndex(item => tabOption.id === item.id);
    if (deletedIndex > -1) {
      this.tabOptions.splice(deletedIndex, 1);
      this.saveToStorage('Delete tab option successfully!', 'Delete tab option failed!');
    }
  }

  hideDialog() {
    this.tabOption = this.defaultTabOption;
    this.showEditOptionDialog = false;
  }

  saveOptions() {
    this.submitted = true;
    const isValid = this.validateTabOption(this.tabOption);
    console.log(this.tabOption);
    if (!isValid) {
      return;
    }
    const existedIndex= this.tabOptions.findIndex(tab => tab.id === this.tabOption.id);
    if (existedIndex > -1) {
      this.tabOptions[existedIndex] = JSON.parse(JSON.stringify(this.tabOption));
    } else {
      this.tabOptions.unshift(JSON.parse(JSON.stringify(this.tabOption)));
    }
    this.saveToStorage('Update tab options successfully!', 'Update tab options failed!');
    this.submitted = false;
  }

  saveToStorage(successMsg: string, errorMsg: string) {
    chrome.storage.sync.set({['tabOptions']: this.tabOptions}).then(
      tabOptions => console.log(successMsg, tabOptions), // Show toast success message.
      error => console.log(errorMsg, error), // Show toast error message.
    ).finally(() => this.showEditOptionDialog = false);
  }

  checkMonitors() {
    chrome.system.display.getInfo().then(displayInfos => {
      if (!Array.isArray(displayInfos)) {
        return;
      }
      this.monitors = displayInfos;
      displayInfos.forEach(display => {
        const url = `assets/templates/monitor.html?width=${display.bounds.width}&height=${display.bounds.height}&left=${display.bounds.left}&top=${display.bounds.top}&primary=${display.isPrimary}`;
        chrome.windows.create({
            type: 'panel',
            left: display.workArea.left,
            top: display.workArea.top,
            width: display.workArea.width,
            height: display.workArea.height,
            url: chrome.runtime.getURL(url),
          },
          window => {
            console.log(`Created window with ID: ${window?.id}`);
            chrome.windows.update((window as chrome.windows.Window).id as number, {state: 'maximized'}).finally()
          });
      });
    });
  }

  validateTabOption(tabOption: Option) {
    return tabOption.name && tabOption.url;
  }

  onChangeMonitor($event: any) {
    const {workArea, state} = calculateCustomWorkArea(this.selectedPositionType, $event.value);
    this.tabOption.position = workArea;
    this.tabOption.state = state;
  }

  onChangePositionType($event: any) {
    const {workArea, state} = calculateCustomWorkArea($event, this.selectedMonitor);
    if (!workArea) {
      return;
    }
    this.tabOption.position = workArea;
    this.tabOption.state = state;
  }
}
