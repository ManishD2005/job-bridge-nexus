
# CareerConnect

A job portal application connecting job seekers with companies.

## Features

- Job seeker and company portals
- Job listings and applications
- Company profiles
- Virtual booth for online interviews

## Demo Company Accounts

For demonstration purposes, you can use these company accounts:

- Email: technova@example.com
- Email: ecosolutions@example.com
- Email: financewave@example.com

Password for all demo accounts: `Company123!`

## Local Development

To run this project locally:

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
bun install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Supabase Setup

This project uses Supabase for authentication and database functionality. To set up your own Supabase instance:

1. Create a new project on [Supabase](https://supabase.io)
2. Run the SQL scripts in `src/sql/company_accounts.sql` to set up sample company data
3. Update the Supabase URL and key in `src/integrations/supabase/client.ts`

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- Supabase
- React Router
- React Query

## License

MIT
