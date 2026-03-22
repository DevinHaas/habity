# Polar Payments Integration - Environment Variables Reference

## Required Environment Variables

### Core API Configuration
- **POLAR_ACCESS_TOKEN** (required)
  - Description: Polar API access token for SDK authentication
  - Location: `/lib/polar.ts` (line 4)
  - Type: String
  - Usage: Authenticates the Polar SDK client

- **POLAR_SERVER** (optional, defaults to "production")
  - Description: Polar environment (sandbox or production)
  - Location: `/lib/polar.ts` (line 5)
  - Type: Enum: "sandbox" | "production"
  - Usage: Specifies which Polar API environment to use

### Product/Price IDs
- **POLAR_PRO_PRODUCT_ID** (required)
  - Description: Polar product ID for the Pro subscription tier
  - Locations:
    - `/lib/polar.ts` (line 9)
    - `/app/api/polar/webhooks/route.ts` (line 5)
  - Type: String (UUID)
  - Usage: Used in checkout creation and webhook tier mapping

- **POLAR_MAX_PRODUCT_ID** (required)
  - Description: Polar product ID for the Max subscription tier
  - Locations:
    - `/lib/polar.ts` (line 10)
    - `/app/api/polar/webhooks/route.ts` (line 6)
  - Type: String (UUID)
  - Usage: Used in checkout creation and webhook tier mapping

### Webhook Security
- **POLAR_WEBHOOK_SECRET** (required)
  - Description: Secret key for validating incoming webhook signatures
  - Location: `/app/api/polar/webhooks/route.ts` (line 25)
  - Type: String
  - Usage: Passed to `Webhooks()` handler from `@polar-sh/nextjs` for HMAC verification

### Application Configuration
- **NEXT_PUBLIC_APP_URL** (required for checkout redirects)
  - Description: Base URL of the application for checkout success redirects
  - Locations:
    - `/app/api/polar/checkout/route.ts` (line 18)
    - `/app/api/polar/portal/route.ts` (line 15)
  - Type: URL string (e.g., "https://habity.bleat.ch")
  - Usage: Sets the success URL callback in checkout creation

## Environment Variable Summary Table

| Variable | Required | Type | Scope | Example |
|----------|----------|------|-------|---------|
| POLAR_ACCESS_TOKEN | Yes | String | Server-only | `pauth_xxxx...` |
| POLAR_SERVER | No | Enum | Server-only | "production" \| "sandbox" |
| POLAR_PRO_PRODUCT_ID | Yes | UUID | Server-only | `prod_xxxx...` |
| POLAR_MAX_PRODUCT_ID | Yes | UUID | Server-only | `prod_xxxx...` |
| POLAR_WEBHOOK_SECRET | Yes | String | Server-only | `whsec_xxxx...` |
| NEXT_PUBLIC_APP_URL | Yes | URL | Public | `https://habity.bleat.ch` |

## Code Reference Locations

### Polar SDK Initialization
- File: `/lib/polar.ts`
- Exports: `polar` client instance, `POLAR_PRODUCT_IDS` object, `PolarProductKey` type

### API Routes
1. **Checkout Creation**: `/app/api/polar/checkout/route.ts`
   - Creates Polar checkout sessions
   - Requires auth, uses product IDs and app URL

2. **Webhook Handler**: `/app/api/polar/webhooks/route.ts`
   - Handles subscription events: created, active, updated, canceled, revoked
   - Maps product IDs to subscription tiers (free, pro, max)
   - Stores external user ID for customer linking

3. **Customer Portal**: `/app/api/polar/portal/route.ts`
   - Redirects authenticated users to Polar customer portal
   - Requires existing subscription with polarCustomerId

### Database Schema
- File: `/db/schema.ts` (lines 126-142)
- Table: `subscriptions`
- Fields:
  - `polarSubscriptionId`: Unique Polar subscription ID
  - `polarCustomerId`: Polar customer ID (for portal access)
  - `tier`: Subscription tier (free/pro/max)
  - `status`: Subscription status (active/canceled/revoked)
  - `currentPeriodEnd`: Billing cycle end date

### Server Actions
- File: `/db/actions/subscriptions.ts`
- Function: `upsertSubscriptionFromWebhook()` - Called by webhook handler to sync subscription data

## Subscription Tiers

The integration supports three subscription tiers:
- **Free**: Default tier, no Polar product ID
- **Pro**: POLAR_PRO_PRODUCT_ID
- **Max**: POLAR_MAX_PRODUCT_ID

## Webhook Integration

The Polar webhook handler listens for the following events:
- `subscription.created` - New subscription purchased
- `subscription.active` - Subscription is active
- `subscription.updated` - Subscription details changed
- `subscription.canceled` - User canceled (keeps access until period end)
- `subscription.revoked` - Immediate access revocation

Customer linking uses two strategies (in order):
1. `customer.externalId` - Primary (set during checkout as `session.user.id`)
2. `subscription.metadata.userId` - Fallback (stored during checkout)

## Notes

- All Polar environment variables are server-only (not exposed to browser)
- NEXT_PUBLIC_APP_URL must match Docker build-arg for deployed environments
- Webhook secret must be registered in Polar dashboard for the webhook URL: `POST /api/polar/webhooks`
- Product IDs must be valid UUIDs from the Polar dashboard
- Subscription data is synced to local database via webhooks (no polling)
