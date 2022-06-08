import * as vscode from 'vscode';
import { DocumentHighlight } from './documentHighlight';

let instances:any[]	= [];

export function activate(context: vscode.ExtensionContext) {
	vscode.window.onDidChangeVisibleTextEditors(onOpenEditor, null, context.subscriptions);

	onOpenEditor(vscode.window.visibleTextEditors);
}

export function deactivate() {
	instances.forEach((instance) => instance.dispose());
  	instances = [];
}

async function findOrCreateInstance(document: any) {
  if (!document) {
    return;
  }

  const found = instances.find(({ document: refDoc }) => refDoc === document);

  if (!found) {
    const instance = new DocumentHighlight(document);
    instances.push(instance);
  }

  return found || instances[instances.length - 1];
}

async function doHighlight(documents: vscode.TextDocument[] = []) {
  if (documents.length) {
    const instances = await Promise.all(documents.map(findOrCreateInstance));

    return instances.map(instance => instance.onUpdate());
  }
}


function onOpenEditor(editors: readonly vscode.TextEditor[]) {
  const documents = editors.map(({ document }) => document);
  const forDisposal = instances.filter(({ document }) => documents.indexOf(document) === -1);
  instances = instances.filter(({ document }) => documents.indexOf(document) > -1);

  forDisposal.forEach(instance => instance.dispose());

  doHighlight(documents);
}