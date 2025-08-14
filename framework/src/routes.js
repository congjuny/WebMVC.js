//

// this was part of router.js
// moved to a separate file so that if can be loaded only when needed
// otherwise, an app not using the router would still need to define the @pages alias in vite.config.js
export const modules = import.meta.glob("@pages/**/page.jsx");
