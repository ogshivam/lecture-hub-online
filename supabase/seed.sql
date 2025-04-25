-- Insert mock data into the database

-- Insert courses
INSERT INTO courses (id, name, description) VALUES
    ('c1', 'Personal Finance Mastery', 'Comprehensive course covering essential financial skills for personal wealth management.'),
    ('c2', 'Investment and Wealth Building', 'Advanced course exploring investment strategies, market dynamics, and financial growth techniques.');

-- Insert weeks
INSERT INTO weeks (id, course_id, name) VALUES
    ('w1', 'c1', 'Week 1'),
    ('w2', 'c1', 'Week 2'),
    ('w3', 'c2', 'Week 1'),
    ('w4', 'c2', 'Week 2');

-- Insert lectures
INSERT INTO lectures (id, course_id, week_id, title, description, youtube_id, scheduled_time) VALUES
    ('l1', 'c1', 'w1', 'Introduction to Personal Finance', 'Learn the fundamental principles of personal financial management.', 'dQw4w9WgXcQ', NOW() + INTERVAL '1 day'),
    ('l2', 'c1', 'w1', 'Budgeting and Expense Tracking', 'Master techniques for creating and maintaining an effective personal budget.', 'dQw4w9WgXcQ', NOW() + INTERVAL '2 days'),
    ('l3', 'c1', 'w2', 'Investment Strategies for Beginners', 'Introduction to different investment vehicles and basic investment principles.', 'dQw4w9WgXcQ', NOW() - INTERVAL '2 days'),
    ('l4', 'c2', 'w3', 'Understanding Stock Markets', 'Comprehensive overview of stock market fundamentals and trading basics.', 'dQw4w9WgXcQ', NOW() + INTERVAL '10 minutes'),
    ('l5', 'c2', 'w3', 'Cryptocurrency and Blockchain', 'Exploring the world of cryptocurrencies and blockchain technology.', 'dQw4w9WgXcQ', NOW() - INTERVAL '30 minutes'),
    ('l6', 'c2', 'w4', 'Retirement Planning', 'Strategies for effective long-term financial planning and retirement savings.', 'dQw4w9WgXcQ', NOW() + INTERVAL '3 days');

-- Insert profiles (users)
INSERT INTO profiles (id, username, role) VALUES
    ('1', 'admin', 'admin'),
    ('2', 'user', 'user');

-- Insert relationship managers
INSERT INTO relationship_managers (id, name, email) VALUES
    ('1', 'John Doe', 'john.doe@example.com'),
    ('2', 'Jane Smith', 'jane.smith@example.com'); 