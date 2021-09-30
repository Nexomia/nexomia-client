export default interface Attachment {
  /**
   * Attachment id 
   */
  id: string;

  /**
   * Name of file attached
   */
  name: string;

  /**
   * The attachment's media type
   * https://en.wikipedia.org/wiki/Media_type
   */
  mime_type: string;

  /**
   * Size of file in bytes
   */
  size: number;

  /**
   * Source url of file
   */
  url: string;

  /**
   * Height of file (if image)
   */
  height?: number;

  /**
   * Width of file (if image)
   */
  width?: number;
}