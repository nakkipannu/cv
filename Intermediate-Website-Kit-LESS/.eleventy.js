// Imports
const pluginEleventyNavigation = require("@11ty/eleventy-navigation");
const pluginSitemap = require("@quasibit/eleventy-plugin-sitemap");
const htmlMinifier = require("html-minifier-terser"); // HTML Minifier

// Configs
const configCss = require("./src/config/css");
const configJs = require("./src/config/javascript");
const configSitemap = require("./src/config/sitemap");
const configServer = require("./src/config/server");

// Other
const filterPostDate = require("./src/config/postDate");
const isProduction = configServer.isProduction;

module.exports = function (eleventyConfig) {
    /**=====================================================================
          EXTENSIONS - Recognising non-default languages as templates 
    =======================================================================*/
    /** https://www.11ty.dev/docs/languages/custom/ */

    eleventyConfig.addTemplateFormats("css");
    eleventyConfig.addExtension("css", configCss);

    eleventyConfig.addTemplateFormats("js");
    eleventyConfig.addExtension("js", configJs);

    /**=====================================================================
                  PLUGINS - Adds additional eleventy functionality 
    =======================================================================*/
    /** https://www.11ty.dev/docs/plugins/ */

    eleventyConfig.addPlugin(pluginEleventyNavigation);
    eleventyConfig.addPlugin(pluginSitemap, configSitemap);

    /**=====================================================================
                  TRANSFORMS - Minify HTML output
    =======================================================================*/
    eleventyConfig.addTransform("htmlmin", async function (content, outputPath) {
        if (isProduction && outputPath && outputPath.endsWith(".html")) {
            return htmlMinifier.minify(content, {
                collapseWhitespace: true,
                removeComments: true,
                minifyJS: true,
                minifyCSS: true,
            });
        }
        return content;
    });

    /**======================================================================
       PASSTHROUGHS - Copy source files to /public with no 11ty processing
    ========================================================================*/
    /** https://www.11ty.dev/docs/copy/ */

    eleventyConfig.addPassthroughCopy("./src/assets", {
        filter: [
            "**/*",
            "!**/*.js"
        ]
    });
    eleventyConfig.addPassthroughCopy("./src/admin");
    eleventyConfig.addPassthroughCopy("./src/_redirects");

    /**======================================================================
               FILTERS - Modify data in template files at build time
    ========================================================================*/
    /** https://www.11ty.dev/docs/filters/ */

    eleventyConfig.addFilter("postDate", filterPostDate);

    /**======================================================================
                  SHORTCODES - Output data using JS at build time
    ========================================================================*/
    /** https://www.11ty.dev/docs/shortcodes/ */

    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

    /**=====================================================================
                                SERVER SETTINGS
    =======================================================================*/
    eleventyConfig.setServerOptions(configServer);

    /**=====================================================================
                              END CONFIGURATIONS
    =======================================================================*/

    return {
        dir: {
            input: "src",
            output: "public",
            includes: "_includes",
            data: "_data",
        },
        htmlTemplateEngine: "njk",
    };
};
