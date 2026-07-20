import { google } from 'googleapis';
import fs from 'fs';

// Get the files from the command line argument (passed as a single space-separated string from tj-actions/changed-files)
const changedFilesStr = process.argv[2];
if (!changedFilesStr) {
  console.log('No changed files provided.');
  process.exit(0);
}

const changedFiles = changedFilesStr.split(' ').filter(f => f.trim() !== '');

// Filter for markdown files in src/content/blog/
const blogFiles = changedFiles.filter(f => f.startsWith('src/content/blog/') && f.endsWith('.md'));

if (blogFiles.length === 0) {
  console.log('No new blog posts to index.');
  process.exit(0);
}

// Map files to URLs
const baseUrl = 'https://www.navokit.com';
const urls = blogFiles.map(file => {
  // e.g., src/content/blog/en/my-post.md -> /en/blog/my-post
  const parts = file.split('/');
  const lang = parts[3]; // 'en' or 'zh'
  const filename = parts[parts.length - 1].replace('.md', '');
  return `${baseUrl}/${lang}/blog/${filename}`;
});

console.log('📝 URLs to submit:', urls);

// Initialize Google Indexing API
const serviceAccountKey = process.env.GCP_SA_KEY;

if (!serviceAccountKey) {
  console.error('❌ Missing GCP_SA_KEY environment variable! Make sure it is set in GitHub Secrets.');
  process.exit(1);
}

let credentials;
try {
  credentials = JSON.parse(serviceAccountKey);
} catch (error) {
  console.error('❌ Failed to parse GCP_SA_KEY. Ensure it is a valid JSON string.', error);
  process.exit(1);
}

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GCP_SA_KEY),
  scopes: ['https://www.googleapis.com/auth/indexing'],
});

const indexing = google.indexing({ version: 'v3', auth });

async function submitUrls() {
  let successCount = 0;
  let hasError = false;
  
  for (const url of urls) {
    try {
      const res = await indexing.urlNotifications.publish({
        requestBody: {
          url: url,
          type: 'URL_UPDATED',
        },
      });
      console.log(`✅ Successfully submitted: ${url} (Status: ${res.status})`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to submit ${url}:`, error.message);
      hasError = true;
    }
  }
  
  console.log(`🎉 Finished. Successfully submitted ${successCount}/${urls.length} URLs to Google.`);
  
  if (hasError) {
    process.exit(1);
  }
}

submitUrls();
