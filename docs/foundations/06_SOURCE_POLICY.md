# 06 · Source Policy

Version 1.0 · 29 Sep 2026 · Implements Teaching Spec §28–31 and §66.

## 1. Every number has a category

| Category | Meaning | On the page |
|---|---|---|
| Hypothetical | Invented for teaching (Meera, the Nairs, sample loans) | `Hypothetical` tag (dashed pill). Never presented as market data. |
| Historical | Real past data | `Historical: period` tag plus a source line |
| Current | A rule, rate or figure that can change | `Current · verified DATE` tag plus a `Verified` source line naming each source |

Rates and returns chosen as assumptions (for example, a 10% expected return) are labelled "assumed" in the control or the prose.

## 2. Source hierarchy (Spec §29)

1. **Tier 1, primary:** regulators (RBI, SEBI, IRDAI), government (PIB, MoSPI, Income Tax Department, Department of Financial Services), exchanges and depositories, DICGC, court-appointed trustees, company filings, the US SEC and its Inspector General.
2. **Tier 2, high-quality secondary:** reputable financial media, law-firm and legal-database summaries of regulations, established tax portals.
3. **Tier 3:** educational sites and blogs. These may help locate a Tier 1 source; they never stand alone for a current fact.

When only Tier 2 was reachable for a current fact, the page cites the Tier 2 source by name and the release record lists it for a Tier 1 upgrade.

## 3. Date discipline (Spec §31)

- Every current fact shows "Verified DATE".
- Update-sensitive lessons (tax, regulation, rates, reporting channels) are re-verified before each release and whenever a module that depends on them is revised.
- Historical material is never silently rewritten. Changes are logged in the module's release record with a version bump.

## 4. Things the course never does (Spec §66)

It never invents current data, cites a source that was not actually consulted, uses AI output as evidence for its own claims, or presents a hypothetical as current.

## 5. Module 0 verification register

| Fact | Source | Tier | Checked |
|---|---|---|---|
| CPI base 2024 = 100, first release 12 Feb 2026, 358 items (from 299), food and beverages weight 36.75%, market coverage | PIB / MoSPI press release | 1 | 29 Sep 2026 |
| All-India CPI inflation July 2026: 4.45% (rural 4.84%, urban 3.96%, food 5.52%), released 12 Aug 2026 | PIB / MoSPI | 1 | 29 Sep 2026 |
| August 2026 CPI (4.82%, reported 14 Sep 2026) | Secondary media only | 2 | Not shown as verified; upgrade pending |
| Inflation target 4% ±2%, Apr 2026 to Mar 2031, notified 25 Mar 2026 | Business Standard, reporting the gazette notification | 2 | 29 Sep 2026 (Tier 1 gazette link to add in Module 6) |
| RBI repo rate 5.25% (5 Aug 2026), neutral stance | IIFL report of the RBI statement | 2 | Background only; not stated on Module 0 pages |
| Annual CPI-C inflation 2014-15 to 2019-20 | Economic Survey 2020-21, Vol. 2, Ch. 5, Table 1 | 1 | 29 Sep 2026 |
| Income-tax Act 2025 in force from 1 Apr 2026; "tax year"; slabs unchanged for 2026-27 | ClearTax summary | 2 | 29 Sep 2026 |
| New-regime slabs, ₹12 lakh rebate, ₹75,000 standard deduction | PIB, Budget 2025-26 | 1 | 29 Sep 2026 |
| New regime as default | Income Tax Department help page | 1 | 29 Sep 2026 |
| DICGC ₹5 lakh per depositor per bank; "same right and same capacity" | DICGC information booklet | 1 | 29 Sep 2026 |
| Credit-card rules: no negative amortisation, suspended interest-free period, late fees only on overdue amount, 3-day past-due rule | RBI Master Direction, para 9(b) | 1 | 29 Sep 2026 |
| No prepayment charges on floating-rate individual non-business loans sanctioned or renewed from 1 Jan 2026 | RBI (Pre-payment Charges on Loans) Directions, 2025 (text via law-firm copy) | 1 | 29 Sep 2026 |
| GST exemption on individual life and health insurance from 22 Sep 2025 (previously 18%) | Department of Financial Services | 1 | 29 Sep 2026 |
| Health moratorium 5 years; pre-existing-disease waiting period ≤ 36 months; free-look 30 days; claim timelines | IRDAI master circulars (2024), via Nyvo and Business Today | 2 | 29 Sep 2026 (Tier 1 circular links to add) |
| 1930 helpline; cybercrime.gov.in | PIB, Ministry of Home Affairs, 18 Dec 2024 | 1 | 29 Sep 2026 |
| "Digital arrest" scams described in Parliament, 10 Dec 2024 | PIB | 1 | 29 Sep 2026 |
| SEBI validated UPI handles (@valid) and SEBI Check, from 1 Oct 2025 | SCC Online summary of the SEBI circular | 2 | 29 Sep 2026 |
| Madoff: arrested 11 Dec 2008; SEC OIG found 6 substantive complaints (1992–2008), 3 examinations, 2 investigations | SEC OIG-509 executive summary | 1 | 29 Sep 2026 |
| Madoff recoveries ≈ $15.485 billion as of 21 Aug 2026 | Madoff SIPA Trustee | 1 | 29 Sep 2026 |
| Saradha Realty SEBI order, 23 Apr 2013: wind up, refund within 3 months, market ban | SEBI order | 1 | 29 Sep 2026 |
| RBI Sachet portal for unauthorised deposit schemes | RBI Sachet site (listing) | 1 | 29 Sep 2026 |

## 6. Module 1 verification register

| Fact | Source | Tier | Checked |
|---|---|---|---|
| Indian cash-equity trades on NSE generally settle on T+1; an optional T+0 segment exists for eligible trades | NSE Clearing and Settlement; NSE Market Segments | 1 | 30 Sep 2026 |
| NSDL and CDSL are India's depositories; investors use a depository participant to maintain a demat account | SEBI Investor; NSDL e-guide | 1 | 30 Sep 2026 |
| Investors should verify a broker's registration on SEBI and exchange websites | SEBI FAQ on Stock Brokers; SEBI Recognised Intermediaries | 1 | 30 Sep 2026 |
| Nifty 50 is calculated using free-float market capitalisation | NSE Nifty 50; NSE Investible Weight Factors | 1 | 30 Sep 2026 |

All Module 1 order books, company figures, prices, index constituents and corporate-action arithmetic are hypothetical and labelled on the page.
