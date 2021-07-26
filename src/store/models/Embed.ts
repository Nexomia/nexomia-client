export default interface Embed {
  /**
   * Title of embed
   */
  title?: string;

  /**
   * Type of embed (always "rich" for webhook embeds)
   * @rich - generic embed rendered from embed attributes
   * @image - image embed
   * @video - video embed
   * @gifv - animated gif image embed rendered as a video embed
   * @article - article embed
   * @link -	link embed
   * !!! Embed types should be considered deprecated and might be removed in a future API version. !!!
   */
  type?: 'rich' | 'image' | 'video' | 'gifv' | 'article' | 'link';

  /**
   * Description of embed
   */
  description?: string;

  /**
   * Url of embed
   */
  url?: string;

  /**
   * Timestamp of embed content
   */
  timestamp?: number;

  /**
   * Color code of the embed
   */
  color?: number;

  /**
   * Footer information
   */
  //footer?: EmbedFooter;

  /**
   * Image information
   */
  //image?: EmbedImage;

  /**
   * Thumbnail information
   */
  //thumbnail?: EmbedThumbnail;

  /**
   * Video information
   */
  //video?: EmbedVideo;

  /**
   * Provider information
   */
  //provider?: EmbedProvider;

  /**
   * Author information
   */
  //author?: EmbedAuthor;

  /**
   * Fields information
   */
  //fields?: EmbedField[];
}
