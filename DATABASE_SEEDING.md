# Database Seeding Guide

This guide explains how to populate your AI Learning Curve database with initial content (learning paths and resources).

## When to Run the Seed Script

Run the seed script **after** you've deployed the application and run database migrations (`pnpm db:push`). The seed script will populate your empty database with:

- 5 Learning Paths (AI Fundamentals, Machine Learning, Deep Learning, NLP, Computer Vision)
- 8 Resources (articles, tutorials, videos, documentation)

## Running the Seed Script

### Option 1: Inside Docker Container (Recommended for Production)

If you're running the application in Docker on your Plesk server:

```bash
# SSH into your server
ssh root@your-server.com

# Navigate to your project directory
cd /var/www/vhosts/theailearningcurve.com/httpdocs

# Run the seed script inside the container
docker exec -it ai-learning-curve node seed-db.mjs
```

### Option 2: Directly on Server (If not using Docker)

If you're running the application directly on the server:

```bash
# SSH into your server
ssh root@your-server.com

# Navigate to your project directory
cd /var/www/vhosts/theailearningcurve.com/httpdocs

# Run the seed script
node seed-db.mjs
```

### Option 3: Local Development

If you're running locally:

```bash
# Make sure DATABASE_URL is set in your .env file
node seed-db.mjs
```

## Expected Output

When the seed script runs successfully, you should see:

```
🌱 Starting database seeding...

📚 Seeding learning paths...
✅ Seeded 5 learning paths

📖 Seeding resources...
✅ Seeded 8 resources

🎉 Database seeding completed successfully!

You can now visit your application to see the learning paths and resources.
```

## Verifying the Seed

After running the seed script:

1. Visit your website at https://theailearningcurve.com
2. Click on "Learning Paths" in the navigation
3. You should see 5 learning path cards displayed
4. Click on "Resources" in the navigation
5. You should see 8 resources listed

## Re-running the Seed Script

The seed script uses `ON DUPLICATE KEY UPDATE` to avoid creating duplicate entries. You can safely re-run the script multiple times - it will update existing entries rather than creating duplicates.

## Customizing the Content

To customize the learning paths and resources:

1. Edit the `seed-db.mjs` file
2. Modify the `learningPathsData` and `resourcesData` arrays
3. Re-run the seed script

## Troubleshooting

### Error: DATABASE_URL environment variable is not set

Make sure your `.env` file exists and contains a valid `DATABASE_URL`:

```env
DATABASE_URL=mysql://user:password@host:3306/database_name
```

### Error: Table doesn't exist

Run the database migrations first:

```bash
docker exec -it ai-learning-curve pnpm db:push
```

### Error: Connection timeout

Check that:
1. Your database server is running
2. The DATABASE_URL is correct
3. The database user has proper permissions
4. If using Docker, the container can reach the database host

## Next Steps

After seeding the database:

1. Test the Learning Paths page to ensure all paths display correctly
2. Test the Resources page to ensure all resources are listed
3. Try enrolling in a learning path to test the full user flow
4. Add more content through the admin panel (if available) or by modifying and re-running the seed script
