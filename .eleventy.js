const rssPlugin = require('@11ty/eleventy-plugin-rss');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const fs = require('fs');
const path = require("path");
const glob = require("glob");
const lodash = require("lodash");

const config = require("./eleventy.config")

// Import filters
const dateFilter = require('./src/filters/date-filter.js');
const markdownFilter = require('./src/filters/markdown-filter.js');
const w3DateFilter = require('./src/filters/w3-date-filter.js');
const sortByOrder = require('./src/filters/sort-by-order.js');
const subNav = require('./src/filters/subNav.js');


// Import data files
const site = require('./src/_data/site.json');


/**
 * Require all necessary files
 * brings in shortcodes / transforms from utils
 */
 const getUtilFiles = () => {
  // Utils directory.
  //const dir = path.join(__dirname, `./src/_includes/shortcodes`)
  const dir = path.join(__dirname, `./src/utils`)
  // Pattern of files to require from the directory.
  const globFilesPattern = path.join(dir, "**/*.js")
  // Pattern of files to ignore from the directory.
  const ignoreFiles = ["**/*.spec.js", "_**/*.js", "**/_*/**/*.js", "**/_*.js"]
  const ignoreFilesPattern = ignoreFiles.map((pattern) => path.join(dir, pattern))
  // Find all relevant files.
  let files = glob.sync(globFilesPattern, { ignore: ignoreFilesPattern })
  // Ensure that they are configured correctly. Remove and log a message for
  // those that are not configured properly.
  files = files.map((file) => {
    // Import the file.
    const module = require(file)
    // If everything looks good, return the module.
    if (typeof lodash.get(module, "default") === "function") return module
    // Otherwise, we have a problem. Gather the appropriate message.
    const error = module.default
      ? `Export "default" must be a function.`
      : `Missing "default" named export.`
    // Log the message.
    console.error(`Could not load ${path.basename(file)}. ${error}`)
    // And return null.
    return null
  })
  // Return all valid imports.
  return files.filter((util) => util)
}


module.exports = function (eleventyConfig) {
  // Filters
  eleventyConfig.addFilter('dateFilter', dateFilter);
  eleventyConfig.addFilter('markdownFilter', markdownFilter);
  eleventyConfig.addFilter('w3DateFilter', w3DateFilter);
  eleventyConfig.addFilter("sortByOrder", sortByOrder);
  eleventyConfig.addFilter("subNav", subNav);

  // Layout aliases
  eleventyConfig.addLayoutAlias('home', 'layouts/home.njk');

  // watch sass
  eleventyConfig.addWatchTarget('src/scss');
  eleventyConfig.addWatchTarget('src/images');
  eleventyConfig.addWatchTarget('dist/img');

  // Passthrough copy
  eleventyConfig.addPassthroughCopy('src/fonts');
  eleventyConfig.addPassthroughCopy('src/js');
  eleventyConfig.addPassthroughCopy('src/images');
  eleventyConfig.addPassthroughCopy('src/served');
  eleventyConfig.addPassthroughCopy('src/admin/config.yml');
  eleventyConfig.addPassthroughCopy('src/admin/previews.js');
  eleventyConfig.addPassthroughCopy('node_modules/nunjucks/browser/nunjucks-slim.js');
  eleventyConfig.addPassthroughCopy('src/robots.txt');

  const now = new Date();

  // Custom collections
  const livePosts = (post) => post.date <= now && !post.data.draft;
  eleventyConfig.addCollection('postFeed', collection => {
    return [...collection.getFilteredByGlob('./src/content/posts/*.md').filter(livePosts)]
      .reverse()
      .slice(0, site.maxPostsPerPage);
  });

    // Custom collections
    const livePostsPortfolio = portfolio => portfolio.date <= now && !portfolio.data.draft;
    eleventyConfig.addCollection('porfolio', collection => {
      return [
        ...collection.getFilteredByGlob('./src/content/pages/work/*.md').filter(livePostsPortfolio)
      ].reverse();
    });
  
    eleventyConfig.addCollection('portfolioFeed', collection => {
      return [...collection.getFilteredByGlob('./src/content/pages/work/*.md').filter(livePostsPortfolio)]
        .reverse()
        .slice(0, site.maxPostsPerPage);
    });


  // import all macros into posts / pages (minus index) so that end user doesn not need to for each page
  eleventyConfig.addCollection('content', (collectionApi) => {
    // Note: Update the path to point to your macro file
    const macroImport = `{% import "macros/macros.njk" as macro with context %}`;
    // Note: Update the pattern below to include all files that need macros imported
    // Note: Collections don’t include layouts or includes, which still require importing macros manually
    let collection = collectionApi.getFilteredByGlob('src/content/**/*.md');
    collection.forEach((item) => {
      item.template.frontMatter.content = `${macroImport}\n${item.template.frontMatter.content}`;
    });
    return collection;
  });

  // Plugins
  eleventyConfig.addPlugin(rssPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);

  // Forestry instant previews
  if (process.env.ELEVENTY_ENV == 'development') {
    eleventyConfig.setBrowserSyncConfig({
      host: '0.0.0.0',
    });
  }

  // 404
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, browserSync) {
        const content_404 = fs.readFileSync('dist/404.html');

        browserSync.addMiddleware('*', (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      },
    },
  });

    // --- Utils --- //
    //
    getUtilFiles().map((util) => util.default(eleventyConfig))
    //
    // --- Return --- //
    //
    // Return the config object. (This is what actually sets the config for
    // Eleventy. It was written above for reference within utils.)
    return config
};
