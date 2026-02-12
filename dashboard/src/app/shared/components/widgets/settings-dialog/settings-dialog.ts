import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { WidgetSettings } from '@core/types/widgets';
import { TranslateModule } from '@ngx-translate/core';

export interface SettingsDialogData {
  settingsList: WidgetSettings;
  currentSettings: Record<string, any>;
  widgetTitle: string;
}

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.html',
  styleUrl: './settings-dialog.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    TranslateModule
  ]
})
export class SettingsDialog {
  readonly dialogRef = inject(MatDialogRef<SettingsDialog>);
  readonly data = inject<SettingsDialogData>(MAT_DIALOG_DATA);

  // mutable copy of settings
  settings: Record<string, any>;

  constructor() {
    this.settings = { ...(this.data.currentSettings || {}) };

    // Set default values for settings that are not defined by the user
    for (const [key, def] of Object.entries(this.data.settingsList)) {
      if (this.settings[key] === undefined && def.defaultValue !== undefined) {
        this.settings[key] = def.defaultValue;
      }
    }
  }

  isOptionList(settingDef: any): boolean {
    return Array.isArray(settingDef);
  }

  asOptionList(settingDef: any): string[] {
    return settingDef as string[];
  }

  save() {
    this.dialogRef.close(this.settings);
  }

  cancel() {
    this.dialogRef.close();
  }
}
