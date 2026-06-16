# Gate 4 Entry Baseline

## Snapshot

- Date: 2026-06-16
- Branch: `feat/gate2-implementation`
- HEAD baseline: `67fd8b9da0cad755f1f26e27a6d1a03a2905cfcf`
- Preview target: `http://127.0.0.1:3011`

## Covered routes

- `/`
- `/en`
- `/about`
- `/en/about`
- `/contact`
- `/en/contact`
- `/faq`
- `/en/faq`
- `/products/manual-powder-coating-gun/manual-powder-spray-gun`
- `/en/products/manual-powder-coating-gun/manual-powder-spray-gun`
- `/videos/powder-gun-operation`
- `/en/videos/powder-gun-operation`
- `/news`
- `/en/news`
- `/search?q=spray`
- `/en/search?q=spray`
- `/missing-route-check`
- `/en/missing-route-check`
- `/sitemap.xml`
- `/robots.txt`

## Baseline results

- Indexable pages return `200`, locale-appropriate `html lang`, localized title, canonical, and hreflang set.
- Reserved pages remain reachable but non-indexable:
  - `/news`, `/en/news` -> `noindex,nofollow`
  - `/search?q=spray`, `/en/search?q=spray` -> `noindex,nofollow`
- System missing-route checks return `404` with `noindex`:
  - `/missing-route-check`
  - `/en/missing-route-check`
- `/sitemap.xml` and `/robots.txt` both return `200` with non-empty bodies.
- No sampled route in this baseline emitted a visible runtime error.

## Known exceptions carried forward

- `R-005`: legacy product URLs listed in `GATE3_LEGACY_URL_GAP_REPORT.md` still block full URL-parity acceptance.
