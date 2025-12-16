# viho-expert

Internal tool for downloading and managing expert resources for the viho CLI.

## Description

This is a private package used internally by the viho project to download expert resources (such as documentation, guides, etc.) from external sources. These resources are used to enhance the AI models' context and capabilities.

**Note:** This package is not published to npm and is for internal development use only.

## Usage

Update expert resources:

```bash
npm run expert:update
```

This will download the latest versions of configured expert resources to the main viho package.

## Dependencies

- [qiao-downloader](https://www.npmjs.com/package/qiao-downloader) - File download utility

## License

MIT
