const rssPlugin = require('@11ty/eleventy-plugin-rss');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const fs = require('fs');

// Import filters
const dateFilter = require('./src/filters/date-filter.js');
const markdownFilter = require('./src/filters/markdown-filter.js');
const w3DateFilter = require('./src/filters/w3-date-filter.js');

// Import transforms
const htmlMinTransform = require('./src/transforms/html-min-transform.js');
const parseTransform = require('./src/transforms/parse-transform.js');

// Import data files
const site = require('./src/_data/site.json');

module.exports = function(config) {
  // Filters
  config.addFilter('dateFilter', dateFilter);
  config.addFilter('markdownFilter', markdownFilter);
  config.addFilter('w3DateFilter', w3DateFilter);

  // Layout aliases
  config.addLayoutAlias('home', 'layouts/home.njk');

  // Transforms
  config.addTransform('htmlmin', htmlMinTransform);
  config.addTransform('parse', parseTransform);

  // watch sass
  config.addWatchTarget('src/scss');

  // Passthrough copy
  config.addPassthroughCopy('src/fonts');
  config.addPassthroughCopy('src/images');
  config.addPassthroughCopy('src/js');
  config.addPassthroughCopy('src/admin/config.yml');
  config.addPassthroughCopy('src/admin/previews.js');
  config.addPassthroughCopy('node_modules/nunjucks/browser/nunjucks-slim.js');
  config.addPassthroughCopy('src/robots.txt');

  const now = new Date();

  // Custom collections
  const livePosts = post => post.date <= now && !post.data.draft;
  config.addCollection('posts', collection => {
    return [
      ...collection.getFilteredByGlob('./src/content/posts/*.md').filter(livePosts)
    ].reverse();
  });

  config.addCollection('postFeed', collection => {
    return [...collection.getFilteredByGlob('./src/content/posts/*.md').filter(livePosts)]
      .reverse()
      .slice(0, site.maxPostsPerPage);
  });


    // import all macros into posts / pages (minus index) so that end user doesn not need to for each page
  config.addCollection('content', (collectionApi) => {
    // Note: Update the path to point to your macro file
    const macroImport = `{% import "macros/macros.njk" as macro with context %}`;
    // Note: Update the pattern below to include all files that need macros imported
    // Note: Collections don’t include layouts or includes, which still require importing macros manually
    let collection = collectionApi.getFilteredByGlob('src/content/**/*.md');
    collection.forEach((item) => {
      item.template.frontMatter.content = `${macroImport}\n${item.template.frontMatter.content}`
    })
    return collection;
  })

  // Plugins
  config.addPlugin(rssPlugin);
  config.addPlugin(syntaxHighlight);
  
  // Forestry instant previews 
  if( process.env.ELEVENTY_ENV == "dev" ) {
    eleventyConfig.setBrowserSyncConfig({
      host: "0.0.0.0"
    });
  }

  // 404
  config.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, browserSync) {
        const content_404 = fs.readFileSync('dist/404.html');

        browserSync.addMiddleware('*', (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      }
    }
  });

  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true
  };
};
