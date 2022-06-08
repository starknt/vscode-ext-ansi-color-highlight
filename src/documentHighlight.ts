import * as vscode from 'vscode';
import { DecorationMap } from './decoration-map';
import { findAnsi8Color } from './strategies/ansi8';
import { ColorRange } from './types';

interface Strategy {
    (text: string): ColorRange[]
}

export class DocumentHighlight {
    disposed: boolean;

    document: vscode.TextDocument | null;

    decorations!: DecorationMap;

    strategies: Strategy[];

    listener!: vscode.Disposable | null;

  constructor(document: vscode.TextDocument) {
    this.disposed = false;

    this.document = document;
    this.strategies = [findAnsi8Color];

    this.initialize();
  }

  initialize() {
    this.decorations = new DecorationMap();

    this.listener = vscode.workspace.onDidChangeTextDocument(
      ({ document }) => this.onUpdate(document)
    );
  }

  onUpdate(document = this.document) {
    if (
      this.disposed ||
      this.document?.uri.toString() !== document?.uri.toString()
    ) {
      return;
    }

    const text = this.document?.getText();
    const version = this.document?.version.toString();

    return this.updateRange(text!, version!);
  }

  async updateRange(text: string, version: string) {
    try {
      const result = await Promise.all(this.strategies.map((fn) => fn(text)));

      const actualVersion = this.document?.version.toString();
      if (actualVersion !== version) {
        return;
      }

      let colorRanges = groupByColor(concatAll(result));

      if (this.disposed) {
        return false;
      }

       const updateStack = this.decorations.keys().reduce((state: Record<string | number, any>, color) => {
        state[color] = [];
        return state;
      }, {});

      for (const color in colorRanges) {
        updateStack[color] = colorRanges[color].map((item: ColorRange) => {
          return new vscode.Range(
            this.document!.positionAt(item.start),
            this.document!.positionAt(item.end)
          );
        });
      }

      for (const color in updateStack) {
        const decoration = this.decorations.get(color)!;

        vscode.window.visibleTextEditors
          .filter(({ document }) => document!.uri === this.document!.uri)
          .forEach((editor) =>
            editor.setDecorations(decoration, updateStack[color])
          );
      }
    } catch (error) {
      console.error(error);
    }
  }

  dispose() {
    this.disposed = true;
    this.decorations.dispose();
    this.listener!.dispose();

    // @ts-ignore
    this.decorations = null;
    this.document = null;
    this.listener = null;
  }
}

function groupByColor<T>(results: ColorRange[]) {
  return results.reduce((collection, item) => {
    if(!item.color) {return collection;};

    if (!collection[item.color]) {
      collection[item.color] = [];
    }

    collection[item.color].push(item);

    return collection;
  }, {} as Record<string | number, any>);
}

function concatAll<T>(arr: T[][]) {
  return arr.reduce((result, item) => result.concat(item), []);
}
