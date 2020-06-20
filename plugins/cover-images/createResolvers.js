const path = require('path');

const COVER_NAME = 'cover';

module.exports = ({ createResolvers }) => createResolvers({
  MarkdownRemark: {
    cover: {
      type: 'File',
      resolve(source, args, context, info) {
        // Get all png & jpg files adjacent to markdown file
        let dir = path.dirname(source.fileAbsolutePath);
        let files = context.nodeModel.getAllNodes({ type: 'File' });
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
