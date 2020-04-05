import { promises } from 'fs';
import { resolve, basename, dirname, join } from 'path';
import { homedir } from 'os';
import { generate } from 'shortid';

import App from '@main/lib/App';
import Document from '@main/lib/Document';

import {
  ContentType,
  ProjectMetadata,
  ProcessedProject,
  ProcessResult
} from '@common/types';
import { parse } from 'jsonc-parser';
import { SASS, Markdown, JSONC } from '@main/processors';
import { variables, document, markwright, defaults } from '@main/util/theme';

export interface SerializedProject {
  [ContentType.CONTENT]: string;
  [ContentType.STYLES]: string;
  [ContentType.METADATA]: string;
  version: string | null;
}

export interface ProjectInfo {
  filename: string;
  filepath: string;
  directory: string;
  version: string | null;
  id: string;
}

const EMPTY: SerializedProject = {
  [ContentType.CONTENT]: '',
  [ContentType.STYLES]: '@import "markwright";',
  [ContentType.METADATA]: JSON.stringify(defaults, null, 2),
  version: null
};

export default class Project {
  public static async from(filename?: string): Promise<Project> {
    let p = new Project(join(homedir(), 'Untitled.mw'));
    if (filename) {
      const file = await promises.readFile(filename, 'utf8');
      p = new Project(filename, parse(file));
    }
    await p.initialize();
    return p;
  }

  public app!: App;
  public id: string = generate();

  public documents!: {
    [ContentType.CONTENT]: Document<string>;
    [ContentType.STYLES]: Document<string>;
    [ContentType.METADATA]: Document<ProjectMetadata>;
  };

  public processors!: {
    [ContentType.CONTENT]: Markdown;
    [ContentType.STYLES]: SASS;
    [ContentType.METADATA]: JSONC;
  };

  public directory: string;
  public filename: string;
  public version: string | null = null;

  public fileExists = false;

  public get theme(): {
    document: string;
    variables: string;
    markwright: string;
  } {
    return {
      document: document(),
      markwright: markwright(),
      variables: variables(this.valueOf(ContentType.METADATA))
    };
  }

  public get hasChanges(): boolean {
    return Object.values(this.documents).some(doc => doc.isChanged);
  }

  public get isProcessing(): boolean {
    return Object.values(this.documents).some(doc => doc.isProcessing);
  }

  public get filepath(): string {
    return resolve(this.directory, this.filename);
  }

  public valueOf<T extends ContentType>(type: T): ProcessedProject[T] {
    return this.documents[type].value as ProcessedProject[T];
  }

  public contentOf(type: ContentType): string {
    return this.documents[type].content;
  }

  public async update<T extends ContentType>(
    type: T,
    content: string
  ): Promise<ProcessResult<T>> {
    this.documents[type].content = content;
    const res = (await this.processors[type].process(content)) as $AnyFixMe;
    return (this.documents[type].result = res);
  }

  public toContent(): SerializedProject {
    return {
      [ContentType.CONTENT]: this.contentOf(ContentType.CONTENT),
      [ContentType.METADATA]: this.contentOf(ContentType.METADATA),
      [ContentType.STYLES]: this.contentOf(ContentType.STYLES),
      version: this.app.version
    };
  }

  public toResults(): $AnyFixMe {
    return {
      [ContentType.CONTENT]: this.valueOf(ContentType.CONTENT),
      [ContentType.METADATA]: this.valueOf(ContentType.METADATA),
      [ContentType.STYLES]: this.valueOf(ContentType.STYLES),
      version: this.app.version
    };
  }

  public async toPDF(): Promise<Buffer | null> {
    // Find better way of getting preview window
    return null;
    /*const wc = this.app.contents.preview;
    if (wc) {
      const meta = this.valueOf(ContentType.METADATA);
      const print = promisify(wc.printToPDF.bind(wc));
      return print({
        marginsType: 1,
        // @todo non-standard page sizes?
        pageSize: typeof meta.paper === 'string' ? meta.paper : 'letter',
        printBackground: true
      });
    } else {
      return null;
    }*/
  }

  public async save(saveAs?: string): Promise<void> {
    const content = this.toContent();

    // set new filename
    if (saveAs) {
      this.directory = dirname(saveAs);
      this.filename = basename(saveAs);
    }

    await promises.writeFile(
      saveAs || this.filepath,
      JSON.stringify(content),
      'utf8'
    );

    // confirm the project exists as a file on disk
    this.fileExists = true;
    // regenerate content with new initial values
    this.createDocuments(content);
    await this.initialize();
  }

  protected createProcessors(): void {
    this.processors = {
      [ContentType.CONTENT]: new Markdown(this),
      [ContentType.STYLES]: new SASS(this),
      [ContentType.METADATA]: new JSONC(this)
    };
  }

  protected createDocuments(project: SerializedProject): void {
    this.documents = {
      [ContentType.CONTENT]: Document.from(this, project[ContentType.CONTENT]),
      [ContentType.STYLES]: Document.from(this, project[ContentType.STYLES]),
      [ContentType.METADATA]: Document.from<ProjectMetadata>(
        this,
        project[ContentType.METADATA]
      )
    };
  }

  public async initialize(): Promise<void> {
    const content = [
      // order matters, we need metadata to calculate styles
      ContentType.METADATA,
      ContentType.STYLES,
      ContentType.CONTENT
    ];
    for (const type of content) {
      const document = this.documents[type];
      await this.update(type, document.content);
    }
  }

  public constructor(filename: string, project?: SerializedProject) {
    const data = project ?? EMPTY;
    this.fileExists = !!project;
    this.filename = basename(filename);
    this.directory = dirname(filename);
    this.version = data.version;
    this.createDocuments(data);
    this.createProcessors();
  }
}
