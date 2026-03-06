import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Viho - AI Model CLI Tool',
  description: 'A lightweight CLI tool for interacting with AI models. Access GPT-5, Claude, Gemini, and more from your terminal.',
  appearance: 'dark',
  lang: 'en-US',

  head: [
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'keywords', content: 'viho, AI CLI, GPT, Claude, Gemini, OpenAI, terminal, command line, AI assistant' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Viho - AI Model CLI Tool' }],
    ['meta', { property: 'og:description', content: 'A lightweight CLI tool for interacting with AI models. Access GPT-5, Claude, Gemini, and more from your terminal.' }],
    ['meta', { property: 'og:image', content: 'https://static-small.vincentqiao.com/viho/logo.png' }],
    ['meta', { property: 'og:url', content: 'https://www.viho.fun' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Viho - AI Model CLI Tool' }],
    ['meta', { name: 'twitter:description', content: 'A lightweight CLI tool for interacting with AI models from your terminal.' }],
    ['meta', { name: 'twitter:image', content: 'https://static-small.vincentqiao.com/viho/logo.png' }],
    [
      'script',
      {},
      `(function(c,l,a,r,i,t,y){
        if (window.location.href.indexOf('viho.fun') > -1) {
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        }
      })(window,document,"clarity","script","vrh41itlv8");`,
    ],
  ],

  sitemap: {
    hostname: 'https://www.viho.fun',
    lastmodDateOnly: false,
    transformItems: (items) => {
      return items.map((item) => ({
        ...item,
        changefreq: 'weekly',
        priority: 1,
      }));
    },
  },

  themeConfig: {
    logo: 'https://static-small.vincentqiao.com/viho/logo.png',
    siteTitle: 'viho.fun',

    socialLinks: [{ icon: 'github', link: 'https://github.com/uikoo9/viho' }],
  },
});
