module.exports = {
   markdownTemplateEngine: 'njk',
   teplateFormats: ['html', 'njk', 'md', 'js'],
   dir: {
    input: 'src',
    includes: '_includes',
    data: '_data',
    output: 'dist'
  }
}
