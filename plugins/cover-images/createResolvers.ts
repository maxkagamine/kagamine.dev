import { CreateResolversArgs } from 'gatsby';
import { FileSystemNode as FileNode } from 'gatsby-source-filesystem';
import path from 'path';

const COVER_NAME = 'cover';

export const createResolvers = ({ createResolvers }: CreateResolversArgs) => createResolvers({
  MarkdownRemark: {
    cover: {
      type: 'File',
      resolve(source: any, args: any, context: any, info: any): FileNode | undefined {
        // Get all png & jpg files adjacent to markdown file
        let dir = path.dirname(source.fileAbsolutePath);
        let files = context.nodeModel.getAllNodes({ type: 'File' }) as FileNode[];
        let images = files.filter(f =>
          path.dirname(f.absolutePath) == dir &&
          ['jpg', 'png'].includes(f.extension));

        // Look for a "cover.{locale}", else "cover"
        let locale = source.fields.locale;
        let cover =
          images.find(f => f.name == `${COVER_NAME}.${locale}`) ??
          images.find(f => f.name == COVER_NAME);

        return cover;
      }
    }
  }
});
