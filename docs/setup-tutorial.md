# Fork, configure, and publish your own Semantic Scroll site

This tutorial walks you through creating your own repository, wiring it to the upstream repo so you can pull updates later, and configuring the site to publish to GitHub Pages. The end state is a site you control, with your content kept separate from upstream changes.

## Step 1: Create your own repository

You have two workable paths. A fork is the simplest because GitHub handles the upstream relationship. A new repository avoids the “fork” label and gives you a blank history on your account. Either path results in a separate repo under your control.

### Option A: Fork in the GitHub UI

Open https://github.com/jhlagado/semantic-scroll and click **Fork**. GitHub creates a new repository under your account. You now have a separate copy that you can change and publish.

### Option B: Clone and push to a new repository

Create a new empty repository on GitHub. Then clone this repo and push it to your new remote. If you are new to Git, this is a little more typing, but it keeps the new repo independent from GitHub’s fork relationship.

```sh
git clone https://github.com/jhlagado/semantic-scroll.git my-blog
cd my-blog

git remote remove origin

git remote add origin git@github.com:YOUR-USERNAME/YOUR-REPO.git

git push -u origin main
```

## Step 2: Clone your repository locally

If you used the fork path, clone your fork. If you used the new repo path, you already have the repo locally.

```sh
git clone git@github.com:YOUR-USERNAME/YOUR-REPO.git
cd YOUR-REPO
```

## Step 3: Wire the upstream remote

The helper script sets an `upstream` remote that points to the original Semantic Scroll repository and fetches the latest changes. Run this once inside your repo.

```sh
npm run init
```

If you want to see or edit the upstream URL, run `git remote -v` and update it manually. The helper is just a shortcut.

## Step 4: Create your own instance directory and site config

Your site lives under `content/<contentDir>/`. This repo ships with the reference instance in `content/semantic-scroll/`. For your own blog, create a new instance directory so upstream updates do not collide with your templates or posts.

Start by copying the example site config, then pick a new `contentDir` value that matches the directory you will create.

```sh
cp site-config.example.json site-config.json
```

Open `site-config.json` and change the values for your site name, URL, author, and `contentDir`. The `contentDir` value must match the directory name you are about to create.

Next, copy the reference instance to your new instance directory. Replace `my-blog` with whatever you set in `contentDir`.

```sh
cp -R content/semantic-scroll content/my-blog
```

Now open `content/my-blog/site.json` and replace the site name, description, author, and URL values. This file controls the metadata used by the build.

If you do not want the reference posts, remove the dated folders inside `content/my-blog/` and add your own posts. Keep the directory structure intact so the build scripts can find them.

## Step 5: Update GitHub Pages settings and site URLs

This repository includes a GitHub Actions workflow that builds and publishes to GitHub Pages on every push to `main`. You still need to tell GitHub to serve Pages from Actions.

Open **Settings → Pages** in your repository and select **GitHub Actions** as the source. The next push to `main` will trigger a build and deploy.

The workflow file also sets a `SITE_URL` environment variable that should match your public site URL. Open `.github/workflows/deploy-pages.yml` and change the value in the build step. Use the GitHub Pages URL for your repo, or your custom domain if you have one configured.

Make sure the `siteUrl` field in `site-config.json` and the `siteUrl` inside `content/my-blog/site.json` match the same public URL. That value is used for canonical links, feeds, and sitemap entries.

## Step 6: Build locally, commit, and push

Install dependencies, build the site, then commit your changes and push them to your repository.

```sh
npm install
npm run build

git add site-config.json content/my-blog .github/workflows/deploy-pages.yml

git commit -m "Set up my site instance"

git push
```

Once GitHub Actions completes, your site will be live at the Pages URL listed in the workflow run. You can always rebuild and push when you add new posts or templates.

## Keeping your site up to date with upstream changes

When you want the latest fixes and features from the original repo, run the update script. It fetches from the upstream remote and merges updates into your `main` branch.

```sh
npm run update
```

Conflicts are uncommon because your content lives in `content/<contentDir>/`, but they can happen if you have edited shared files such as scripts or workflow settings. Resolve conflicts the same way you would for any Git merge, then commit the result.

## Ideas to make this flow easier

There are a few places where the setup could be friendlier for non-technical users. One way forward is to add a short script that asks for the site name, URL, and content directory, then copies the instance folder and updates `site-config.json` and `site.json` in one pass. Another small improvement would be a GitHub template repository that avoids the fork label while still including the upstream remote helper. A third option is a short “first run” checklist in the README with the exact fields to edit and the GitHub Pages setting to flip, so that users do not need to hunt in several documents.
