import { Octokit } from '@octokit/rest';

let connectionSettings;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function getGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

async function createRepository() {
  try {
    const octokit = await getGitHubClient();
    
    // Get authenticated user
    const { data: user } = await octokit.rest.users.getAuthenticated();
    console.log(`✓ Authenticated as: ${user.login}`);
    
    // Create repository
    const repoName = 'overnight-react';
    const { data: repo } = await octokit.rest.repos.createForAuthenticatedUser({
      name: repoName,
      description: 'Fintech web application for managing overnight extra income with Firebase, Stripe, and PWA capabilities',
      private: false,
      auto_init: false,
    });
    
    console.log(`\n✓ Repository created successfully!`);
    console.log(`\n📦 Repository Details:`);
    console.log(`   Name: ${repo.name}`);
    console.log(`   URL: ${repo.html_url}`);
    console.log(`   Clone URL: ${repo.clone_url}`);
    console.log(`   SSH URL: ${repo.ssh_url}`);
    
    console.log(`\n🚀 Next Steps:`);
    console.log(`\n1. Add the remote (if not already added):`);
    console.log(`   git remote add origin ${repo.clone_url}`);
    console.log(`\n2. Stage all files:`);
    console.log(`   git add .`);
    console.log(`\n3. Commit your changes:`);
    console.log(`   git commit -m "Initial commit: Overnight React fintech app with tests"`);
    console.log(`\n4. Push to GitHub:`);
    console.log(`   git push -u origin main`);
    console.log(`\n   (or if your branch is 'master': git push -u origin master)`);
    
    return repo;
  } catch (error) {
    if (error.status === 422) {
      console.error(`\n❌ Repository 'overnight-react' already exists!`);
      console.error(`\nOptions:`);
      console.error(`1. Delete the existing repo on GitHub and run this script again`);
      console.error(`2. Use a different name by modifying the 'repoName' variable in this script`);
      console.error(`3. Push to the existing repository directly`);
    } else {
      console.error('Error creating repository:', error.message);
      if (error.response) {
        console.error('Response:', error.response.data);
      }
    }
    throw error;
  }
}

// Run the script
createRepository().catch(console.error);
