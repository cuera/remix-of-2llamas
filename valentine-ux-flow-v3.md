# Valentine Alpaca — UX Flow v3 (Logic Fixed)

## The Fundamental Problem You Caught

**Sending the link IS saying YES.** Person A doesn't need a YES button. They already said yes by creating and sharing the valentine. The only question is: **will Person B say yes back?**

This changes EVERYTHING about the flow.

---

## Corrected Mental Model

```
Person A (Sender) = Already YES. They're asking the question.
Person B (Receiver) = The one who decides. YES or NO.

The app is a QUESTION from A to B.
Not a simultaneous game.
```

**It's not chess. It's a love letter with a reply button.**

---

## Second Problem: One Person, Many Valentines

Person A should be able to send valentines to **multiple people**:
- Send one to their crush
- Send one to their best friend
- Send a funny one to a coworker

Each valentine = unique link = unique character pair = unique recipient.
Person A is NOT locked to one valentine.

---

## Third Problem: Where Does the Link Come From?

The link must be generated AFTER character selection, because the character choice is part of the valentine. The link encodes:
- Which character Person A chose
- Person A's name
- Person B's name

Person B opens the link and sees Person A's character already there, waiting.

---

## The Correct Flow (Rethought)

### HOMEPAGE (Public — Anyone Can Visit)

```
┌─────────────────────────────────────────────────────┐
│                                                       │
│              🩷 Valentine Alpaca 🩷                    │
│                                                       │
│     "Send a pixel valentine to someone special"       │
│                                                       │
│     ┌─────────┐  ┌─────────┐  ┌─────────┐           │
│     │ 🦙🦙    │  │ 🦕🦕    │  │ 🐼🐼    │           │
│     │ Alpacas │  │  Dinos  │  │ Pandas  │           │
│     └─────────┘  └─────────┘  └─────────┘           │
│     (mini preview of all 3 pairs, decorative)        │
│                                                       │
│            [ Send a Valentine ❤️ ]                    │
│                                                       │
│         "💌 2,847 valentines sent so far"             │
│                                                       │
│  ─────────────────────────────────────────           │
│                                                       │
│  "Already received one? Your link will show           │
│   your valentine when you open it!"                   │
│                                                       │
└─────────────────────────────────────────────────────┘
```

**Purpose:** 
- Public landing page anyone can visit
- Shows what the app is
- Two audiences: senders (create) and receivers (they already have a link)
- Valentine counter for social proof
- This page is what you share on social media / Product Hunt

---

### STEP 1: CREATE (Person A Only)

Person A clicks "Send a Valentine" → enters this flow:

```
┌─────────────────────────────────────────────────────┐
│                                                       │
│              Create Your Valentine 💌                 │
│                                                       │
│   Your Name:     [ Alex          ]                    │
│   Their Name:    [ Sam           ]                    │
│                                                       │
│   Pick your characters:                               │
│                                                       │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐             │
│   │  🦙🦙   │  │  🦕🦕   │  │  🐼🐼   │             │
│   │ Alpacas │  │  Dinos  │  │ Pandas  │             │
│   │  [ ✓ ]  │  │  [   ]  │  │  [   ]  │             │
│   └─────────┘  └─────────┘  └─────────┘             │
│                                                       │
│   Optional love note: (max 100 chars)                 │
│   [ Hey Sam, been wanting to ask you this... ]        │
│                                                       │
│              [ Create & Share 💝 ]                    │
│                                                       │
└─────────────────────────────────────────────────────┘
```

**What happens on "Create & Share":**
1. Creates a valentine record in Supabase:
   ```
   {
     id: "v_7Kx9mP",
     sender_name: "Alex",
     receiver_name: "Sam",
     character_type: "dinos",
     love_note: "Hey Sam, been wanting to ask you this...",
     sender_choice: "YES",      ← AUTO-SET. They're sending = they said yes.
     receiver_choice: null,      ← Waiting for Person B
     status: "sent",
     created_at: "2026-02-14T..."
   }
   ```
2. Generates unique URL: `valentine-alpaca.app/v/7Kx9mP`
3. Redirects to Share Screen

**Key point: `sender_choice` is automatically YES. No button needed.**

---

### STEP 2: SHARE (Person A Only)

```
┌─────────────────────────────────────────────────────┐
│                                                       │
│          Your valentine for Sam is ready! 💌          │
│                                                       │
│    ┌─────────────────────────────────────────┐       │
│    │                                         │       │
│    │      🟢🦕          🩷🦕                 │       │
│    │      Alex          Sam                  │       │
│    │                                         │       │
│    │   "Will you be my Valentine?"           │       │
│    │                                         │       │
│    │     (preview of what Sam will see)      │       │
│    │                                         │       │
│    └─────────────────────────────────────────┘       │
│                                                       │
│    Share this link with Sam:                          │
│                                                       │
│    ┌──────────────────────────────────┐               │
│    │ valentine-alpaca.app/v/7Kx9mP   │ [📋 Copy]    │
│    └──────────────────────────────────┘               │
│                                                       │
│    [ 💬 WhatsApp ]  [ 📱 QR Code ]  [ 📤 Share ]    │
│                                                       │
│    ─────────────────────────────────────              │
│                                                       │
│    Status: ⏳ Waiting for Sam to open...              │
│    (updates in realtime when Sam opens the link)      │
│                                                       │
│    ─────────────────────────────────────              │
│                                                       │
│    [ ← Send Another Valentine ]                       │
│    (goes back to Step 1 to create a new one)         │
│                                                       │
└─────────────────────────────────────────────────────┘
```

**Realtime status updates Person A sees:**
1. "⏳ Waiting for Sam to open..." (initial)
2. "👀 Sam opened your valentine!" (when B visits the link)
3. "💭 Sam is deciding..." (B is on the page)
4. "🎉 Sam said YES!" or "💔 Sam said no..." (B made choice)
→ Auto-transitions to Outcome Screen

**"Send Another Valentine" button** — takes them back to Step 1. They can send to as many people as they want. Each one is a separate valentine with its own link.

---

### STEP 3: RECEIVE (Person B Only — Opens the Link)

Person B opens `valentine-alpaca.app/v/7Kx9mP`

**What they see — a STORY, not just buttons:**

```
┌─────────────────────────────────────────────────────┐
│                                                       │
│            (dark screen, gentle fade in)               │
│                                                       │
│        "Someone has a question for you..."            │
│              (typewriter text, 2 seconds)              │
│                                                       │
└─────────────────────────────────────────────────────┘
                    │ (auto-advance)
                    ▼
┌─────────────────────────────────────────────────────┐
│                                                       │
│              🟢🦕                                     │
│              Alex's dino walks in from left            │
│              (pixel walk animation, 2 seconds)        │
│                                                       │
│    Love note fades in (if provided):                  │
│    "Hey Sam, been wanting to ask you this..."         │
│              (handwritten font, letter by letter)      │
│                                                       │
└─────────────────────────────────────────────────────┘
                    │ (auto-advance)
                    ▼
┌─────────────────────────────────────────────────────┐
│                                                       │
│         "BE MY VALENTINE?"                            │
│         (big text, spring animation)                  │
│                                                       │
│      🟢🦕            🩷🦕                             │
│      Alex            Sam                              │
│      (waiting,       (this is YOU)                    │
│       hopeful        ↓                                │
│       bounce)        Your turn!                       │
│                                                       │
│                  [ 💚 YES ]    [ NO ]                 │
│                  (big,warm)    (small,muted)          │
│                                                       │
│         ← Only Person B has buttons here              │
│         Person A already said yes by sending          │
│                                                       │
└─────────────────────────────────────────────────────┘
```

**The YES button is prominent. The NO button is smaller and muted.**

**If Person B hovers/taps NO (the impossible NO mechanic):**
```
Attempt 1: NO slides right,     Alex's dino looks worried (head tilt)
           Text: "Really? 🥺"

Attempt 2: NO slides further,   Alex's dino shivers
           Text: "But look at us..."

Attempt 3: NO shrinks 30%,      Alex's dino sits down sadly
           Text: "Pookie please..."

Attempt 4: NO shrinks more,     YES grows huge and glows
           Text: "Last chance..."

Attempt 5: NO is a tiny dot,    Alex's dino covers eyes with paw/wing
           YES fills most of the space
```

**Person B CAN still click NO.** It's hard but possible. We don't trap them.

---

### STEP 4: OUTCOME (Both See This)

**When Person B chooses:**

#### If YES:

Both Person A and Person B see (simultaneously via realtime):

```
┌─────────────────────────────────────────────────────┐
│                                                       │
│    (countdown: 3... 2... 1... with heartbeat)        │
│                                                       │
│              ❤️ IT'S A MATCH! ❤️                     │
│                                                       │
│           🟢🦕  💕  🩷🦕                              │
│           (kissing / nuzzling animation)              │
│           (confetti hearts raining)                   │
│                                                       │
│           Alex  ❤️  Sam                               │
│           Valentine's Day 2026                        │
│                                                       │
│    ┌──────────────────────────────────────┐           │
│    │  [ 📸 Download Card ]               │           │
│    │  [ 📤 Share to Stories ]            │           │
│    │  [ 💌 Send Your Own Valentine ]     │           │
│    │  [ 🔀 Try Different Characters ]    │           │
│    └──────────────────────────────────────┘           │
│                                                       │
└─────────────────────────────────────────────────────┘
```

**"Download Card"** → Generates a polaroid-style PNG:
```
┌─────────────────────────────────┐
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │    🟢🦕  💕  🩷🦕        │  │
│  │    (characters kissing)   │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│     Alex  ❤️  Sam               │
│     Valentine's Day 2026        │
│                                 │
│     valentine-alpaca.app        │
└─────────────────────────────────┘
```
This is what gets shared on Instagram stories = free marketing.

**"Send Your Own Valentine"** → Goes to homepage Step 1. This is the **viral loop**:
Person B just received a valentine → now they want to send one too → creates their own → sends to Person C → etc.

#### If NO:

```
┌─────────────────────────────────────────────────────┐
│                                                       │
│           💔                                          │
│                                                       │
│    🟢🦕                              🩷🦕             │
│    (Alex's dino looks down sadly)  (walks away)      │
│                                                       │
│    "Maybe next time... 💔"                            │
│    "But hey, there's always chocolate 🍫"            │
│                                                       │
│    [ 💌 Send Your Own Valentine ] ← still push this  │
│    [ 🔀 Try Different Characters ]                    │
│                                                       │
└─────────────────────────────────────────────────────┘
```

Even on rejection, prompt them to send their OWN valentine to someone. Keep the viral loop going.

---

### STEP 5: KEEPSAKE (The Link Lives Forever)

After the outcome, the link `/v/7Kx9mP` becomes a **permanent page**:

```
┌─────────────────────────────────────────────────────┐
│                                                       │
│     🟢🦕  💕  🩷🦕                                    │
│     (characters in their match pose, gently          │
│      breathing/bouncing idle animation)              │
│                                                       │
│     Alex  ❤️  Sam                                     │
│     Matched on February 14, 2026                     │
│                                                       │
│     [ 📸 Download Card ]                              │
│     [ 💌 Send Your Own Valentine ]                    │
│                                                       │
└─────────────────────────────────────────────────────┘
```

Anyone who visits this link (A, B, or even someone they shared it with) sees the keepsake. It's a permanent tiny love page.

---

## URL Structure & Parameters

```
valentine-alpaca.app/                    → Homepage (public)
valentine-alpaca.app/create              → Create flow (Step 1 + 2)
valentine-alpaca.app/v/7Kx9mP           → The valentine (unique per pair)
```

### What's Stored in the URL vs Database

**The URL has:** Just the unique ID (`7Kx9mP`)

**The database has everything else:**
```sql
CREATE TABLE valentines (
  id TEXT PRIMARY KEY,                    -- "7Kx9mP" (short, URL-friendly)
  created_at TIMESTAMPTZ DEFAULT now(),
  
  -- People
  sender_name TEXT NOT NULL,              -- "Alex"
  receiver_name TEXT NOT NULL,            -- "Sam"
  sender_visitor_id TEXT NOT NULL,        -- localStorage UUID (to identify sender)
  receiver_visitor_id TEXT,               -- set when Person B first opens link
  
  -- Character
  character_type TEXT NOT NULL,           -- "alpacas" | "dinos" | "pandas"
  
  -- Message
  love_note TEXT,                         -- optional, max 100 chars
  
  -- Choices
  sender_choice TEXT DEFAULT 'YES',       -- ALWAYS YES (they sent it = yes)
  receiver_choice TEXT,                   -- null until B chooses
  
  -- State
  status TEXT DEFAULT 'sent',             -- sent → opened → complete
  opened_at TIMESTAMPTZ,                 -- when B first opened the link
  completed_at TIMESTAMPTZ              -- when B made their choice
);
```

### How Both People Access the Same Link

**Person A (sender) visits `/v/7Kx9mP`:**
```
1. Load valentine from DB by ID
2. Check: my visitorId matches sender_visitor_id?
   → YES: I'm the sender
   → Show: "Waiting for Sam..." or outcome if complete
   → I see the status updates in realtime
```

**Person B (receiver) visits `/v/7Kx9mP`:**
```
1. Load valentine from DB by ID
2. Check: my visitorId matches sender_visitor_id?
   → NO: I'm not the sender
3. Check: receiver_visitor_id is null?
   → YES: I'm the first new person to open this = I'm the receiver
   → Claim it: UPDATE receiver_visitor_id = myVisitorId, status = 'opened'
   → Show: The story intro → buttons → choice
4. Check: my visitorId matches receiver_visitor_id?
   → YES: I'm the receiver (returning visit)
   → Show: My choice screen (or outcome if complete)
5. Neither sender nor receiver?
   → Show: Keepsake view (read-only, if complete) 
   → Or: "This valentine is for someone else 💌"
```

**Random person visits `/v/7Kx9mP`:**
```
- If valentine is complete → show keepsake (read-only)
- If valentine is not complete → "This valentine is for someone special 💌"
```

---

## One Person → Many Valentines

```
Alex creates valentine for Sam   → /v/7Kx9mP  (dinos)
Alex creates valentine for Jordan → /v/Qm3nRt  (alpacas)  
Alex creates valentine for Pat   → /v/Wk8pLz  (pandas)

Each is independent. Each has its own:
- Character type
- Love note
- Outcome
- Keepsake page
```

Alex can track all of these from the share screen. Optionally, we could add a "My Valentines" section (later, not MVP) where they see status of all sent valentines.

---

## Realtime: What Updates When

### Person A's Share Screen (Watching)

| Event | What A Sees | Supabase Trigger |
|-------|-------------|-----------------|
| B opens link | "👀 Sam opened your valentine!" | status: 'sent' → 'opened' |
| B is deciding | "💭 Sam is thinking..." | (just the opened state) |
| B says YES | Screen transitions to Match outcome | receiver_choice: 'YES' |
| B says NO | Screen transitions to Rejection outcome | receiver_choice: 'NO' |

### Person B's Link (Acting)

| Event | What B Sees |
|-------|-------------|
| Opens link | Story intro animation |
| After intro | Game board with YES/NO buttons |
| Clicks YES | Countdown → Match animation |
| Clicks NO | Rejection animation |

### Both After Outcome

Both see the same outcome screen. Both can download the card. The link becomes the keepsake.

---

## Edge Cases

### What if Person A closes the browser before B responds?
- No problem. The valentine lives in Supabase.
- When A revisits `/v/7Kx9mP` later, they see the current state:
  - If B hasn't opened: "Waiting for Sam..."
  - If B said yes: Match outcome
  - If B said no: Rejection outcome

### What if Person B opens the link on a different device later?
- Their visitorId is in localStorage, which is device-specific
- If B opens on a new device where they weren't the original opener,
  and the valentine already has a receiver_visitor_id that doesn't match:
  - If complete → show keepsake (anyone can see the result)
  - If not complete → "This valentine is for someone special"
- This is fine. The link was sent to B, B should open it on the device they received it on.

### What if B shares the link with someone else?
- If valentine is unclaimed (no receiver yet): the first person to open claims it
- If valentine is claimed: others see "this is for someone else" or the keepsake
- This is actually desirable for the keepsake sharing

### What if Person A sends the same link to two people?
- First person to open it becomes the receiver
- Second person sees "taken" or keepsake
- Each valentine link is for ONE recipient. Send multiple = create multiple links.

---

## Revised Component Structure

```
src/
├── pages/
│   ├── HomePage.tsx           -- Public landing, "Send a Valentine" CTA
│   ├── CreatePage.tsx         -- Name input + character select + note
│   ├── SharePage.tsx          -- Link + QR + realtime status watching
│   └── ValentinePage.tsx      -- /v/:id — smart router for all roles
│
├── components/
│   ├── pixel-art/
│   │   ├── PixelAlpaca.tsx    -- Alpaca matrix renderer
│   │   ├── PixelDino.tsx      -- Dino matrix renderer
│   │   ├── PixelPanda.tsx     -- Panda matrix renderer
│   │   └── PixelCharacter.tsx -- Wrapper that picks the right one
│   │
│   ├── game/
│   │   ├── StoryIntro.tsx     -- "Someone has a question..." animation
│   │   ├── GameBoard.tsx      -- Characters + "BE MY VALENTINE?" + buttons
│   │   ├── ImpossibleNo.tsx   -- The runaway NO button mechanic
│   │   ├── CountdownReveal.tsx -- 3...2...1... heartbeat
│   │   └── WaitingStatus.tsx  -- Realtime status for sender
│   │
│   ├── outcomes/
│   │   ├── MatchOutcome.tsx   -- YES result with confetti
│   │   ├── RejectOutcome.tsx  -- NO result with sad animation
│   │   └── KeepsakePage.tsx   -- Permanent page after outcome
│   │
│   ├── sharing/
│   │   ├── ShareButtons.tsx   -- Copy, WhatsApp, QR, Share API
│   │   ├── QRCode.tsx         -- QR code display
│   │   └── DownloadCard.tsx   -- Polaroid card generator
│   │
│   └── ui/
│       ├── HeartParticles.tsx -- Floating hearts background
│       ├── Confetti.tsx       -- Heart confetti rain
│       └── ValentineCounter.tsx -- "X valentines sent" counter
│
├── data/
│   ├── alpacaMatrix.ts
│   ├── dinoMatrix.ts
│   └── pandaMatrix.ts
│
├── hooks/
│   ├── useValentine.ts        -- Load + subscribe to valentine
│   └── useVisitorId.ts        -- localStorage visitor identity
│
├── lib/
│   └── supabase.ts
│
└── App.tsx                    -- Router
```

---

## What to Build in Lovable (Phase 1)

Since Lovable can't do Supabase, we mock the realtime parts:

### Lovable Scope:
1. **HomePage** — landing with counter (hardcoded number)
2. **CreatePage** — name input + character select + optional note
3. **GameBoard** — the receiver's experience (story intro → buttons → outcome)
4. **ImpossibleNo** — the runaway button mechanic
5. **CountdownReveal** — 3...2...1... heartbeat
6. **MatchOutcome** — confetti + names + date
7. **RejectOutcome** — sad animation
8. **All three character pixel arts** — alpacas, dinos, pandas

### What We Mock in Lovable:
- "Share link" → just shows a fake URL
- Realtime status → skip entirely
- Visitor identity → skip
- Instead: clicking "Create" goes straight to a preview of what B sees
- Both YES and NO clickable for testing all outcomes

### What Cursor Adds Later:
- Supabase integration
- Real link generation
- Visitor identity + role detection
- Realtime status updates
- QR code
- Download card (html2canvas)
- Valentine counter (real)

---

## Summary: The Logical Flow

```
Person A: "I want to ask Sam to be my valentine"
    │
    ▼
Homepage → Create Page
    │  (enters: Alex, Sam, dinos, optional note)
    │
    ▼
Valentine created in DB (sender_choice = YES automatically)
    │
    ▼
Share Page → gets link valentine-alpaca.app/v/7Kx9mP
    │  (copies/shares/QR to Sam)
    │  (watches realtime: "waiting..." → "opened!" → "deciding..." → result)
    │
    ▼
Person B: Sam opens the link
    │
    ▼
Story Intro → "Someone has a question for you..."
    │  → Alex's dino walks in
    │  → Love note appears (if any)
    │  → "BE MY VALENTINE?"
    │
    ▼
Sam sees: Alex's dino (left, hopeful) + Sam's dino (right, deciding)
    │  Only Sam has buttons. Alex already said yes.
    │
    ▼
Sam chooses YES (or battles the impossible NO button)
    │
    ▼
Countdown: 3... 2... 1...
    │
    ▼
Outcome: Match! (or rejection)
    │  Both screens update. Both see result.
    │
    ▼
Keepsake: Link becomes permanent page
    │  Download polaroid card
    │  Share to stories
    │  "Send your own valentine" ← VIRAL LOOP
    │
    ▼
Sam sends their own valentine to someone else...
    │  The cycle continues.
```

**No redundant buttons. No confusion about who says what. The link IS the yes. The receiver IS the one who decides.**
