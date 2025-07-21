## How to publish and use:

1. **Create the package:**
   ```bash
   mkdir create-web-mvc-app
   cd create-web-mvc-app
   # Create all the files above
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Test locally:**
   ```bash
   npm link
   create-web-mvc-app test-project
   ```

4. **Publish to npm:**
   ```bash
   npm publish
   ```

5. **Use the published package:**
   ```bash
   npx create-web-mvc-app my-awesome-app
   cd my-awesome-app
   npm start
   ```

## Features:

- ✅ Interactive CLI with help and version commands
- ✅ Template-based file generation
- ✅ Automatic dependency installation
- ✅ Git repository initialization
- ✅ Error handling and validation
- ✅ Colored output for better UX
- ✅ Skip options (--no-install, --no-git)
- ✅ Complete project structure with README

