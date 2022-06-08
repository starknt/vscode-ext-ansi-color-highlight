'use strict';
import * as vscode from 'vscode';
import { getColorContrast } from './dynamic-contrast';

export class DecorationMap {
  private _map = new Map<string, vscode.TextEditorDecorationType>();
  private _keys: string[] = [];

  get(color: string) {
    if (!this._map.has(color)) {
      let rules: vscode.DecorationRenderOptions = {};

      rules.backgroundColor = color;
      rules.color = getColorContrast(color);
      rules.border = `2px solid ${color}`;
      rules.borderRadius = '2px';
  
      this._map.set(color, vscode.window.createTextEditorDecorationType(rules));
      this._keys.push(color);
    }

    return this._map.get(color);
  }


  keys() {
    return this._keys.slice();
  }

  dispose() {
    this._map.forEach((decoration) => {
      decoration.dispose();
    });
  }
}
