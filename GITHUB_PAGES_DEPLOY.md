# Deploy Frontend to GitHub Pages

This guide will help you deploy your frontend to GitHub Pages.

## Option 1: Using GitHub Actions (Recommended - Automatic)

### Step 1: Enable GitHub Pages

1. Go to your repository: `https://github.com/Tarunthegeek/webgallery`
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Save

### Step 2: Set Backend API URL (Optional)

If your backend is deployed, set the API URL:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `VITE_API_URL`
4. Value: Your backend API URL (e.g., `https://your-backend.vercel.app/api`)
5. Click **Add secret**

### Step 3: Push Your Code

The GitHub Actions workflow will automatically deploy when you push to `main`:

```powershell
git add .
git commit -m "Add GitHub Pages deployment"
git push origin main
```

### Step 4: Wait for Deployment

1. Go to **Actions** tab in your repository
2. Wait for the workflow to complete (usually 2-3 minutes)
3. Your site will be live at: `https://tarunthegeek.github.io/webgallery/`

---

## Option 2: Manual Deployment using gh-pages

### Step 1: Install gh-pages

```powershell
cd frontend
npm install --save-dev gh-pages
```

### Step 2: Update API URL

Create `frontend/.env.production`:

```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

Replace with your actual backend URL.

### Step 3: Build and Deploy

```powershell
cd frontend
npm run deploy
```

This will:
1. Build your frontend
2. Deploy to `gh-pages` branch
3. Make it available on GitHub Pages

### Step 4: Enable GitHub Pages

1. Go to repository **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Branch: `gh-pages`
4. Folder: `/ (root)`
5. Click **Save**

Your site will be live at: `https://tarunthegeek.github.io/webgallery/`

---

## Important Notes

1. **Backend URL**: Make sure to set `VITE_API_URL` to your deployed backend URL (not `localhost:5000`)

2. **Base Path**: The vite config is set to `/webgallery/` for GitHub Pages. If your repo name is different, update `vite.config.js`:
   ```js
   base: '/your-repo-name/'
   ```

3. **CORS**: Make sure your backend allows requests from `https://tarunthegeek.github.io`

4. **Image URLs**: If using local backend, images won't work on GitHub Pages. You need to deploy the backend too (Vercel, Render, etc.)

---

## Troubleshooting

### Images not loading
- Make sure backend is deployed and accessible
- Check CORS settings on backend
- Verify `VITE_API_URL` is set correctly

### 404 errors
- Check the base path in `vite.config.js` matches your repo name
- Make sure GitHub Pages is enabled in repository settings

### API calls failing
- Verify backend URL is correct
- Check browser console for CORS errors
- Ensure backend is running and accessible

