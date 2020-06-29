import { CreateIcoOptions } from 'create-ico';

export interface FaviconIcoOptions extends CreateIcoOptions {
  /**
   * The input image path.
   */
  icon: string;
}

export interface InternalFaviconIcoOptions extends FaviconIcoOptions {
  hash: string;
}
