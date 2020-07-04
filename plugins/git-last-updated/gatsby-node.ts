import { CreateResolversArgs } from 'gatsby';
import path from 'path';
import simpleGit, { SimpleGit } from 'simple-git';

// NOTE: For GitHub Actions, actions/checkout's fetch-depth must be set to 0
// else all files will appear to have been updated in the most recent commit

// Amount of time since the date in the frontmatter that must pass before a new
// commit is considered an update from the original worth indicating
const COOLDOWN = 30 * 24 * 60 * 60 * 1000;

const git: SimpleGit = simpleGit();

export const createResolvers = ({ createResolvers }: CreateResolversArgs) => createResolvers({
  MarkdownRemark: {
    lastUpdated: {
      type: 'Date',
      async resolve(source: MarkdownRemark): Promise<string | undefined> {
        // Get the git log
        let file = path.relative(process.cwd(), source.fileAbsolutePath);
        let log = await git.log({ file, n: 1, '--no-show-signature': null });

        // Log will be empty if file hasn't yet been committed
        if (log.latest == null) {
          return undefined;
        }

        // Get the last commit date
        let commitDate = log.latest.date;

        // Don't show an updated date if within the cooldown period
        let publishedDate = source.frontmatter?.date;
        if (publishedDate &&
            new Date(commitDate).getTime() - new Date(publishedDate).getTime() < COOLDOWN) {
          return undefined;
        }

        return commitDate;
      }
    }
  }
});

interface MarkdownRemark {
  fileAbsolutePath: string;
  frontmatter?: {
    date?: string;
  }
}
