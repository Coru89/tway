const config = require("../../../eleventy.config")
const Image = require("@11ty/eleventy-img");

exports.imageShortCode = (src, alt, cls, loading, sizes, widths) => {
    let options = {
      widths: widths,
      formats: ['webp', 'jpeg'],
      outputDir: "./src/served",
      urlPath: "/served",
      useCache: true
    };

    // generate images, while this is async we don’t wait
    Image(`./src/${src}`, options);

    let imageAttributes = {
      alt,
      cls,
      sizes,
      loading,
      widths
    };

    !imageAttributes.alt ? imageAttributes.alt = '' : imageAttributes.alt;
    !imageAttributes.cls ? imageAttributes.cls = '' : imageAttributes.cls;


    // get metadata even the images are not fully generated
    let metadata = Image.statsSync(`./src/${src}`, options);
    return Image.generateHTML(metadata, imageAttributes);
  }

/**
 * Add shortcode for reading SVG files.
 *
 * @param {object} eleventyConfig Eleventy's configuration object
 */
  exports.default = (eleventyConfig) => {
    eleventyConfig.addShortcode("image", (src, alt, cls, loading, sizes, widths) => exports.imageShortCode(src, alt, cls, loading, sizes, widths))
  }
