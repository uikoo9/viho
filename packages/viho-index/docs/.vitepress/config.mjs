import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Viho - AI Model CLI Tool',
  description: 'A lightweight CLI tool for interacting with AI models. Access GPT-5, Claude, Gemini, and more from your terminal.',
  appearance: 'dark',
  lang: 'en-US',

  head: [
    ['link', { rel: 'icon', href: 'https://static-small.vincentqiao.com/viho/logo.png' }],
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
  ],

  sitemap: {
    hostname: 'https://www.viho.fun'
  },

  themeConfig: {
    logo: 'https://static-small.vincentqiao.com/viho/logo.png',
    siteTitle: 'viho.fun',

    socialLinks: [{ icon: 'github', link: 'https://github.com/uikoo9/viho' }],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present uikoo9',
    },
  },
});
