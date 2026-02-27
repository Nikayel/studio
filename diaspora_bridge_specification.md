# Diaspora Bridge: Platform Specification

## Direct Donations for Afghan Girls' Education

---

# 1. CONCEPT

## 1.1 Vision

Diaspora Bridge is a content-driven donation site for Afghan girls' education. You travel to Afghanistan, film families and students, post content on social media, and link to the site where donors can choose a specific person to support. 100% of donations go directly to families — hand-delivered in cash.

## 1.2 How It Works

```
You film in Afghanistan → Post on TikTok/Instagram/YouTube →
Viewers go to site → Browse profiles → Pick a person → Donate via Stripe →
You deliver cash directly to families
```

## 1.3 Core Principles

- **100% to families** — no platform fee, no overhead cut
- **Content-first** — social media videos are the primary discovery channel, not the website
- **Radical transparency** — donors see exactly who they're helping through your content
- **You are the trust layer** — no NGOs, no intermediaries, your face and reputation on the line
- **Simplicity** — no accounts, no subscriptions, no complexity

## 1.4 Target Users

### Donors

- People who see your content on social media and want to help
- Afghan diaspora (US, UK, Germany, Canada, Australia)
- General public moved by the stories
- No account required — just pick a person and donate

### Recipients

- Families and students you personally meet and film in Afghanistan
- You verify everyone in person
- Profiles created by you via admin panel

---

# 2. TECH STACK

| Layer      | Technology               | Rationale                                  |
| ---------- | ------------------------ | ------------------------------------------ |
| Framework  | Next.js 14 (App Router)  | SSR for SEO, fast load, API routes         |
| Language   | TypeScript               | Type safety                                |
| Styling    | Tailwind CSS + shadcn/ui | Rapid UI, consistent design                |
| Database   | Supabase (PostgreSQL)    | Profiles, donations, storage               |
| Storage    | Supabase Storage         | Profile photos with CDN                    |
| Auth       | Supabase Auth            | Admin login only (password-protected)      |
| Payments   | Stripe                   | One-time donations (Stripe Checkout)       |
| Hosting    | Vercel                   | Auto-scaling, fast deploys                 |
| Analytics  | Vercel Analytics         | Traffic and performance                    |
| Monitoring | Sentry                   | Error tracking                             |

### Architecture

```
┌──────────────────────────────────────────────────┐
│                  PUBLIC SITE                       │
│  Landing Page → Browse Profiles → Donate (Stripe) │
└──────────────────────┬───────────────────────────┘
                       │
┌──────────────────────┴───────────────────────────┐
│               NEXT.JS API ROUTES                  │
│  GET /profiles  │  POST /donate  │  Stripe Webhook│
└──────────────────────┬───────────────────────────┘
                       │
┌──────────────────────┴───────────────────────────┐
│                   SUPABASE                        │
│  PostgreSQL │ Storage (photos) │ Auth (admin only)│
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│               ADMIN PANEL (/admin)                │
│  Add/edit profiles │ View donations │ Toggle      │
│  Upload photos     │ per person     │ visibility  │
└──────────────────────────────────────────────────┘
```

---

# 3. FEATURES

## 3.1 Public Site

### Landing Page

**Purpose**: Convert social media visitors into donors

**Sections**:

1. Hero — your story, why you're doing this, embedded video
2. Impact stats — how many people helped, total raised (live counter)
3. How it works — 3 steps: You film → They choose → Families receive
4. Featured profiles — 3-4 profile cards linking to browse page
5. Transparency section — "100% goes to families. Here's how."
6. Your social links (TikTok, Instagram, YouTube)
7. FAQ

**Key elements**:

- Sticky nav with "Donate Now" button
- Mobile-first design (most traffic from social media on phones)
- Embedded social media videos
- Trust indicators — your face, your story, your accountability

### Browse Profiles Page

**Purpose**: Let donors find the person they want to support

**Layout**:

- Grid of profile cards (3 columns desktop, 1 mobile)
- Search by name or ID
- Optional filter by location
- Each card links to donate flow

**Profile Card**:

```
┌─────────────────────────────────┐
│  [Photo]                        │
│                                 │
├─────────────────────────────────┤
│  Fatima R. (#012)               │
│  Kabul                          │
│                                 │
│  "I want to study medicine"     │
│                                 │
│  Raised: $120 (if visible)      │
│                                 │
│  [      Donate      ]           │
└─────────────────────────────────┘
```

### Donate Flow

**Purpose**: Collect donation with minimal friction

**Steps** (single page, no account needed):

1. Person selected (from profile card or search)
2. Enter donation amount (preset buttons: $25, $50, $100, custom)
3. Stripe Checkout (handles card details, Apple Pay, Google Pay)
4. Thank you page with share buttons

**Design notes**:

- No account creation
- No recurring subscriptions (keep it simple for now)
- Stripe Checkout handles all payment UI and security
- Thank you page encourages sharing on social media

## 3.2 Admin Panel (password-protected)

**Purpose**: You manage profiles and track donations from your phone

**Features**:

- **Add profile**: Name/ID, photo upload, location, short bio, goals
- **Edit profile**: Update any field
- **Toggle donation visibility**: Show or hide "amount raised" per profile
- **Deactivate profile**: Remove from public browse without deleting data
- **Donations view**: Total raised per person, total overall, recent donations list
- **Mark as delivered**: Track which families have received their cash

**Design notes**:

- Mobile-friendly (you'll use this from Afghanistan)
- Simple forms, fast photo upload
- Password-protected via Supabase Auth (single admin account)

---

# 4. DATABASE SCHEMA

```sql
-- Profiles you create for each person/family
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,           -- "Fatima R." or chosen identifier
  profile_id TEXT UNIQUE NOT NULL,      -- Short public ID like "#012"
  location TEXT,                        -- City name (e.g., "Kabul")
  bio TEXT,                             -- Short description / their story
  goals TEXT,                           -- What they want to study/achieve
  photo_url TEXT,                       -- Supabase Storage URL
  funding_goal DECIMAL(10,2),           -- Optional target amount
  show_amount_raised BOOLEAN DEFAULT false, -- Toggle donation total visibility
  is_active BOOLEAN DEFAULT true,       -- Show/hide from public site
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Every donation through Stripe
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  amount DECIMAL(10,2) NOT NULL,        -- Donation amount in USD
  donor_name TEXT,                       -- Optional, if donor provides it
  donor_email TEXT,                      -- For receipt, optional
  stripe_session_id TEXT UNIQUE,         -- Stripe Checkout session
  stripe_payment_intent_id TEXT,         -- For tracking/refunds
  status TEXT DEFAULT 'pending',         -- pending, completed, failed, refunded
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Track cash delivery to families
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  amount DECIMAL(10,2) NOT NULL,         -- Amount delivered in USD equivalent
  local_amount DECIMAL(10,2),            -- Amount in AFN if applicable
  method TEXT DEFAULT 'cash',            -- cash, hawala, mobile_money
  notes TEXT,                            -- Any context
  delivered_at TIMESTAMPTZ DEFAULT now(),
  photo_proof_url TEXT                   -- Optional receipt/proof photo
);
```

### Row Level Security

```sql
-- Public: can read active profiles
CREATE POLICY "Public can view active profiles"
  ON profiles FOR SELECT
  USING (is_active = true);

-- Public: can read completed donations (for amount raised display)
CREATE POLICY "Public can view completed donations"
  ON donations FOR SELECT
  USING (status = 'completed');

-- Admin: full access to everything
-- (via Supabase Auth, single admin user)
```

---

# 5. KEY FLOWS

## 5.1 Donor Flow

```
1. Sees your video on TikTok/Instagram
2. Clicks link in bio → lands on site
3. Browses profiles OR searches by name/ID from the video
4. Clicks "Donate" on a profile
5. Enters amount (preset or custom)
6. Redirected to Stripe Checkout
7. Pays (card, Apple Pay, Google Pay)
8. Stripe webhook confirms payment → donation recorded
9. Thank you page → share buttons
```

## 5.2 Admin Flow (You)

```
1. Log in to /admin
2. Add new profile: name, photo, location, bio, goals
3. Profile goes live on the public site
4. View incoming donations per person
5. When you deliver cash: mark as delivered with amount + optional proof photo
6. Toggle donation visibility per profile as needed
7. Deactivate profiles when fully funded or no longer needed
```

## 5.3 Stripe Integration

- **Stripe Checkout** (hosted by Stripe) — handles all payment UI
- **Webhook endpoint** (`/api/webhooks/stripe`) — listens for `checkout.session.completed`
- **Metadata** — each checkout session includes the `profile_id` so donations are attributed correctly
- No recurring billing — one-time payments only for now

---

# 6. UI/UX DESIGN

## 6.1 Design Principles

- **Trust** — your face, your story, full transparency
- **Dignity** — present families with respect, not pity
- **Speed** — 3 clicks from landing to Stripe checkout
- **Mobile-first** — 80%+ traffic will come from phones via social media
- **Simplicity** — no accounts, no clutter, no friction

## 6.2 Color Palette

```
Primary:    #1E3A5F  (Deep Blue - trust)
Secondary:  #D4A574  (Warm Sand - Afghan landscape)
Accent:     #E07A5F  (Coral - action buttons)
Success:    #59C3C3  (Teal - confirmation)
Background: #F7F5F3  (Warm White)
Text:       #2D3748  (Charcoal)
Text Light: #718096  (Gray)
```

## 6.3 Typography

- **Font**: Inter (headings + body)
- **Scale**: 1.25 ratio, 16px base

## 6.4 Key Pages

| Page            | Route            | Purpose                          |
| --------------- | ---------------- | -------------------------------- |
| Landing         | `/`              | Your story + featured profiles   |
| Browse Profiles | `/profiles`      | Grid of all active profiles      |
| Donate          | `/donate/[id]`   | Amount selection + Stripe        |
| Thank You       | `/thank-you`     | Confirmation + share buttons     |
| Admin Login     | `/admin`         | Password login                   |
| Admin Dashboard | `/admin/dashboard` | Donations overview             |
| Add Profile     | `/admin/profiles/new` | Create new profile            |
| Edit Profile    | `/admin/profiles/[id]` | Edit existing profile        |
| Deliveries      | `/admin/deliveries` | Track cash deliveries          |

## 6.5 Mobile Considerations

- Thumb-friendly buttons (min 44px)
- Full-width cards on mobile
- Fast image loading (optimized/compressed photos)
- Sticky "Donate" button on profile view
- Share buttons optimized for mobile (native share API)

---

# 7. EDGE CASES & RISKS

## 7.1 Payment & Financial

| Risk | Mitigation |
| ---- | ---------- |
| Stripe restricts Afghanistan-related transactions | You are collecting donations in your own country (US/UK/etc.), not sending money via Stripe to Afghanistan. Stripe processes the donation to you. You deliver cash in person. This is a personal fundraising model, not a money transfer service. Still — confirm with Stripe's terms. |
| Donor chargebacks | Clear "donations are non-refundable" messaging. Stripe provides dispute tools. Keep donation receipts. |
| Currency risk (USD → AFN) | Track exchange rate at time of delivery. Record both USD and AFN amounts in deliveries table. |
| Large single donation (fraud) | Stripe's built-in fraud detection. Consider setting a max donation amount ($500-$1000). |

## 7.2 Safety & Privacy

| Risk | Mitigation |
| ---- | ---------- |
| Families identified and targeted | Discuss with each family what they're comfortable sharing. Use first name + last initial only. Avoid identifiable landmarks in photos. Families can request removal anytime. |
| Your personal safety in Afghanistan | Separate concern from the platform, but worth noting: don't publicize exact travel dates/locations in advance. |
| Photos used without consent | Get verbal or written consent from every person you photograph. Explain where photos will appear. |

## 7.3 Operational

| Risk | Mitigation |
| ---- | ---------- |
| You can't deliver to a specific family | Be transparent with donors. Offer to redirect to another family or refund. |
| More money raised than you can deliver on one trip | Track delivery status in admin. Communicate timeline to donors. Multiple trips or trusted local contact for future deliveries. |
| Viral traffic spike | Vercel auto-scales. Supabase handles connection pooling. Stripe Checkout is hosted by Stripe. The site is mostly static — it'll hold up. |
| You lose phone access in Afghanistan | Have admin credentials backed up. Consider a trusted backup admin account. |

## 7.4 Legal & Compliance

| Risk | Mitigation |
| ---- | ---------- |
| Tax implications of collecting donations | Consult a tax advisor. If collecting as an individual, donations are likely not tax-deductible for donors. Consider fiscal sponsorship (e.g., Open Collective) if you want to offer tax receipts. |
| OFAC sanctions compliance | You're not sending money through the banking system to Afghanistan. You're carrying and distributing cash personally. Still — consult a lawyer on limits and reporting requirements. |
| Money transmission laws | Personal delivery of charitable funds is generally different from operating a money services business. Get legal guidance before scaling. |

---

# 8. IMPLEMENTATION ROADMAP

## Phase 1: Build & Launch (1-2 weeks)

- [ ] Set up Next.js + Supabase + Stripe project
- [ ] Database tables + Row Level Security
- [ ] Landing page with your story + embedded video
- [ ] Browse profiles page (grid + search)
- [ ] Donate flow → Stripe Checkout
- [ ] Stripe webhook for payment confirmation
- [ ] Thank you page with share buttons
- [ ] Admin login (Supabase Auth)
- [ ] Admin: add/edit/deactivate profiles
- [ ] Admin: view donations per person + total
- [ ] Admin: mark deliveries
- [ ] Deploy to Vercel + custom domain
- [ ] Test end-to-end with Stripe test mode
- [ ] Go live

## Phase 2: After First Trip (Month 2-3)

- [ ] Populate with real profiles from Afghanistan
- [ ] Add delivery proof photos to admin
- [ ] Impact page — total raised, total delivered, photos from trip
- [ ] Email receipts for donors (via Stripe)
- [ ] Social sharing optimization (Open Graph tags, preview cards)
- [ ] Testimonials / follow-up content from families

## Phase 3: Growth (Month 3+)

- [ ] Recurring donations option (Stripe subscriptions)
- [ ] Donor accounts (optional) to track their giving history
- [ ] Multiple language support (Dari, Pashto)
- [ ] Blog / updates page for trip reports
- [ ] Consider nonprofit status or fiscal sponsorship for tax-deductible donations
- [ ] Onboard trusted partners for cash delivery when you're not in-country

---

# 9. SUCCESS METRICS

## North Star

**Total amount delivered to families** (not just raised — delivered)

## Key Metrics

| Metric                    | Target (Month 1) | Target (Month 3) |
| ------------------------- | ---------------- | ---------------- |
| Profiles on site          | 10-20            | 30-50            |
| Total donations           | $2,000           | $15,000          |
| Unique donors             | 50               | 300              |
| Average donation          | $40              | $50              |
| Delivery completion rate  | 100%             | 100%             |
| Social media → site CTR   | 3-5%             | 5-8%             |

## What to Track for Grad Applications

- Total raised and delivered
- Number of families supported
- Social media reach / viral moments
- Technical decisions and trade-offs
- Operational challenges in Afghanistan
- Donor behavior data (average amounts, repeat donors, time-to-donate)

---

# 10. PRE-BUILD CHECKLIST

- [ ] **Domain name** — register your domain
- [ ] **Stripe account** — sign up, verify identity, enable Checkout
- [ ] **Supabase project** — create project, get API keys
- [ ] **Vercel account** — connect to GitHub repo
- [ ] **Content** — at least one video or photo for the landing page (can use placeholder and swap later)
- [ ] **Legal gut-check** — understand your liability as an individual collecting donations. Consider a brief consult with a lawyer.
- [ ] **Social media accounts** — set up or prepare your TikTok/Instagram for the campaign

---

**Document Version**: 2.0
**Last Updated**: February 2026
**Approach**: Content-driven donation site — you film, they donate, you deliver
