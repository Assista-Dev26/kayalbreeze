import { defineConfig } from 'astro/config';

// Static output with page.html files, so existing links and enquiry.php's
// redirect to contact.html keep working on the Apache/PHP host.
export default defineConfig({
  build: { format: 'file' },
  trailingSlash: 'never',
});
