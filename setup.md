# Project Setup Guide

## 1. Clone the Repository

```bash
git clone https://github.com/G10RG131/SofMId
cd SofMId
```

---

## 2. Install Dependencies

> 📦 Ensure that `npm` is installed. If not, install [Node.js](https://nodejs.org/) which includes `npm`.

```bash
npm install
```

---

## 3. Install Additional Tools (if needed)

If your project requires **Jest** for testing:

```bash
npm install --save-dev jest
```

Or globally:

```bash
npm install -g jest
```

Other required modules (if any) can be installed similarly.

---

## 4. Running the Project

You must run **frontend** and **backend** in separate terminals.

### Start Frontend (Terminal 1)

```bash
cd frontend
npm run dev
```

By default, this usually runs on [http://localhost:3001](http://localhost:3001).

---

### Start Backend (Terminal 2)

Open another terminal:

```bash
cd backend
npm run dev
```

Backend might run on [http://localhost:5173](http://localhost:5173) or whichever port you have set.

---

## 5. Useful Commands

| Command | Purpose |
|:--------|:--------|
| `npm test` | Run project tests (Jest) |
---

## Notes

- Make sure **environment variables** (like `.env` files) are properly set if required.
- If you face any issues, check `package.json` scripts in both `frontend/` and `backend/` for available commands.
- For consistent environments, consider using **nvm** (Node Version Manager).

