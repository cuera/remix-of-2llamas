# Valentine Alpaca — Phase 2: Backend Implementation Guide

## For: Junior Developer using Cursor IDE with Gemini/Claude Code + Supabase

---

## Prerequisites Checklist

Before starting, make sure you have:
- [ ] Lovable project exported to GitHub (Settings → GitHub → Connect)
- [ ] Git installed on your machine
- [ ] Node.js 18+ installed (`node --version` to check)
- [ ] A Supabase account (free tier is fine: https://supabase.com)
- [ ] Cursor IDE installed (https://cursor.sh)
- [ ] Vercel account for deployment (https://vercel.com)

---

## STEP 0: Export & Setup (15 minutes)

### 0.1 — Export from Lovable to GitHub

1. In Lovable, go to **Settings → GitHub**
2. Connect your GitHub account
3. Create a new repository: `valentine-alpaca`
4. Lovable will push all code to this repo

### 0.2 — Clone & Run Locally

Open your terminal in Cursor:

```bash
# Clone your repo
git clone https://github.com/YOUR_USERNAME/valentine-alpaca.git
cd valentine-alpaca

# Install dependencies
npm install

# Run locally to verify everything works
npm run dev
```

**✅ Checkpoint:** App opens in browser at localhost, looks exactly like it did in Lovable.

### 0.3 — Understand the Project Structure

Lovable generates a Vite + React + TypeScript project. Run this to see:

```bash
# In Cursor terminal
ls src/
```

You'll see something like:
```
src/
├── components/     ← All your UI components
├── pages/          ← Route pages
├── hooks/          ← Custom React hooks (if any)
├── lib/            ← Utilities (if any)
├── App.tsx         ← Main app with routing
└── main.tsx        ← Entry point
```

**Familiarize yourself with the file structure before making changes.**

---

## STEP 1: Create Supabase Project (10 minutes)

### 1.1 — Create Project

1. Go to https://supabase.com/dashboard
2. Click **New Project**
3. Name: `valentine-alpaca`
4. Database Password: generate a strong one, **save it somewhere**
5. Region: pick closest to your users (e.g., `us-east-1` or `ap-south-1`)
6. Click **Create new project** — wait 2 minutes for setup

### 1.2 — Get Your Keys

1. Go to **Settings → API** in your Supabase dashboard
2. Copy these two values:
   - **Project URL** — looks like `https://abcdefgh.supabase.co`
   - **anon public key** — starts with `eyJ...` (long string)

### 1.3 — Add Environment Variables

Create a `.env.local` file in your project root:

```bash
# In Cursor terminal
touch .env.local
```

Add these lines (paste your actual values):

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your_key_here
```

> **Why VITE_ prefix?** Lovable uses Vite, not Next.js. Vite requires the `VITE_` prefix to expose env vars to the browser.

### 1.4 — Add .env.local to .gitignore

Check that `.env.local` is in your `.gitignore`:

```bash
# In Cursor terminal
cat .gitignore | grep env
```

If you don't see `.env.local`, add it:

```bash
echo ".env.local" >> .gitignore
```

**✅ Checkpoint:** You have a Supabase project with URL and anon key in `.env.local`.

---

## STEP 2: Database Schema (10 minutes)

### 2.1 — Create the Valentines Table

Go to **Supabase Dashboard → SQL Editor** and run this:

```sql
-- ============================================
-- Valentine Alpaca — Database Schema
-- ============================================

-- Main table: one row per valentine
CREATE TABLE valentines (
  -- Unique short ID for URLs (e.g., "7Kx9mP")
  id TEXT PRIMARY KEY DEFAULT substr(md5(random()::text), 1, 8),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  opened_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- People (no auth — just names + browser fingerprint)
  sender_name TEXT NOT NULL,
  receiver_name TEXT NOT NULL,
  sender_visitor_id TEXT NOT NULL,
  receiver_visitor_id TEXT,
  
  -- Character choice
  character_type TEXT NOT NULL CHECK (character_type IN ('alpacas', 'dinos', 'pandas')),
  
  -- Optional love note
  love_note TEXT CHECK (char_length(love_note) <= 100),
  
  -- Choices
  -- Sender is ALWAYS yes (they created it = they said yes)
  sender_choice TEXT DEFAULT 'YES' CHECK (sender_choice IN ('YES', 'NO')),
  receiver_choice TEXT CHECK (receiver_choice IN ('YES', 'NO')),
  
  -- State machine
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'opened', 'complete'))
);

-- Index for fast lookups by ID (already primary key, but explicit)
CREATE INDEX idx_valentines_status ON valentines(status);

-- ============================================
-- Enable Realtime
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE valentines;

-- ============================================
-- Row Level Security (permissive for MVP)
-- ============================================
ALTER TABLE valentines ENABLE ROW LEVEL SECURITY;

-- Anyone can read any valentine (needed for link sharing)
CREATE POLICY "Public read access" 
  ON valentines FOR SELECT 
  USING (true);

-- Anyone can create a valentine
CREATE POLICY "Public insert access" 
  ON valentines FOR INSERT 
  WITH CHECK (true);

-- Anyone can update a valentine (we validate in app code)
CREATE POLICY "Public update access" 
  ON valentines FOR UPDATE 
  USING (true);
```

> **⚠️ Security Note:** These RLS policies are wide open (anyone can read/write). This is fine for an MVP Valentine's app. For production SaaS, you'd use proper auth-based policies.

### 2.2 — Verify Table Created

Go to **Table Editor** in Supabase. You should see the `valentines` table with all columns.

### 2.3 — Enable Realtime in Dashboard

1. Go to **Database → Replication** in Supabase dashboard
2. Under `supabase_realtime`, make sure `valentines` table is toggled ON
3. The SQL above should have done this, but verify visually

**✅ Checkpoint:** `valentines` table exists, realtime is enabled.

---

## STEP 3: Install Supabase Client (5 minutes)

### 3.1 — Install the package

```bash
npm install @supabase/supabase-js
```

### 3.2 — Create the Supabase Client

Create a new file. In Cursor terminal:

**Cursor/Claude Code prompt:**
```
Create a new file src/lib/supabase.ts that initializes the Supabase client:

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

Or just create the file manually — it's 8 lines.

**✅ Checkpoint:** File exists at `src/lib/supabase.ts`.

---

## STEP 4: Visitor Identity System (10 minutes)

This is how we know who's the sender and who's the receiver without any login/auth.

### 4.1 — Create Visitor ID Utility

**Cursor/Claude Code prompt:**
```
Create src/lib/visitor.ts — a utility that generates and persists a unique visitor ID in localStorage.

The file should export two functions:

1. getVisitorId(): string
   - Check localStorage for key 'valentine-visitor-id'
   - If found, return it
   - If not found, generate a new UUID using crypto.randomUUID()
   - Save it to localStorage
   - Return it
   
2. clearVisitorId(): void
   - Remove the key from localStorage (for testing)

Keep it simple — no classes, no complexity.
```

**Expected result:**
```typescript
// src/lib/visitor.ts
const VISITOR_KEY = 'valentine-visitor-id'

export function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(VISITOR_KEY, id)
  }
  return id
}

export function clearVisitorId(): void {
  localStorage.removeItem(VISITOR_KEY)
}
```

### 4.2 — How Visitor ID Works

```
Person A opens app on their phone:
  → localStorage: valentine-visitor-id = "abc-123-def"
  → Every action from this browser uses "abc-123-def"

Person B opens app on their phone:
  → localStorage: valentine-visitor-id = "xyz-789-ghi"
  → Every action from this browser uses "xyz-789-ghi"

When Person A creates a valentine:
  → Row saved with sender_visitor_id = "abc-123-def"

When Person B opens the link:
  → We check: is my visitor_id the sender? No.
  → Is there a receiver yet? No.
  → Claim it: receiver_visitor_id = "xyz-789-ghi"
```

**✅ Checkpoint:** `src/lib/visitor.ts` exists with `getVisitorId()` and `clearVisitorId()`.

---

## STEP 5: Create Valentine Flow (20 minutes)

This connects the "Create & Share" button to Supabase.

### 5.1 — Create the Valentine Hook

**Cursor/Claude Code prompt:**
```
Create src/hooks/useCreateValentine.ts — a custom React hook that creates a new valentine in Supabase.

It should:
1. Import supabase from '../lib/supabase'
2. Import getVisitorId from '../lib/visitor'
3. Export a hook useCreateValentine() that returns:
   - createValentine: async function that takes { senderName, receiverName, characterType, loveNote }
   - isLoading: boolean
   - error: string | null
   - valentineId: string | null (the generated ID after creation)

The createValentine function should:
1. Call getVisitorId() to get the sender's visitor ID
2. Insert a row into the 'valentines' table with:
   - sender_name: senderName
   - receiver_name: receiverName
   - sender_visitor_id: visitorId
   - character_type: characterType
   - love_note: loveNote (can be null/empty)
   - sender_choice: 'YES' (always — they're sending = they said yes)
   - status: 'sent'
3. Return the created row's id
4. Handle errors gracefully

Use useState for isLoading, error, and valentineId.
```

**Expected result:**
```typescript
// src/hooks/useCreateValentine.ts
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { getVisitorId } from '../lib/visitor'

interface CreateValentineParams {
  senderName: string
  receiverName: string
  characterType: 'alpacas' | 'dinos' | 'pandas'
  loveNote?: string
}

export function useCreateValentine() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [valentineId, setValentineId] = useState<string | null>(null)

  const createValentine = async (params: CreateValentineParams) => {
    setIsLoading(true)
    setError(null)

    try {
      const visitorId = getVisitorId()

      const { data, error: dbError } = await supabase
        .from('valentines')
        .insert({
          sender_name: params.senderName,
          receiver_name: params.receiverName,
          sender_visitor_id: visitorId,
          character_type: params.characterType,
          love_note: params.loveNote || null,
          sender_choice: 'YES',
          status: 'sent',
        })
        .select('id')
        .single()

      if (dbError) throw dbError

      setValentineId(data.id)
      return data.id
    } catch (err: any) {
      setError(err.message || 'Failed to create valentine')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { createValentine, isLoading, error, valentineId }
}
```

### 5.2 — Connect Hook to Create & Share Button

**Cursor/Claude Code prompt:**
```
Find the component where the "Create & Share" button is (likely in the character selection page).

Modify the onClick handler for the "Create & Share" button to:
1. Import and use the useCreateValentine hook
2. On click: call createValentine() with the current state (names, character type, love note)
3. Show a loading spinner or disable the button while isLoading is true
4. On success: navigate to the share page, passing the valentineId
5. On error: show the error message to the user

The share page URL should include the valentine ID so we can use it:
Navigate to /share with the valentineId in state or URL params.

Also update the share screen:
- Replace the hardcoded "valentine-alpaca.app/v/demo123" with the real URL:
  `${window.location.origin}/v/${valentineId}`
- The copy button should copy this real URL
```

### 5.3 — Update Share Screen with Real Link

**Cursor/Claude Code prompt:**
```
In the ShareScreen/share page component:

1. Get the valentineId from route params or navigation state
2. Build the real share URL: `${window.location.origin}/v/${valentineId}`
3. Replace the hardcoded "valentine-alpaca.app/v/demo123" with this real URL
4. Update the copy button to copy the real URL
5. Update WhatsApp button to: https://wa.me/?text=Check+this+out!+${encodeURIComponent(shareUrl)}
6. Update the Share button to use navigator.share({ url: shareUrl, title: 'Be My Valentine?' }) if available
```

**✅ Checkpoint:** Clicking "Create & Share" creates a real row in Supabase and shows a real URL.

---

## STEP 6: Receiver Flow — Open Link & Role Detection (25 minutes)

This is the most important step. When Person B opens the shared link, we need to:
1. Load the valentine from Supabase
2. Determine if this visitor is the sender, receiver, or stranger
3. Show the right view

### 6.1 — Create the Valentine Loader Hook

**Cursor/Claude Code prompt:**
```
Create src/hooks/useValentine.ts — a hook that loads a valentine by ID and determines the user's role.

It should:
1. Accept valentineId as parameter
2. Load the valentine row from Supabase by ID
3. Determine the viewer's role using getVisitorId():
   - If my visitorId === sender_visitor_id → role = 'sender'
   - If my visitorId === receiver_visitor_id → role = 'receiver'
   - If receiver_visitor_id is null → I'm a new person → role = 'new_receiver'
   - Otherwise → role = 'stranger'
4. If role is 'new_receiver', automatically claim the valentine:
   - UPDATE the row: set receiver_visitor_id = myVisitorId, status = 'opened', opened_at = now()
   - After claiming, role becomes 'receiver'
5. Subscribe to realtime changes on this specific row
6. Return: { valentine, role, isLoading, error }

The valentine object should contain all fields: names, character_type, love_note, choices, status.
Update local state whenever a realtime update comes in.

For the realtime subscription, use:
supabase
  .channel(`valentine-${valentineId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'valentines',
    filter: `id=eq.${valentineId}`
  }, (payload) => {
    setValentine(payload.new)
  })
  .subscribe()

Remember to clean up the subscription in useEffect cleanup.
```

**Expected core logic:**
```typescript
// Simplified version of the role detection logic
const visitorId = getVisitorId()
const { data } = await supabase.from('valentines').select('*').eq('id', valentineId).single()

let role: 'sender' | 'receiver' | 'new_receiver' | 'stranger'

if (data.sender_visitor_id === visitorId) {
  role = 'sender'
} else if (data.receiver_visitor_id === visitorId) {
  role = 'receiver'  
} else if (!data.receiver_visitor_id) {
  role = 'new_receiver'
  // Claim it
  await supabase
    .from('valentines')
    .update({ 
      receiver_visitor_id: visitorId, 
      status: 'opened',
      opened_at: new Date().toISOString()
    })
    .eq('id', valentineId)
  role = 'receiver'
} else {
  role = 'stranger'
}
```

### 6.2 — Create the Valentine Page Router

**Cursor/Claude Code prompt:**
```
Update the /v/:id route page to use the useValentine hook and show different views based on role:

1. Import useValentine hook
2. Get the valentine ID from URL params (useParams)
3. Call useValentine(valentineId)
4. Based on role, show different views:

   ROLE = 'sender':
     Show the sender's view:
     - If status is 'sent': "Waiting for [receiver_name] to open your valentine... ⏳"
     - If status is 'opened': "👀 [receiver_name] opened your valentine! They're deciding..."
     - If status is 'complete' and receiver_choice is 'YES': Show the match outcome
     - If status is 'complete' and receiver_choice is 'NO': Show the rejection outcome
     The sender CANNOT interact with buttons. They can only WATCH.
     This updates in realtime via the subscription.

   ROLE = 'receiver':
     Show the receiver's experience:
     - If receiver_choice is null: Show story intro → game board with YES/NO buttons
     - If receiver_choice is set: Show the outcome (match or rejection)
     
   ROLE = 'stranger':
     - If status is 'complete': Show the keepsake view (read-only outcome)
     - If status is not complete: Show "This valentine is for someone special 💌"
       with a button "Send Your Own Valentine →" linking to /create

   LOADING:
     Show a centered loading spinner (pulsing heart)

   ERROR (valentine not found):
     Show "Valentine not found 💔" with a link to homepage
```

### 6.3 — Submit Receiver's Choice

**Cursor/Claude Code prompt:**
```
Create src/hooks/useSubmitChoice.ts — a hook for the receiver to submit their YES or NO.

It should:
1. Accept valentineId as parameter
2. Export submitChoice(choice: 'YES' | 'NO') async function
3. On submit:
   - UPDATE the valentines row:
     - receiver_choice = choice
     - status = 'complete'
     - completed_at = now()
   - Return success/failure
4. Handle loading and error states

Connect this to the YES and NO buttons on the game board.
The YES button calls submitChoice('YES').
The NO button (if they manage to click it past the impossible mechanic) calls submitChoice('NO').
```

**Expected result:**
```typescript
// src/hooks/useSubmitChoice.ts
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function useSubmitChoice(valentineId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitChoice = async (choice: 'YES' | 'NO') => {
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('valentines')
        .update({
          receiver_choice: choice,
          status: 'complete',
          completed_at: new Date().toISOString(),
        })
        .eq('id', valentineId)

      if (error) throw error
      return true
    } catch (err) {
      console.error('Failed to submit choice:', err)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return { submitChoice, isSubmitting }
}
```

**✅ Checkpoint:** 
- Open the app in Browser A → Create valentine → Get real link
- Open link in Browser B (or incognito) → See receiver experience
- Browser B clicks YES → Both browsers show the outcome

---

## STEP 7: Sender's Realtime Status on Share Screen (15 minutes)

### 7.1 — Update Share Screen with Live Status

**Cursor/Claude Code prompt:**
```
Update the share screen to show realtime status updates.

The share screen already has valentineId. Use the useValentine hook to subscribe to changes.

Replace the hardcoded "⏳ Waiting for [name] to open..." with dynamic status:

Based on valentine.status and valentine.receiver_choice:

- status === 'sent':
  "⏳ Waiting for [receiver_name] to open your valentine..."
  Show a gentle pulse animation on the hourglass emoji

- status === 'opened':  
  "👀 [receiver_name] opened your valentine!"
  "💭 They're deciding..."
  Add a brief celebration animation when this first changes (subtle bounce/sparkle)
  
- status === 'complete' && receiver_choice === 'YES':
  "🎉 [receiver_name] said YES!"
  Auto-navigate to the match outcome page after 1.5 seconds
  Or show a "See the result →" button

- status === 'complete' && receiver_choice === 'NO':
  "💔 [receiver_name] said no..."
  Show the rejection outcome or a "See what happened →" button

The status should update in realtime — the sender does NOT need to refresh the page.
Use the realtime subscription from useValentine hook.
```

**✅ Checkpoint:** Sender's share screen updates live when receiver opens and responds.

---

## STEP 8: QR Code (5 minutes)

### 8.1 — Install QR Library

```bash
npm install qrcode.react
```

### 8.2 — Add Real QR Code

**Cursor/Claude Code prompt:**
```
In the share screen, replace the QR code placeholder with a real QR code.

1. Import QRCodeSVG from 'qrcode.react'
2. When "Show QR" is toggled on, render:
   <QRCodeSVG 
     value={shareUrl}    // the real valentine URL
     size={200}
     bgColor="transparent"
     fgColor="#E91E8B"   // pink color
     level="M"
   />
3. The QR encodes the full valentine URL (same as the copy link)
4. Style it centered with some padding, on the dark background
```

**✅ Checkpoint:** QR code appears, scanning it opens the valentine link.

---

## STEP 9: Valentine Counter (5 minutes)

### 9.1 — Real Counter from Database

**Cursor/Claude Code prompt:**
```
Update the homepage valentine counter ("2,847 valentines sent so far") to show a real count from Supabase.

1. Create a hook useValentineCount() that:
   - On mount, queries: supabase.from('valentines').select('id', { count: 'exact', head: true })
   - Returns the count
   - Optionally subscribes to realtime INSERT events to increment live

2. On the homepage, replace the hardcoded "2,847" with the real count
3. Format the number with commas (e.g., 1,247)
4. If count is loading, show "..." or keep the previous number
5. If count is 0 or error, show "Be the first! 💌" instead
```

**✅ Checkpoint:** Homepage shows real valentine count from database.

---

## STEP 10: Deployment (15 minutes)

### Option A: Vercel (Recommended for Vite projects)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No → create new
# - Project name: valentine-alpaca
# - Framework: Vite
# - Build command: npm run build
# - Output directory: dist
```

Then add environment variables in Vercel dashboard:
1. Go to https://vercel.com → your project → Settings → Environment Variables
2. Add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
3. Redeploy: `vercel --prod`

### Option B: Vercel via GitHub (Auto-deploy)

1. Go to https://vercel.com/new
2. Import your `valentine-alpaca` GitHub repo
3. Vercel auto-detects Vite
4. Add environment variables before deploying
5. Click Deploy
6. Every push to `main` auto-deploys

### Option C: Netlify (Alternative)

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

**Recommendation:** Use **Option B (Vercel via GitHub)** — zero maintenance, auto-deploys on push.

### 10.1 — Custom Domain (Optional)

**Options:**
1. **Free Vercel subdomain:** `valentine-alpaca.vercel.app` (works immediately)
2. **Custom domain:** Buy a domain (e.g., `valentinealpaca.app`) from Namecheap/Google Domains for ~$12/year
3. **Free `.is-a.dev` subdomain:** Apply at https://is-a.dev (takes a few days)

**Recommendation:** Start with the free Vercel subdomain. Buy a custom domain only if you plan to share it widely.

### 10.2 — Test the Deployment

1. Open your deployed URL on your phone (Browser A)
2. Create a valentine
3. Copy the link
4. Open it in a different browser or device (Browser B)
5. Complete the flow
6. Verify both see the outcome

**✅ Checkpoint:** App is live on the internet, two people can play from different devices.

---

## STEP 11: Download Card — Polaroid Image (15 minutes)

### 11.1 — Install html-to-image

```bash
npm install html-to-image
```

### 11.2 — Create Download Card Component

**Cursor/Claude Code prompt:**
```
Create a DownloadCard component and functionality on the match outcome screen.

When "📸 Download Card" is clicked:

1. Render a hidden div (off-screen, position absolute, left -9999px) styled as a polaroid:
   - White background, 350px wide, 450px tall
   - Inner area: dark purple (#2D1B3D), contains the two pixel characters in match pose
   - Below inner area: "[Sender Name] ❤️ [Receiver Name]" in Patrick Hand font
   - Below that: "Valentine's Day 2026" in smaller text
   - Bottom: "valentine-alpaca.app" in tiny muted text (free marketing)

2. Use html-to-image's toPng() to capture this div as an image
3. Create a download link:
   const link = document.createElement('a')
   link.download = `valentine-${senderName}-${receiverName}.png`
   link.href = dataUrl
   link.click()

4. Show "Generating..." text on the button while processing
5. After download, button returns to normal

Also add a "📤 Share" option that:
- On mobile (navigator.share available): converts to blob and shares via native share sheet
- On desktop: just downloads the image
```

**✅ Checkpoint:** Clicking "Download Card" saves a polaroid PNG with characters and names.

---

## Complete Cursor Prompt — All-In-One (Alternative Approach)

If you prefer giving one big prompt to Claude Code instead of step-by-step, here's the comprehensive version:

```
I have a Valentine's Day pixel-art web app built with Vite + React + TypeScript + Tailwind + Framer Motion, exported from Lovable. All the UI is done. I need to wire up the backend.

STACK TO ADD:
- @supabase/supabase-js (install it)
- qrcode.react (install it)  
- html-to-image (install it)

ENVIRONMENT:
- .env.local already has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- Supabase project already has a 'valentines' table with columns:
  id (TEXT, PK), created_at, opened_at, completed_at,
  sender_name, receiver_name, sender_visitor_id, receiver_visitor_id,
  character_type, love_note, sender_choice (default 'YES'), receiver_choice,
  status (default 'sent')
- Realtime is enabled on the valentines table

CREATE THESE FILES:

1. src/lib/supabase.ts — Supabase client initialization using import.meta.env

2. src/lib/visitor.ts — getVisitorId() that generates and persists a UUID in localStorage

3. src/hooks/useCreateValentine.ts — Hook that inserts a new valentine row and returns the ID

4. src/hooks/useValentine.ts — Hook that:
   - Loads a valentine by ID
   - Determines role (sender/receiver/new_receiver/stranger) using visitor ID
   - If new_receiver: claims it (sets receiver_visitor_id, status='opened')
   - Subscribes to realtime updates on the row
   - Returns { valentine, role, isLoading, error }

5. src/hooks/useSubmitChoice.ts — Hook for receiver to submit YES/NO choice

6. src/hooks/useValentineCount.ts — Hook that gets total valentine count for homepage

MODIFY THESE EXISTING COMPONENTS:

1. Character selection "Create & Share" button:
   - Use useCreateValentine to create real DB row
   - Navigate to share page with real valentineId

2. Share screen:
   - Show real URL: ${window.location.origin}/v/${valentineId}
   - Copy button copies real URL
   - WhatsApp button uses real URL
   - Replace QR placeholder with real QRCodeSVG from qrcode.react
   - Show live status using useValentine realtime subscription
   - Status text updates as receiver opens and responds

3. Valentine page (/v/:id):
   - Use useValentine hook to load data and determine role
   - SENDER view: read-only status watcher (waiting → opened → result)
   - RECEIVER view: story intro → game board → choice → outcome
   - STRANGER view: keepsake (if complete) or "this is for someone special"
   - NOT FOUND: "Valentine not found 💔"

4. Game board YES/NO buttons:
   - Use useSubmitChoice hook
   - YES button calls submitChoice('YES')
   - NO button (if clicked past impossible mechanic) calls submitChoice('NO')

5. Homepage counter:
   - Use useValentineCount to show real count

6. Match outcome:
   - Add download card feature using html-to-image

DO NOT change any visual styling, pixel art, animations, or layout.
Only add Supabase integration, role detection, and realtime updates.
Keep all existing Framer Motion animations.
```

---

## Troubleshooting

### "Supabase URL is undefined"
→ Check `.env.local` has `VITE_` prefix (not `NEXT_PUBLIC_`)
→ Restart dev server after changing `.env.local`

### "Row level security policy violation"
→ Check RLS policies are created (run the SQL from Step 2 again)
→ Or temporarily: `ALTER TABLE valentines DISABLE ROW LEVEL SECURITY;`

### Realtime not updating
→ Check table is in `supabase_realtime` publication (Dashboard → Database → Replication)
→ Check channel filter matches: `filter: 'id=eq.YOUR_ID'`
→ Check browser console for WebSocket errors

### "localStorage is not defined"
→ This happens in SSR. Lovable/Vite is client-only, so shouldn't be an issue. If it is, wrap in `if (typeof window !== 'undefined')`

### Two browsers show same visitor ID
→ Use incognito/private mode for Browser B, OR use a different browser entirely
→ Both tabs in the same browser share localStorage

### Deployed but Supabase not working
→ Environment variables not set in Vercel dashboard
→ Redeploy after adding env vars: `vercel --prod`

---

## Post-Launch Checklist

- [ ] Create a valentine on your phone
- [ ] Send the link to a friend
- [ ] Watch your share screen update when they open it
- [ ] See the match/rejection outcome on both devices
- [ ] Download the polaroid card
- [ ] Share it to Instagram stories
- [ ] Send it to your actual Valentine 💌

---

## What's Next (Future Enhancements)

After MVP is shipped, these are optional improvements:

1. **Rate limiting** — Prevent spam (max 10 valentines per visitor per day)
2. **Expiry** — Auto-delete unclaimed valentines after 30 days
3. **Analytics** — Track how many were opened vs completed
4. **"My Valentines" page** — Sender can see all valentines they've sent and their status
5. **Custom domain** — Buy valentinealpaca.app or similar
6. **Social meta tags** — Add Open Graph tags so the link preview looks good on WhatsApp/iMessage
7. **Sound effects** — Add optional audio
8. **More characters** — Let users suggest new pixel art character types
