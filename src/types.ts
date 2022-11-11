import * as vscode from 'vscode';

export interface ColorRange {
    start: number
    end: number
    color: string
    decoration?: vscode.TextEditorDecorationType
}
