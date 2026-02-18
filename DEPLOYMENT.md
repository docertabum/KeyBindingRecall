# GitHub Actions CI/CD

This project uses GitHub Actions to automatically build and release the application when changes are merged to the main branch.

## Workflow

The `.github/workflows/build-and-release.yml` workflow:

1. **Triggers**: Automatically on push to `main` branch or manual dispatch
2. **Builds**: Runs on macOS latest
3. **Installs**: Node.js 20 and all dependencies
4. **Builds**: Creates DMG using `npm run build`
5. **Releases**: Creates GitHub release with version tag and attaches DMG file

## Automatic Release Process

When you push to `main`:
1. Workflow automatically starts
2. Builds the DMG file
3. Extracts version from `package.json`
4. Creates/updates GitHub release `v{version}` with DMG attachment
5. Users can download DMG from Releases page

## Manual Release

You can also trigger a build manually:
1. Go to **Actions** tab in GitHub
2. Select **Build and Release** workflow
3. Click **Run workflow** button

## Requirements

No additional setup required - workflow uses `GITHUB_TOKEN` automatically provided by GitHub Actions.

## Release Notes

Releases are automatically tagged with:
- **Tag**: `v{version}` from package.json
- **Title**: `KeyBindingRecall v{version}`
- **Files**: All DMG files from `dist/` folder
- **Notes**: Auto-generated (can customize in workflow)
