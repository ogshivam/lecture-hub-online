# Supabase Database Setup

This directory contains the SQL files needed to set up the Supabase database for the Lecture Hub Online application.

## Directory Structure

```
supabase/
├── migrations/           # Database migration files
│   └── 20240320000000_initial_schema.sql
├── seed.sql             # Initial data population
├── config.toml          # Supabase configuration
└── README.md           # This file
```

## Files

- `migrations/20240320000000_initial_schema.sql`: Contains the initial database schema and table definitions
- `seed.sql`: Contains the initial data to populate the database
- `config.toml`: Supabase configuration file

## Database Structure

The database consists of the following tables:

1. **courses**
   - Stores course information
   - Fields: id, name, description, created_at

2. **weeks**
   - Stores week information for each course
   - Fields: id, course_id, name, created_at
   - Foreign key relationship with courses

3. **lectures**
   - Stores lecture information
   - Fields: id, course_id, week_id, title, description, youtube_id, scheduled_time, created_at
   - Foreign key relationships with courses and weeks

4. **profiles**
   - Stores user information
   - Fields: id, username, role, created_at

5. **relationship_managers**
   - Stores relationship manager information
   - Fields: id, name, email, created_at

## Setup Instructions

1. Create a new Supabase project at https://supabase.com

2. Run the migration file in the Supabase SQL editor to create the tables:
   ```sql
   -- Copy and paste the contents of migrations/20240320000000_initial_schema.sql
   ```

3. Run the seed.sql file to populate the database with initial data:
   ```sql
   -- Copy and paste the contents of seed.sql
   ```

4. Update the Supabase client configuration in your application:
   - Open `src/integrations/supabase/client.ts`
   - Replace the placeholder values with your Supabase project URL and anon key

## Database Relationships

- Each course can have multiple weeks
- Each week can have multiple lectures
- Each lecture belongs to one course and one week
- Each user has a profile
- Each profile can be associated with a relationship manager

## Security

- The database uses UUID for primary keys
- Foreign key constraints ensure data integrity
- Indexes are created for better query performance
- Timestamps are automatically managed

## Notes

- The seed data includes mock data for testing
- In production, you should:
  - Use proper password hashing for user authentication
  - Implement proper access control
  - Add additional security measures
  - Consider adding more indexes based on query patterns 