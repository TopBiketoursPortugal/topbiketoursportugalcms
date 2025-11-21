export default {
    image: {
        compress: false,
        srcset_max_width: 1300,  // Max width used in srcset
        max_width: 1300
    },
    css: {
        inline_critical_css: true,
    },
    misc: {
        prefetch_links: 'in-viewport',
    },
    general: {
        browserslist: 'last 5 versions'
    },
    js: {
        compressor: 'swc'
    }
}