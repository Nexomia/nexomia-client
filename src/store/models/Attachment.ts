export default interface Attachment {
  /**
   * Attachment id 
   */
  id: string;

  /**
   * Name of file attached
   */
  filename: string;

  /**
   * The attachment's media type
   * https://en.wikipedia.org/wiki/Media_type
   */
  content_type?: string;

  /**
   * Size of file in bytes
   */
  size: number;

  /**
   * Source url of file
   */
  url: string;
  
  /**
   * A proxied url of file
   */
  proxy_url: string;

  /**
   * Height of file (if image)
   */
  height?: number;

  /**
   * Width of file (if image)
   */
  width?: number;
}