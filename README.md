# HCM Lite — Saylani Hackathon

AI-assisted Human Capital Management web app for **Admin, HR and Employee** roles.

## Stack

- React + Vite
- Tailwind CSS
- Axios
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcrypt
- PDFKit payslips
- Gemini API function calling (optional key; safe local fallback included)

## Implemented modules

1. Auth & role/data-scope guards
2. First-run organization setup
3. Employee directory, Employee 360 basics, CSV import dry-run/import/export
4. Web check-in/out and attendance correction workflow
5. Leave balance, validation, request/cancel/review and smart leave
6. Payroll draft, deductions/tax, Admin finalize/lock and payslip PDF
7. Admin/HR/Employee dashboards with live database KPIs
8. AI assistant with scoped tools and policy/privacy guardrails
9. Announcements, notifications and audit log

Optional camera/GPS attendance and other +10 bonus items are intentionally not required for the core build.

---

# 1) Local Setup on Windows

## Requirements

Install:

- Node.js 20+
- MongoDB Community Server, or use MongoDB Atlas
- Git (later for GitHub)

Check:

```bash
node -v
npm -v
```

## Extract and open

Extract the ZIP, then open CMD/PowerShell in the project folder.

```bash
cd hcm-lite
```

## Create environment file

Copy:

```bash
copy .env.example .env
```

For local MongoDB keep:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/hcm_lite
JWT_SECRET=replace-this-with-a-long-random-secret
PORT=5000
FRONTEND_URL=http://localhost:5173
```

AI is optional for initial local testing. To use Gemini, set:

```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-3.8-flash
```

Never commit `.env`.

## Install packages

```bash
npm run setup
```

## Start MongoDB

If MongoDB Community is installed as a Windows service, it normally starts automatically.

## Start the project

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

The first screen should be **First Run Setup**.

---

# 2) Required fresh-install flow

The normal assignment flow uses an empty database.

1. First-run setup creates company + Admin.
2. Admin creates departments, designations, leave types/holidays and HR login.
3. HR registers employees; employee login is created automatically.
4. Employee signs in and changes temporary password.
5. Employee checks in/out, applies leave, downloads finalized payslip.
6. HR approves corrections/leaves and creates payroll draft.
7. Admin finalizes payroll and views audit logs.
8. Dashboards and AI use the same live database records.

To clear your local database back to fresh-install state:

```bash
npm run reset:db
```

---

# 3) Optional demo database

For development only:

```bash
npm run seed:demo
```

This clears the selected database and creates:

```text
Admin
admin@hcm.local
Admin123!

HR
hr@hcm.local
Hr123456!

Employee
employee@hcm.local
Employee123!
```

Do **not** use the demo seed for the final judge fresh-install demo.

---

# 4) Employee CSV import

Use the Employees page as HR.

Expected CSV headers:

```csv
employeeCode,firstName,lastName,email,phone,address,gender,department,designation,joinDate,status,basicSalary
EMP002,Ali,Khan,ali@example.com,03001234567,Karachi,male,Engineering,Frontend Developer,2026-10-01,active,80000
```

Use **Dry run** first. The backend reports row/field/reason errors before saving.

---

# 5) Payroll rules used

- HRA = 40% of basic
- Medical = 10% of basic
- Gross = 1.5 × basic
- Per-day = gross ÷ working days
- Deduct absent days + unpaid days + 0.5 × half days
- Joiners/leavers are prorated by eligible working days
- Tax uses the illustrative annual slabs from the challenge brief
- HR creates/reviews the draft
- Admin finalizes it
- Finalized payroll is locked

---

# 6) AI assistant

The AI key exists only on the backend.

Implemented data tools:

- `get_headcount`
- `get_attendance_summary`
- `get_late_comers`
- `get_leave_summary`
- `get_my_leave_balance`
- `get_payroll_summary`
- `search_employees`

The backend executes tools with the signed-in user's role/data scope. Employees cannot use AI to read another employee's salary or private HR information.

Without `GEMINI_API_KEY`, the app still has a deterministic local tool router so the core data flow can be tested. For the hackathon AI scoring, add a real Gemini API key.

---

# 7) GitHub push

After local testing:

```bash
git init
git add .
git commit -m "Complete HCM Lite hackathon project"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

`.env` is already ignored by `.gitignore`.

---

# 8) MongoDB Atlas for live deployment

For Vercel, do not use `localhost` MongoDB.

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Allow your deployment to access the cluster according to your Atlas network rules.
4. Copy the Atlas connection string.
5. In Vercel Environment Variables set:

```text
MONGODB_URI
JWT_SECRET
GEMINI_API_KEY        (optional but recommended for judging)
GEMINI_MODEL          gemini-3.8-flash
NODE_ENV              production
```

Do not add database credentials to GitHub.

---

# 9) Vercel deployment

This repository has a root Express server and the production Express app serves the built React frontend.

1. Push project to GitHub.
2. Vercel → Add New Project.
3. Import the GitHub repository.
4. Keep root directory as repository root.
5. Add the environment variables listed above.
6. Deploy.

The included `vercel.json` runs the React build during deployment.

After deploy, test:

```text
https://YOUR_DOMAIN/api/health
```

Expected:

```json
{"ok":true,"service":"hcm-lite"}
```

Then open the main URL. On a new empty Atlas database it should show First Run Setup.

---

# 10) Suggested 5-minute judge demo

1. Fresh database → Admin setup
2. Add department/designation/leave rules + HR
3. HR creates 2–3 employees
4. Employee login → password change → check in
5. Smart leave sentence → confirm request
6. HR approves leave
7. Dashboard + AI query
8. HR creates payroll
9. Admin finalizes
10. Employee downloads payslip
11. Employee asks for a colleague's salary → AI refuses
12. Admin shows audit log

---

# Security notes

- Passwords are bcrypt hashed.
- JWT authentication is checked server-side.
- Role checks are enforced on API routes.
- Employee routes scope private records to the signed-in employee.
- Employee payroll responses are sanitized to the employee's own item only.
- AI provider key is backend-only.
- Audit log has no edit/delete route.
- `.env` and credentials are not committed.
