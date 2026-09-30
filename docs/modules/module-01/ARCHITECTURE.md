# Module 1: How Financial Markets Work

## Production architecture v1.0

Status: built and in release QA

Syllabus: Level 1, sections 1.1 to 1.13

Prerequisite: Module 0
Prepared: 30 Sep 2026

## 1. Thesis and finish line

**Thesis.** A market is a price system resting on a trust system. Orders and auctions form transaction prices. Brokers, exchanges, clearing corporations, banks, depositories and depository participants complete and record the resulting obligations.

After the module, the learner should be able to:

1. distinguish issuance from secondary trading;
2. trace a stock purchase from order to demat credit;
3. choose an order type and name its missing guarantee;
4. calculate spread, average fill, market capitalisation, free-float capitalisation and simple corporate-action adjustments;
5. explain how index construction changes interpretation;
6. distinguish raw price, adjusted price, price return and total return;
7. verify a broker and an update-sensitive market rule from a primary source.

## 2. MECE content map

| Lesson | Owner | Deliberate boundary |
|---|---|---|
| 1.1 Why markets exist | capital formation, price discovery, liquidity and risk transfer | product characteristics remain in Level 2 |
| 1.2 Primary markets | IPO, FPO, rights route, private placement and debt issuance | valuation of an issue remains in Level 5 |
| 1.3 Secondary markets | continuous trading, call auction and transaction-price meaning | execution optimisation remains in Level 10 |
| 1.4 Exchanges | venue, rulebook, admission, matching, publication and surveillance | detailed regulation remains in Level 23 |
| 1.5 Participants | mandate, constraints and forced flows | behavioural biases remain in Level 9 |
| 1.6 Brokers | access, account roles, service models, cost stack and verification | custody mechanics are owned by 1.7 |
| 1.7 Clearing and settlement | matching versus clearing versus settlement; demat and T+1 | derivative margin and clearing remain in Level 11 |
| 1.8 Order types | market, limit, stop, stop-limit, IOC and persistence | VWAP, TWAP and execution algorithms remain in Levels 10 and 21 |
| 1.9 Bid, ask and spread | quote, depth, spread and walking the visible book | market-impact modelling remains in Level 10 |
| 1.10 Market capitalisation | full and free-float equity value; size-band caution | enterprise value remains in Level 5 |
| 1.11 Market indices | eligibility, selection, weighting, maintenance and return variants | benchmark selection remains in Level 8 |
| 1.12 Corporate actions | distributions, unit changes, rights and reorganisations | tax treatment remains in Level 23 |
| 1.13 Market data | OHLCV, adjustments, total return, ticks and book data | pipeline engineering remains in Level 20 |

Rights issues appear twice in the syllabus. Lesson 1.2 owns the issuance route. Lesson 1.12 owns entitlement arithmetic and the investor decision. Liquidity is reused from Module 0 and deepened into spread, depth, immediacy and resilience in 1.9.

## 3. Learning sequence and design

The module uses the established four-position Part colours:

- Part I, yellow: capital and exchange;
- Part II, cobalt: institutions and people;
- Part III, forest: from order to ownership;
- Part IV, vermilion: how markets are measured;
- ink: overview and integration.

Read surfaces use the shared chapter plates, blocks, tables, checks, notes and navigation. Operate surfaces are limited to five interactions with named learning claims:

| Interaction | Learning claim |
|---|---|
| Trade trace | a match, clearing obligation, settlement and holding record are separate states |
| Order-state laboratory | price control and execution urgency cannot both be guaranteed |
| Order-book laboratory | larger orders consume depth and can change the average fill |
| Index builder | methodology changes weights without changing the constituent set |
| Corporate-action workbench | unit changes and cash distributions must be reconciled before interpreting return |

Motion is limited to the shared chapter transition, state feedback and user-controlled step changes. Reduced-motion behaviour comes from the shared system.

## 4. Assessment architecture

Each lesson has a prediction, knowledge check, calculation or practice ladder as appropriate. The mastery assessment contains:

- three conceptual and interpretive questions;
- three calculations;
- four unfamiliar applications and critiques;
- one written transfer task tracing a partially filled trade through settlement and a dividend.

Results are advisory by competency: Understanding, Calculation, Interpretation and Application.

## 5. Data and source decisions

All laboratory books, companies, holdings and prices are hypothetical. The build contains no fake-live market feed and no return game.

Current claims are restricted to:

1. the Indian cash-equity T+1 settlement framework and optional T+0 segment;
2. NSDL and CDSL as India's depositories and the role of a DP;
3. SEBI and exchange verification of registered brokers;
4. Nifty 50 free-float methodology.

Each claim is date-stamped 30 Sep 2026 and links to the primary source on the lesson page. Everything else is taught as durable mechanism or labelled hypothetical arithmetic.

## 6. Architecture decisions

1. Reuse Part colours by position, preserving the Module 0 wayfinding system.
2. Use no fictional company name that could be mistaken for a current listed issuer; examples use generic hypothetical names.
3. Avoid historical datasets unless licensing and adjustment conventions are known.
4. Exclude speculative or scheduled market changes that are unnecessary to the learning objective.
5. Ship no graded profit-and-loss simulation and no broker comparison by brand.
6. Seed the Gate A equity, debt and derivative distinction in 1.1; derivatives remain owned by Level 11.

## 7. QA contract

Release requires:

- 13 of 13 syllabus lessons present;
- pure calculation functions covered by unit tests;
- every control swept at minimum and maximum without invalid output;
- keyboard access, visible focus and 44px targets;
- desktop and mobile review in light and dark modes;
- no horizontal overflow at 390px or 200% zoom;
- current Web Interface Guidelines review of changed UI files;
- Design Taste pre-flight and Impeccable finish pass;
- source register and module registry updated.
