# Module 0: Personal Finance & Wealth Foundations
## Production Architecture v1.0 (Phase A) and Self-Audit (Phase B)

Status: architecture approved for build after self-audit (Part B)
Syllabus source: Final Master Syllabus v2.0, Level 0 (0.1 to 0.11, Project 0)
Pedagogy source: Master Teaching, Content & Interactive Design Specification v1.0
Prepared: 29 Sep 2026

---

# PART A: ARCHITECTURE

## A0. Module thesis

**Big idea of the module (what should survive five years):**
Your finances are a system of *stocks* (what you own and owe) and *flows* (what comes in and goes out). Time converts flows into stocks through compounding. Inflation, taxes and expensive debt drain that conversion. Liquidity and insurance protect it from shocks. Fraud attacks it directly.

**Why this module comes first:** Investment skill is worthless if the household system underneath it leaks: no buffer, 40% credit-card debt, no insurance, no idea of real returns. Level 0 builds that system and the mathematics of time (compounding, discounting, real returns) that every later level depends on.

**Milestone served:** Milestone 1 (Financially Literate). The module also prepares one Gate A item: "how compounding and inflation interact".

**Running example (hypothetical, used across all lessons, per Spec §40):**
Meera Iyer, 29, product analyst in Pune. Gross salary ₹15 lakh a year. Take-home about ₹1.10 lakh a month. Rents a flat. Has a credit-card balance, an education loan, a small FD, mutual funds and EPF. No dependants today. A second household (the Nairs, 38, two earners, one child, a home loan) is used where dependants, mortgages and life cover matter.

---

## A1. Syllabus coverage map (every Level 0 requirement)

Lesson IDs match syllabus IDs for traceability in the Module Registry.

| Syllabus item | Lesson / section | Treatment |
|---|---|---|
| 0.1 income vs wealth | L0.1 §Flows and stocks | Core; bathtub model |
| 0.1 assets vs liabilities | L0.1 §What you own and owe (formalised in L0.3) | Intro, then formal |
| 0.1 consumption vs saving | L0.1 §Where income goes | Core |
| 0.1 saving vs investing | L0.1 §Saving is not investing | Core + misconception |
| 0.1 financial capital | L0.1 §Two kinds of capital | Core |
| 0.1 human capital | L0.1 §Two kinds of capital (intuition); L0.9 (quantified via PV) | Intuition, quantified after TVM |
| 0.1 purchasing power | L0.1 §Rupees vs what rupees buy (intuition); L0.5 (formal) | Intro then formal |
| 0.1 nominal vs real wealth | L0.1 (intuition); L0.5 (formula) | Intro then formal |
| 0.2 income | L0.2 §Gross to take-home | Core; Meera's waterfall |
| 0.2 fixed expenses | L0.2 §Three kinds of spending | Core |
| 0.2 variable expenses | L0.2 §Three kinds of spending | Core |
| 0.2 discretionary expenses | L0.2 §Three kinds of spending | Core |
| 0.2 savings rate | L0.2 §Savings rate | Formula + definitional pitfalls |
| 0.2 free cash flow | L0.2 §Free cash flow | Formula; link to corporate FCF (L3.12) |
| 0.2 lifestyle inflation | L0.2 §Lifestyle inflation + Explorer | Simulation |
| 0.3 assets | L0.3 §Assets | Classification by liquidity and purpose |
| 0.3 liabilities | L0.3 §Liabilities | Core |
| 0.3 net worth | L0.3 §Net worth | Formula |
| 0.3 liquid net worth | L0.3 §Liquid net worth | Formula + why it matters |
| 0.3 leverage | L0.3 §Leverage + Explorer | Amplification maths; risk of ruin preview |
| 0.4 simple interest | L0.4 §Simple interest | Formula |
| 0.4 compound interest | L0.4 §Compounding + Explorer | Formula + interactive |
| 0.4 present value | L0.4 §Present value | Formula |
| 0.4 future value | L0.4 §Future value | Formula |
| 0.4 discounting | L0.4 §Discounting | Mechanism + Explorer |
| 0.4 CAGR | L0.4 §CAGR | Formula + arithmetic-average trap |
| 0.4 annualisation | L0.4 §Annualisation | Effective annual rate; short-period trap |
| 0.4 opportunity cost | L0.4 §Opportunity cost | Worked example; reappears L0.7, L0.8 |
| 0.5 CPI | L0.5 §What CPI measures | Basket index; 2024-base series (current fact) |
| 0.5 purchasing-power erosion | L0.5 §Erosion + historical chart | Formula; Indian CPI 2014-20 (historical) |
| 0.5 nominal returns | L0.5 §Nominal vs real | Core |
| 0.5 real returns | L0.5 §Real returns | Fisher formula; subtraction approximation error |
| 0.5 inflation expectations | L0.5 §Expectations | Why they matter; RBI 4% target (current fact) |
| 0.6 short/medium/long-term goals | L0.6 §Horizons | Horizon ↔ tolerance for volatility |
| 0.6 retirement | L0.6 §Retirement | Worked example, long horizon |
| 0.6 housing | L0.6 §Housing | Down-payment goal; rent vs buy as question (not verdict) |
| 0.6 education | L0.6 §Education | Worked example + Goal Planner |
| 0.6 major purchases | L0.6 §Major purchases | Short-horizon example |
| 0.6 goal-based investing | L0.6 §Goal-based investing | Principle; product choice deferred to L2/L8 |
| 0.7 liquidity | L0.7 §Why liquidity | Core |
| 0.7 sizing | L0.7 §Sizing + Explorer | Method, not a single rule |
| 0.7 opportunity cost | L0.7 §The cost of safety | Quantified |
| 0.7 appropriate instruments | L0.7 §Where to keep it | Savings, sweep FD, FD, liquid funds; DICGC (current fact) |
| 0.8 secured vs unsecured | L0.8 §Kinds of debt | Core |
| 0.8 interest | L0.8 §Price of borrowing | Link to L0.4 |
| 0.8 EMI | L0.8 §EMI | Annuity formula derived from PV |
| 0.8 amortisation | L0.8 §Amortisation + Loan Lab | Schedule chart |
| 0.8 reducing balance | L0.8 §Reducing vs flat | Flat-rate trap, worked example |
| 0.8 credit cards | L0.8 §Credit cards + simulator | Minimum-due trap; RBI rules (current fact) |
| 0.8 personal loans | L0.8 §Personal loans | Flat-rate comparison |
| 0.8 mortgages | L0.8 §Home loans | Worked example (Nairs) |
| 0.8 refinancing | L0.8 §Refinancing | Break-even calculation |
| 0.8 prepayment | L0.8 §Prepayment | Tenure vs EMI; RBI prepayment directions (current fact) |
| 0.9 risk transfer | L0.9 §Why insurance exists + Pooling simulator | Core |
| 0.9 life insurance | L0.9 §Life cover | Core |
| 0.9 term insurance | L0.9 §Term insurance | Core |
| 0.9 health insurance | L0.9 §Health cover | Sum insured, waiting periods (current fact) |
| 0.9 vehicle insurance | L0.9 §Vehicle | Third-party vs own damage |
| 0.9 property insurance | L0.9 §Property | Core |
| 0.9 insurance vs investment products | L0.9 §Mixing the two | IRR comparison (hypothetical figures) |
| 0.9 coverage adequacy | L0.9 §How much cover | Needs-based method using PV |
| 0.10 taxes (intro for after-tax decisions) | L0.10 | Marginal vs average rate, after-tax return, tax drag; current slabs date-stamped; detail deferred to L23 |
| 0.11 Ponzi schemes | L0.11 §Ponzi mechanics + simulator | Core + Madoff case |
| 0.11 guaranteed-return claims | L0.11 §The guarantee test | Links to L0.4/L0.5 |
| 0.11 investment scams | L0.11 §Scam patterns | Saradha (India) |
| 0.11 phishing | L0.11 §Phishing | Core |
| 0.11 impersonation | L0.11 §Impersonation, digital arrest | Current fact (MHA/I4C) |
| 0.11 account security | L0.11 §Account security | Checklist |
| 0.11 broker security | L0.11 §Broker security | SEBI @valid UPI, SEBI Check (current fact); broker concept preview of L1.6 |
| 0.11 cybersecurity | L0.11 §Cyber hygiene; reporting 1930 | Current fact |
| PROJECT 0 | Project 0: Personal Financial Dashboard | In-browser tool, private to learner |

---

## A2. Prerequisites and assumed knowledge

Module 0 is the entry point, so nothing from the course is assumed. Assumed general knowledge:

- School arithmetic: percentages, fractions, basic algebra (solve for one unknown).
- Reading a line chart and a bar chart.
- Everyday familiarity with a bank account, UPI, a salary slip.

**Not assumed (must be taught or explicitly deferred):** exponents beyond squares (taught in L0.4 at the level needed; formal treatment L12.2), logarithms (not used; solving for time is done numerically; logs deferred to L12.3), products (mutual funds, ETFs, bonds; only named, with forward links to L2), market mechanics (L1), spreadsheets/Python (L13).

---

## A3. Concepts newly introduced (seed the Global Glossary)

income; wealth; stock (financial sense of a level) vs flow; asset; liability; consumption; saving; investing; financial capital; human capital; purchasing power; nominal; real; take-home pay; fixed / variable / discretionary expense; savings rate; free cash flow (personal); lifestyle inflation; net worth; liquid net worth; liquidity; leverage; debt-to-income; simple interest; compound interest; compounding; future value; present value; discount rate; discounting; annuity (intro); CAGR; annualisation; effective annual rate; opportunity cost; inflation; CPI; base year; real return; inflation expectations; inflation target; goal horizon; goal-based investing; required contribution (SIP intro); emergency fund; runway; DICGC deposit insurance; secured / unsecured debt; collateral; EMI; amortisation; reducing balance; flat rate; minimum amount due; revolving credit; refinancing; prepayment; risk transfer; risk pooling; expected loss; premium; sum assured; sum insured; term insurance; waiting period; moratorium period; co-payment; deductible; free-look period; human life value; needs-based cover; marginal tax rate; average (effective) tax rate; after-tax return; tax drag; Ponzi scheme; phishing; impersonation; two-factor authentication; SIM swap.

---

## A4. Lesson sequence and pedagogical rationale

The module is grouped into four parts. Order within the module follows the syllabus (preserves traceability) with one deliberate exception in *depth*: concepts that need present value (human capital, cover adequacy) are introduced intuitively early and quantified after L0.4.

| Part | Lessons | Rationale |
|---|---|---|
| I. The household as a system | 0.1 Money, income, wealth; 0.2 Cash flow; 0.3 Balance sheet | Vocabulary and structure first: flows (0.2) and stocks (0.3), joined by the stock/flow model (0.1). Everything later plugs into these two statements. |
| II. Time and purchasing power | 0.4 Time value of money; 0.5 Inflation | The mathematical core. Compounding turns flows into stocks over time; inflation decides what those stocks are worth. Real return is the bridge. |
| III. Plans and buffers | 0.6 Goals; 0.7 Emergency funds | Applies II: a goal is a future value in future (inflated) rupees; an emergency fund is liquidity sized from the cash-flow statement. |
| IV. Threats to the system | 0.8 Debt; 0.9 Insurance; 0.10 Taxes; 0.11 Fraud | Each is a force that drains or protects the system: debt is compounding working against you, insurance moves catastrophic risk off the balance sheet, tax cuts the return rate, fraud attacks the stock directly. |
| Integration | Module synthesis; Mastery assessment; Project 0 | Rebuilds the whole system for the learner's own numbers. |

Within each lesson, the teaching ladder of Spec §4: why → intuition → prediction → example → visual/interactive → formal definition → mathematics → realistic example → failure modes → practice → transfer.

---

## A5 to A13. Lesson-by-lesson plan

Each lesson block lists: big idea (A5), mental models (A6), mathematics (A7), worked examples (A8), visualisations (A9), interactions (A10), misconceptions (A11), assumptions/failure modes (A12), cases (A13). All numbers are **hypothetical** unless tagged Historical or Current.

### L0.1 Money, Income and Wealth

- **Big idea:** Income is a flow; wealth is a stock. You get rich from the gap between flows, kept over time, not from the size of the inflow.
- **Why it exists:** People with high incomes and no wealth exist everywhere; the distinction explains them.
- **Mental models:** (1) The bathtub: tap = income, drain = consumption, water level = wealth. (2) Two engines: human capital (your future earning power, largest asset when young) and financial capital (what you have already accumulated). Over a life, human capital is converted into financial capital. (3) Rupees vs baskets: a rupee is a claim on goods; its size shrinks when prices rise.
- **Prediction prompt:** Two people each earn ₹1.2 lakh/month. Who is wealthier after 10 years: one who spends ₹1.1 lakh or one who spends ₹90,000? (Obvious; then the twist: the higher spender got 20% raises, the lower spender 8%. Reveal depends on spending growth.)
- **Mathematics:** Wealthₜ = Wealthₜ₋₁ + Income − Consumption (+ return on wealth, previewed). Nominal vs real, intuitive only (real = nominal ÷ price level).
- **Worked example:** Meera's first-job snapshot: human capital vs financial capital shown as two bars; illustrative present value of future salary (computed with the method later taught in L0.4; figure shown with forward link, no formula yet).
- **Visual:** Stock/flow diagram (SVG) with labelled tap, drain, level.
- **Interactive:** *Bathtub Explorer*: income, spending, growth of each, years; chart shows wealth level; toggle "show in today's rupees". Purpose: see that a stock is the accumulation of a flow gap, and that spending growth matters as much as income growth.
- **Misconceptions:** "High income = wealthy." "Saving means investing." "My house is my wealth, so I am fine" (wealth ≠ liquidity; preview L0.3).
- **Failure modes:** The bathtub ignores returns, taxes, shocks; each added in later lessons.
- **Cases:** None needed; the running example carries it.

### L0.2 Personal Cash Flow

- **Big idea:** Savings is not what is left over by accident. It is a line in the budget, and its rate matters more than its rupee amount.
- **Mental models:** The waterfall: gross pay → deductions → take-home → fixed → variable → discretionary → free cash flow. Fixed costs are commitments; discretionary costs are choices.
- **Prediction:** Meera gets a ₹20,000/month raise. If she spends ₹15,000 of it, what happens to her savings rate? (Rises only slightly; show why.)
- **Mathematics:** Savings rate = (take-home − consumption) ÷ take-home. State which denominator is used (gross vs take-home; EPF counted or not). Personal free cash flow = take-home − essential commitments (fixed + necessary variable). Lifestyle inflation: expenses growth g_E vs income growth g_I; long-run savings rate converges down if g_E > g_I.
- **Worked example:** Meera's monthly budget (hypothetical, rupee lines): take-home ₹1,10,000; rent ₹28,000; utilities/phone ₹3,500; groceries ₹9,000; transport ₹5,000; insurance ₹1,500; education-loan EMI ₹6,800; eating out/shopping/travel ₹22,000; subscriptions ₹1,200. Savings ₹33,000 → 30%.
- **Visual:** Waterfall chart of the month.
- **Interactive:** *Lifestyle Inflation Explorer*: raise rate, share of each raise spent, years → savings rate path and cumulative savings, compared with a "hold spending growth to inflation" baseline.
- **Misconceptions:** "Budgeting = cutting small expenses" (the big fixed lines dominate). "Savings rate should be computed on gross salary" (either is fine if consistent; mixing is the error).
- **Failure modes:** Irregular income (freelancers) makes monthly rates misleading; use trailing 12-month averages. Annual expenses (insurance premia, school fees) disappear from monthly views; sinking funds fix this.

### L0.3 Personal Balance Sheet

- **Big idea:** Net worth tells you how far ahead you are; liquid net worth tells you how long you can survive a shock; leverage tells you how violently both can move.
- **Mental models:** A photograph (balance sheet) vs a video (cash flow). Leverage as a lever: small moves in assets become large moves in equity.
- **Prediction:** Two households each own a ₹1 crore flat. One has no loan, one has an ₹80 lakh loan. Prices fall 10%. How much of each household's equity is lost? (10% vs 50%.)
- **Mathematics:** Net worth = Σassets − Σliabilities. Liquid net worth = liquid assets − short-term liabilities. Leverage ratio = assets ÷ net worth. %ΔNW ≈ leverage × %Δassets. Debt-to-income (EMI ÷ take-home).
- **Worked example:** Meera's balance sheet: savings ₹1.8L, FD ₹1.0L, mutual funds ₹2.4L, EPF ₹3.1L, gold jewellery ₹1.5L, scooter and laptop (valued at resale, not purchase price); liabilities: credit card ₹85,000, education loan ₹3.2L. Net worth and liquid net worth computed.
- **Visual:** Two-column balance sheet with liquidity bands (instant / days / months / years).
- **Interactive:** *Leverage Explorer*: asset value, loan, asset-price change → equity change; shows the "equity wipe-out" point where a fall equals 1/leverage.
- **Misconceptions:** "Assets at purchase price." "EPF is liquid." "A car is an investment." "Negative net worth means failure" (a new graduate with an education loan is normal; direction matters).
- **Failure modes:** Valuation of illiquid assets is uncertain; balance sheets can hide contingent liabilities (guarantees given for relatives' loans).

### L0.4 Time Value of Money

- **Big idea:** A rupee today and a rupee in ten years are different goods. Compounding makes growth depend on time more than on rate, and discounting is compounding run backwards.
- **Mental models:** Interest on interest (snowball). Time machine: FV moves money forward, PV moves it back. Opportunity cost: the price of anything is the best alternative you give up.
- **Predictions:** (1) ₹1 lakh at 12% a year for 30 years becomes about? Options ₹4.6L / ₹10L / ₹30L / ₹1 crore. (Answer ≈ ₹30L; ₹4.6L is simple interest.) (2) Does doubling time from 10 to 20 years double the gain? (No: it more than triples it at 12%.)
- **Mathematics:**
  - Simple interest: I = P·r·n.
  - Compound: FV = PV(1+r)ⁿ; PV = FV/(1+r)ⁿ.
  - Periodic rate and compounding frequency: FV = PV(1 + r/m)^(m·n).
  - Effective annual rate: EAR = (1 + r_period)^(periods per year) − 1.
  - CAGR = (End/Start)^(1/years) − 1.
  - Future value of a regular contribution (annuity, end of period): FV = C·[(1+r)ⁿ − 1]/r (introduced here because L0.6 and L0.8 need it).
  - Rule of 72 as an Advanced Note (approximation, and where it breaks).
- **Worked examples:** ₹1,00,000 at 12%: ₹3,10,585 (10y), ₹9,64,629 (20y), ₹29,95,992 (30y) vs simple interest ₹4,60,000 at 30y. PV of ₹10 lakh needed in 8 years at 7%: ₹5,82,009. CAGR of a ₹2,00,000 → ₹3,40,000 portfolio over 5 years: 11.2% a year (not 14%, the simple average). 1% a month = 12.68% a year; 3.5% a month = 51.1% a year. Opportunity cost of a ₹2 lakh purchase at 29: ₹13.45 lakh at 49 if invested at 10% (≈ ₹5.07 lakh in today's money at 5% inflation).
- **Visual:** Stacked area chart: principal / contributions vs accumulated growth over time.
- **Interactive:** *Compounding Explorer*: principal, annual return, years, monthly contribution, inflation, simple-vs-compound toggle → nominal and real values; readout "you contributed ₹X; growth generated ₹Y". *Discounting Dial* (PV of a future sum as rate and years change). *Annualisation Converter*.
- **Misconceptions:** "Average return = CAGR." "12% monthly interest compounding = 12% annually." "Annualising a 3-month 10% gain gives a reliable 46% a year."
- **Failure modes:** Constant-rate assumption (real returns vary; sequence matters, previewed for L8); nominal vs real confusion; annualising short periods; PV depends heavily on the discount rate chosen.
- **Cross-links forward:** L5 (DCF), L7 (bond pricing), L8.3–8.5 (geometric returns, CAGR, XIRR), L12.2–12.3 (exponents, logs).

### L0.5 Inflation

- **Big idea:** What matters is not how many rupees you have but how much they buy. A return below inflation is a slow loss, however safe it looks.
- **Mental models:** The shrinking rupee. The CPI as a shopping basket priced every month. Your personal basket is not the average basket.
- **Prediction:** An FD pays 7%; inflation is 5%. Real return? (≈1.9%, not 2%.) At 20% nominal and 15% inflation? (4.35%, not 5%.) Point: subtraction is an approximation that worsens as rates rise.
- **Mathematics:** Inflation rate πₜ = CPIₜ/CPIₜ₋₁ − 1. Purchasing power after n years = 1/(1+π)ⁿ. Real value = nominal value ÷ (1+π)ⁿ. Fisher: 1 + r_real = (1 + r_nominal)/(1 + π). Approximation r_real ≈ r_nominal − π and its error term.
- **Worked examples:** Historical: annual CPI-C inflation 2014-15 to 2019-20 (5.9, 4.9, 4.5, 3.6, 3.4, 4.8%; Economic Survey 2020-21, Vol 2, Ch 5). Cumulative ≈ 30.3%: goods costing ₹100 at the start cost about ₹130 six years later; ₹100 of cash buys what about ₹77 bought at the start. Hypothetical: FD at 7% after 5% inflation.
- **Current facts (date-stamped):** CPI base revised to 2024=100 (first release 12 Feb 2026 for Jan 2026; 358 items, up from 299; food & beverages weight 36.75%); latest verified headline CPI inflation (July 2026: 4.45%, provisional, MoSPI release of 12 Aug 2026); inflation target 4% ±2% for Apr 2026 to Mar 2031 (notified 25 Mar 2026).
- **Visual:** Purchasing-power chart (₹100 eroding, historical series). Index-basket diagram (weights).
- **Interactive:** *Real Return Calculator* with approximation-error readout; *Erosion Explorer* (years × inflation → purchasing power).
- **Misconceptions:** "Inflation of 4% means prices will go down when inflation falls" (lower inflation = slower rise, not falling prices). "CPI is my inflation." "Real return = nominal − inflation, exactly."
- **Failure modes:** Base-year changes break naive long comparisons; CPI is an average; expectations are not forecasts.
- **Cross-links:** L6.2, L6.20 (inflation regimes), L7 (real yields), L8 (real returns).

### L0.6 Financial Goals

- **Big idea:** A goal is a future cost in future rupees. Its horizon decides how much short-term volatility you can live with, and the start date is the most powerful lever you control.
- **Mental models:** Goals as dated liabilities. Buckets by horizon (short < 3y, medium 3–7y, long > 7y, stated as a teaching convention, not a rule).
- **Prediction:** Starting 5 years later for a 15-year education goal: does the monthly amount rise by a third? (It roughly doubles.)
- **Mathematics:** Future cost = today's cost × (1 + goal inflation)ⁿ. Required monthly contribution C = FV·i/((1+i)^N − 1), i = monthly rate from annual via (1+r)^(1/12) − 1. Real-return shortcut: plan in today's rupees with a real return (link L0.5).
- **Worked examples:** Education: ₹20 lakh today, 15 years, 8% education inflation (assumption) → ₹63.4 lakh; at 10% a year expected return, ≈ ₹15,900/month for 15 years (total contributed ₹28.7 lakh); starting 5 years late: ≈ ₹31,700/month (total ₹38.1 lakh). Retirement (long horizon, Meera): order-of-magnitude exercise only, stating assumptions. Housing: down-payment accumulation over 5 years. Major purchase: car in 2 years (short horizon, capital stability matters most).
- **Visual:** Goal timeline (horizontal, dated) with goal sizes.
- **Interactive:** *Goal Planner*: cost today, years, goal inflation, expected return, start delay → future cost, monthly amount, cost-of-delay comparison.
- **Misconceptions:** "Plan in today's prices." "Higher expected return solves everything" (return assumptions must match horizon risk). "One portfolio for all goals is fine" (can be, but horizon mismatch is the risk).
- **Failure modes:** Expected return is not guaranteed; inflation assumption dominates long horizons; goals change; sequence risk near the goal date (preview L8).
- **Deferred:** asset allocation per horizon (L8.25, L8.28), products (L2).

### L0.7 Emergency Funds

- **Big idea:** An emergency fund is insurance you pay for with lower returns. It buys time so that a shock does not force you to sell investments at bad prices or borrow at 40%.
- **Mental models:** Runway (months you can survive with zero income). Layers: instant access, days, weeks.
- **Prediction:** Which household needs a larger buffer: a government employee with a working spouse, or a single freelancer? Why?
- **Mathematics:** Runway = liquid buffer ÷ essential monthly outflow. Target = months × essential outflow, months chosen from income stability, dependants, insurance, other income. Opportunity cost per year ≈ fund × (expected return elsewhere − return on buffer), after tax.
- **Worked example:** Meera: essential outflow ≈ ₹55,000/month → 6 months ≈ ₹3.3 lakh. Cost of safety at a 3.5 percentage-point return gap ≈ ₹11,550/year before tax, compared with the cost of one forced credit-card month.
- **Historical context:** The March 2020 nationwide lockdown as an example of a correlated income shock (many households lost income at the same time, when markets had also fallen).
- **Current facts:** DICGC deposit insurance ₹5 lakh per depositor per bank ("same right and same capacity").
- **Visual:** Runway bar under shock scenarios.
- **Interactive:** *Emergency Fund Sizer and Shock Simulator*: essentials, income-stability profile, dependants, health cover, current buffer → recommended range, runway, and a job-loss simulation month by month.
- **Misconceptions:** "Credit card limit is my emergency fund." "Keep it all in equity, it is liquid" (liquid ≠ stable; emergencies correlate with market falls). "More is always safer" (too much has real opportunity cost).
- **Failure modes:** Rules of thumb (3–6 months) ignore circumstances; buffers get raided for non-emergencies.
- **Instruments (principle level):** savings account, sweep-in FD, FD (premature-withdrawal penalty), liquid/overnight funds (named only; mechanics in L2.5–2.6).

### L0.8 Debt

- **Big idea:** Debt is compounding working against you. It is a tool when it buys an asset or capability worth more than its cost, and a trap when it funds consumption at high rates.
- **Mental models:** Renting money. Reducing balance: interest is charged only on what you still owe, so early EMIs are mostly interest.
- **Predictions:** (1) In the first month of a 20-year ₹50 lakh home loan at 8.5%, what share of the EMI is interest? (82%.) (2) Paying only the minimum on a ₹1 lakh card balance: how long to clear? (≈14 years, ≈₹1.95 lakh interest, under stated assumptions.)
- **Mathematics:** EMI = P·i·(1+i)ⁿ/((1+i)ⁿ − 1), derived from PV of an annuity (link L0.4). Interestₘ = balanceₘ₋₁ × i. Flat rate vs reducing rate; effective annual cost. Refinance break-even months = switching cost ÷ monthly saving. Prepayment: reduce tenure vs reduce EMI.
- **Worked examples:** Nairs' home loan ₹50 lakh, 8.5%, 20 years → EMI ₹43,391; total interest ₹54.1 lakh; month-1 interest ₹35,417. Prepay ₹5 lakh after 3 years: keep EMI → loan ends in 199 months, interest ₹40.9 lakh (saves ₹13.2 lakh); keep tenure → EMI falls to ₹38,750, interest ₹49.7 lakh (saves ₹4.5 lakh). Personal loan: "10% flat" over 3 years ≈ 17.9% reducing-balance equivalent. Card: ₹1 lakh at 3.5%/month, minimum 5% (floor ₹500) → 172 months, ₹1.95 lakh interest. Refinance: ₹40 lakh, 17 years left, 9.25% → 8.40%, ₹15,000 cost → saves ₹2,080/month, break-even ≈ 7 months.
- **Visual:** Amortisation chart (interest vs principal per year, stacked columns) and outstanding-balance line.
- **Interactive:** *Loan Lab* (EMI, schedule, prepayment comparison); *Minimum-Due Simulator*.
- **Current facts:** RBI Master Direction on credit cards (MAD must avoid negative amortisation; interest-free period suspended if previous bill unpaid; late charges only on amount overdue; 3-day past-due rule). RBI Pre-payment Charges Directions 2025: no prepayment charges on floating-rate loans to individuals for non-business purposes, for loans sanctioned or renewed on or after 1 Jan 2026.
- **Misconceptions:** "Low EMI = cheap loan" (tenure). "Flat 10% = 10%." "Prepay always" (compare after-tax loan rate with alternatives, and keep liquidity first). "Minimum due keeps me safe."
- **Failure modes:** Floating rates reset; EMI-to-income ratios above ~40–50% leave no room for shocks (teaching heuristic, labelled as such); co-signing creates contingent liabilities.
- **Strategies:** avalanche (highest rate first, mathematically optimal) vs snowball (smallest balance first, behavioural).

### L0.9 Insurance

- **Big idea:** Insure what you cannot afford to lose, not what is merely annoying. Insurance deliberately loses money on average to remove ruinous outcomes.
- **Mental models:** Risk pooling: 1,000 households each face a 1% chance of a ₹10 lakh bill; each pays a little so no one pays everything. Premium = expected loss + costs + profit, so insurance is a negative-expected-value trade you accept for a narrower range of outcomes.
- **Prediction:** Is it rational to buy insurance whose premium exceeds the expected claim? (Yes, for losses that would be ruinous; no, for small losses you can absorb.)
- **Mathematics:** Expected loss = probability × severity. Human life value / needs-based cover: PV of future household expenses (real rate) + debts + goals − existing assets − existing cover (uses PV from L0.4). Proportionate deductions (room-rent cap) as a ratio. IRR of an insurance-cum-investment product as "the rate that makes PV(premiums) = PV(benefits)" (computed by the tool; preview of XIRR, L8.5).
- **Worked examples:** Pooling numbers above: expected loss ₹10,000 per household; premium ₹13,000 (hypothetical loading). Nairs' needs-based life cover. Term vs a hypothetical traditional endowment (premium ₹1 lakh/year for 20 years, maturity ₹30 lakh → IRR ≈ 3.7%) vs term + invest the difference (stated assumptions, not a product recommendation).
- **Visual:** Outcome distribution with and without insurance (histogram of 1,000 simulated households).
- **Interactive:** *Risk Pooling Simulator* (probability, severity, pool size, loading → distribution of outcomes alone vs pooled); *Cover Estimator*.
- **Current facts (date-stamped):** GST exemption on individual life and health policies from 22 Sep 2025 (previously 18%); IRDAI health master circular (29 May 2024): moratorium 5 years, pre-existing-disease waiting period max 36 months; free-look 30 days for life and health; claim timelines (cashless authorisation within 1 hour; discharge within 3 hours). Motor third-party insurance mandatory in India (Motor Vehicles Act).
- **Misconceptions:** "Insurance should give money back." "Employer group cover is enough" (lost when job is lost; often low). "Sum insured = what you will get" (sub-limits, co-pays). "Children need life insurance" (cover follows dependants' economic loss).
- **Failure modes:** Non-disclosure voids claims; under-insurance; exclusions; insurer claim practices; inflation eroding a fixed sum insured.

### L0.10 Taxes (personal-finance introduction)

- **Big idea:** Decisions should be judged after tax. What matters is the rate on your next rupee (marginal), not the average, and taxes compound like any other drag.
- **Mental models:** Slabs as buckets filled in order; only the rupees in a higher bucket pay the higher rate.
- **Prediction:** Meera's salary rises so that her taxable income crosses from the 10% slab into 15%. Does all her income now pay 15%? (No.)
- **Mathematics:** Tax = Σ over slabs (income within slab × slab rate), then rebate, then cess. Average rate = tax ÷ income. Marginal rate = Δtax/Δincome. After-tax return = r(1 − t). After-tax real return via Fisher. Tax drag: FV with annual taxation vs deferred taxation (illustrative).
- **Worked example:** Meera, new regime, tax year 2026-27: gross ₹15 lakh, standard deduction ₹75,000, taxable ₹14.25 lakh → tax ₹93,750 + 4% cess = ₹97,500; average 6.5% of gross; marginal 15.6%. FD at 7%, taxed at marginal 15.6% → 5.91% after tax → ≈0.87% real at 5% inflation. At a 31.2% marginal rate → 4.82% after tax → below inflation.
- **Current facts (verified 29 Sep 2026):** Income-tax Act 2025 in force from 1 Apr 2026 ("tax year" replaces previous-year/assessment-year); new regime default; slabs 0–4L nil, 4–8L 5%, 8–12L 10%, 12–16L 15%, 16–20L 20%, 20–24L 25%, >24L 30%; rebate makes income up to ₹12 lakh nil tax (₹12.75 lakh for salaried with standard deduction ₹75,000); 4% health & education cess; old regime available by choice. Detail (capital gains, surcharge, deductions) deferred to Level 23.
- **Visual:** Marginal vs average rate curve across income.
- **Interactive:** *Slab Visualiser* (income → tax by slab, marginal and average rate, with a clearly labelled simplified scope); *After-tax Return Calculator*.
- **Misconceptions:** "A raise can reduce take-home by pushing me into a higher slab" (not under progressive slabs; the one real cliff is the rebate edge, softened by marginal relief). "Tax-saving product = good investment."
- **Failure modes:** Rules change every budget; the calculator excludes surcharge, special-rate income and deductions; after-tax return depends on the instrument's specific treatment (L23).

### L0.11 Financial Fraud and Safety

- **Big idea:** Every return comes with risk. A promise of high return with no risk is not an investment offer; it is a description of fraud. Most modern fraud does not beat your intelligence; it beats your verification habits.
- **Mental models:** Ponzi as a bucket that pays old investors with new investors' money: it needs inflows to grow faster than promised payouts, so it must eventually collapse. Scams as pressure + authority + secrecy + urgency.
- **Prediction:** A scheme promises 3% a month "guaranteed". What annual return is that, and what would it need to be true? (42.6%/year; far above any sustainable asset return; link L0.4.)
- **Mathematics:** Ponzi cash balance: Bₜ = Bₜ₋₁ + new inflowsₜ − promised payoutsₜ − withdrawals − operator take; collapse when Bₜ < 0. Annualisation of "monthly guaranteed" returns.
- **Case 1 (global, historical): Bernard Madoff.** At the time: unusually smooth reported returns, a tiny audit firm, self-custody of client assets, secrecy about strategy, external warnings (Harry Markopolos) that the SEC did not act on competently. SEC Inspector General (OIG-509): six substantive complaints June 1992–Dec 2008, three examinations and two investigations, "a thorough and competent investigation or examination was never performed." Arrested 11 Dec 2008. Trustee recoveries ≈ $15.5 billion as of 21 Aug 2026. Framing: what could an investor have checked *then*?
- **Case 2 (India, historical): Saradha Group (West Bengal).** Collective-investment-style schemes promising high returns via agent networks; SEBI order of 23 Apr 2013 directed Saradha Realty to wind up its schemes and refund investors within three months. Lesson: registration checks and the agent-commission incentive.
- **Current facts:** National Cyber Crime Helpline 1930; cybercrime.gov.in; "digital arrest" impersonation scams (MHA statement 10 Dec 2024: impersonation of police, CBI, NCB, RBI); SEBI validated UPI handles (@valid, e.g. name.brk@validbank) and SEBI Check (from 1 Oct 2025); RBI Sachet portal for unauthorised deposit schemes.
- **Interactive:** *Ponzi Simulator* (promised monthly return, starting capital, new-investor growth, withdrawal rate → cash balance path and collapse month). *Red-Flag Drill*: realistic message scenarios (constructed) where the learner classifies and explains.
- **AI angle:** deepfake voice/video impersonation; AI-written phishing removes the old "bad grammar" tell.
- **Misconceptions:** "Only gullible people get scammed." "A registered company = registered to take investments." "My bank will refund anything."
- **Security checklist:** unique passwords + password manager, app-based 2FA over SMS where possible, SIM-swap awareness, never share OTP/PIN (you never need a PIN to *receive* money), verify payee handles, separate email for finance, device updates.

---

## A14. Current facts requiring external research (and status)

| Fact | Lesson | Status | Source (Tier) |
|---|---|---|---|
| CPI base 2024=100, 358 items, weights, first release 12 Feb 2026 | 0.5 | Verified | PIB/MoSPI (T1) |
| Latest CPI inflation (July 2026: 4.45% provisional) | 0.5 | Verified | PIB/MoSPI 12 Aug 2026 (T1) |
| August 2026 CPI (4.82% reported) | 0.5 | Secondary only; not shown as verified | T2/T3 |
| Inflation target 4% ±2%, Apr 2026–Mar 2031 | 0.5 | Verified | Govt notification 25 Mar 2026 via Business Standard (T2); T1 gazette to be linked in L6 |
| RBI repo 5.25% (5 Aug 2026) | 0.5 context, 0.8 floating-rate context | Verified (T2) | IIFL report of RBI policy (T2) |
| CPI-C annual inflation 2014-15 to 2019-20 | 0.5 | Historical, verified | Economic Survey 2020-21 (T1) |
| Tax: Income-tax Act 2025, slabs, rebate, standard deduction, default regime | 0.10 | Verified | PIB Budget 2025-26 (T1), incometax.gov.in (T1), Cleartax (T2) |
| DICGC ₹5 lakh | 0.7 | Verified | DICGC booklet (T1) |
| RBI credit-card MD clauses | 0.8 | Verified | RBI (T1) |
| RBI prepayment directions from 1 Jan 2026 | 0.8 | Verified | RBI Directions text (T1 text via law-firm copy) |
| GST exemption on individual life/health, 22 Sep 2025 | 0.9 | Verified | Dept of Financial Services (T1) |
| IRDAI health rules (moratorium, PED, free-look, claim timelines) | 0.9 | Verified (T2 summaries of T1 circulars) | Nyvo, Business Today (T2) |
| Cyber helpline 1930, portal | 0.11 | Verified | PIB (T1) |
| Digital arrest statement | 0.11 | Verified | PIB (T1) |
| SEBI @valid, SEBI Check | 0.11 | Verified | SCC Online summary of SEBI (T2) |
| Madoff facts | 0.11 | Verified | SEC OIG (T1), Madoff trustee (T1) |
| Saradha SEBI order | 0.11 | Verified | SEBI order (T1) |

Every current fact is shown in the module with a "Verified as of 29 Sep 2026" stamp and source link.

## A15. Quant Lab

**Quant Lab 0: Build and audit an amortisation schedule** (spreadsheet-first, because Python is not a prerequisite; spreadsheets are formally taught in L13.1).
- Objective: see the EMI formula as a PV identity and verify it.
- Data: Nairs' loan (hypothetical).
- Steps: columns Month, Opening balance, Interest = balance × i, Principal = EMI − interest, Closing balance. Checks: closing balance at month 240 ≈ 0; Σprincipal = P; month-1 interest = P·i; EMI matches the spreadsheet PMT function.
- Failure checks: using annual rate as monthly; sign conventions in PMT; rounding drift.
- Extension: add a prepayment in month 36 and compare the two options.
- An optional collapsed Python version is shown as a **preview of Level 13**, marked not required.

## A16. AI Lab

**AI Lab 0: Audit an AI's personal-finance answer** (AI as tutor, and AI as something to verify; Spec §35–36).
- A constructed, clearly labelled example of a plausible-sounding chatbot answer to "Should Meera prepay her loan or invest, and how much tax does she pay?" containing planted errors: outdated rebate threshold (₹7 lakh, pre-2025), real return by subtraction at high inflation, flat vs reducing confusion, ignoring the emergency fund, a fabricated "guaranteed 12%" figure.
- Learner identifies each error, names the source needed to check it, and applies the verification loop.
- Lesson: an LLM's training data has a date, and it can compute confidently and wrongly; numbers must be recomputed and current rules checked at the source.

## A17. Practice ladder (per lesson)

Each lesson ends with five exercise levels (Spec §12) as reveal-answer items:
- A Recognition (classify items: asset/liability, fixed/variable, secured/unsecured).
- B Calculation (savings rate, NW, FV/PV/CAGR, real return, EMI, tax).
- C Interpretation (what a result means for the household).
- D Application (new household, new numbers).
- E Challenge (find the flaw in an argument or a sales pitch).

Plus a 3–4 item **Knowledge Check** per lesson (interactive, feedback per wrong option explaining the misconception).

## A18. Mastery assessment

End-of-module, 14 items, no memorisation of obscure terms:
- 4 conceptual (stock vs flow, real vs nominal, marginal vs average, insurance logic).
- 5 calculations (CAGR, PV, real return, EMI share of interest, emergency runway).
- 2 unfamiliar scenarios (a freelancer's system; a family choosing between prepaying and building a buffer).
- 1 short analysis (diagnose a household's balance sheet and cash flow; free text with model answer).
- 2 critiques (a "guaranteed 2.5% monthly" pitch; an endowment sales illustration).
Scoring shown per competency: Understanding, Calculation, Interpretation, Application. Recommendation to revisit lessons, not a hard block (Spec §49).

## A19. Module project: Project 0, Personal Financial Dashboard

Required chain: income → expenses → assets → liabilities → net worth → savings rate → emergency fund → insurance → investments → goals.
- In-browser tool that opens pre-filled with Meera's clearly marked sample data; "Start with my numbers" clears it.
- Outputs: savings rate, free cash flow, net worth, liquid net worth, leverage, debt-to-income, emergency runway vs target, insurance gap estimates (life, health), investment allocation snapshot, goal funding status (required vs current contributions).
- Privacy: data stays in the learner's browser (localStorage, wrapped for failure) with explicit JSON export (downloads capability) and import (file input). Nothing is sent anywhere.
- Deliverable rubric: completeness of the chain, one-paragraph diagnosis, three prioritised actions with reasons.
- Seeds the Personal Investment Operating System (Level 25, "Personal Finance Dashboard").

## A20. Cross-links

| From Module 0 | To | Nature |
|---|---|---|
| L0.1 human/financial capital | L8.28 lifecycle investing | Deepens |
| L0.3 leverage | L9.11 leverage risk, L9.14 risk of ruin, L10.20–21 margin | Deepens |
| L0.4 PV/FV/discounting | L5.6 DCF, L7.1–7.5 bond pricing | Reused |
| L0.4 CAGR, annualisation | L8.3–8.5, L15.24 | Deepens (geometric vs arithmetic, XIRR) |
| L0.4 exponents | L12.2–12.3 | Formalised |
| L0.4 opportunity cost | L4.13 capital allocation, L8.25 allocation | Spaced reinforcement |
| L0.5 inflation, CPI, expectations | L6.2, L6.20, L6.23, L7.21 | Deepens |
| L0.6 goal horizons | L8.25, L8.28; Gate C IPS | Deepens |
| L0.7 liquidity instruments | L2.5 money market, L2.6 mutual funds, L9.10 liquidity risk | Product detail |
| L0.8 amortisation | L3.13 debt & interest, L7.19 credit analysis | Reused |
| L0.9 expected loss, pooling | L9.1, L11 (derivatives as risk transfer), L12.12 expected value | Spaced reinforcement |
| L0.10 after-tax returns | L23 (living tax module) | Detail |
| L0.11 Ponzi, fraud | L9 behavioural biases, L24 crises, L1.6 brokers, L1.7 depositories | Deepens |
| Project 0 | L25 Personal Investment OS | Integrated |

---

# PART B: SELF-AUDIT

Checked against: every Level 0 bullet in the Master Syllabus; Teaching Spec §4 (ladder), §5 (principles), §6 (module architecture sections 1–18), §7 (depth layers), §28 (data policy), §31 (date discipline), §32 (safety), §41 (depth check), §43 (prerequisites), §58 (quality gate), §66 (never do).

## B1. Coverage: missing or thin items found, and the correction

| Finding | Correction |
|---|---|
| "Financial capital" and "human capital" had no quantitative treatment; human capital needs PV, which comes in L0.4. | Keep intuition in L0.1; quantify human capital as PV of future earnings in L0.9 (cover adequacy). Registry records the dependency. |
| "Annualisation" risked being reduced to monthly→annual conversion only. | Added the short-period annualisation trap (a 3-month gain annualised) as a misconception and practice item. |
| "Inflation expectations" risked drifting into Level 6 macro. | Limited to why expectations matter to a household (locking FD rates, wage negotiations, goal assumptions) and the target as an anchor. Mechanisms deferred to L6.23. |
| "Appropriate instruments" (0.7) needs product knowledge from Level 2. | Name instruments with their liquidity/stability properties only; explicit forward links to L2.5–2.6. No product recommendations. |
| "Broker security" (0.11) presupposes brokers (L1.6). | One-sentence definition of a broker and demat account with forward link; focus on verifiable security behaviour (@valid handles, SEBI Check, no sharing credentials, no "account handling" services). |
| "Goal-based investing" could turn into asset-allocation advice before Level 8. | Kept at principle level: horizon → tolerance for volatility; the planner uses a user-chosen expected return with a visible warning. |
| 0.10 tax is intentionally light, but Spec §31 requires date stamps. | All tax figures carry "Verified as of 29 Sep 2026", scope limits shown in the calculator. |
| Project 0 chain includes "investments" and "insurance", which were not in the first dashboard draft. | Added investment snapshot and insurance-gap panels. |
| Knowledge checks were planned but not mastery-level transfer items. | Mastery assessment now includes two unfamiliar scenarios and two critique items. |

## B2. Redundancy found and removed

- Purchasing power, nominal vs real appeared fully in both L0.1 and L0.5. Now: L0.1 intuition only (one paragraph + toggle in the explorer); L0.5 owns the formula.
- Opportunity cost appeared as a definition in L0.4, L0.7 and L0.8. Now: defined once in L0.4; L0.7 and L0.8 apply it to a new situation (cost of safety; prepay vs invest), which is spaced reinforcement rather than repetition.
- Two separate compounding charts (L0.1 bathtub and L0.4 explorer) overlapped. The bathtub now deliberately omits returns (flows only) so that L0.4 adds the growth layer.

## B3. Sequencing problems found and fixed

- Human capital (L0.1) before PV (L0.4): resolved by the intuition-first, quantify-later split (B1).
- Goal planning (L0.6) ideally uses after-tax returns, but tax is L0.10. Kept syllabus order for traceability; the Goal Planner states "pre-tax" explicitly and L0.10 returns to it with an after-tax example (a deliberate spaced revisit).
- Annuity FV formula is needed by L0.6 and L0.8; it was originally planned inside L0.6. Moved to L0.4 so both later lessons reuse it.

## B4. Unnecessary complexity removed

- Continuous compounding and e: removed (no Level 0 use; appears if needed in L12/L14).
- Logarithms for solving time-to-goal: removed; tools solve numerically, and the rule of 72 is an Advanced Note.
- XIRR: removed from L0.4 (belongs to L8.5). The endowment IRR in L0.9 is shown as a tool output with a plain-language definition.
- Python in the Quant Lab: made optional and collapsed, marked as a preview of L13.
- Detailed tax (capital gains, surcharge, old-regime deductions): excluded, with explicit deferral to L23.

## B5. Teaching Spec conformance

| Spec requirement | Status |
|---|---|
| §6 Section 1 landing page (number, title, purpose, difficulty, prerequisites, objectives, key questions, map) | Planned in module overview |
| §6 Sections 2–4 big idea, why, intuition | Per lesson |
| §6 Section 5 core concepts with definition/intuition/mechanism/example/visual/interpretation/mistake/relevance | Per lesson; audited by the §41 depth checklist during build |
| §6 Section 6 formula with variables, units, interpretation, example, sensitivity, limitations | FormulaCard component enforces the fields |
| §6 Section 7 interactive explorer | 13 explorers, each with a stated learning purpose (§71.4 test) |
| §6 Section 8 real-world example with data category | Hypothetical/Historical/Current tags on every numeric example |
| §6 Sections 9–10 misconceptions, failure modes | Per lesson |
| §6 Section 11 case | Madoff, Saradha (L0.11); March 2020 context (L0.7); CPI history (L0.5) |
| §6 Sections 12–18 practice, AI lab, quant lab, knowledge check, synthesis, mastery, project | All planned |
| §18 Predict then reveal | At least one per lesson |
| §28 Data policy, §31 date discipline | DataTag and VerifiedStamp components |
| §32 Safety language | No return promises; all expected returns labelled as assumptions |
| §43 Prerequisites | Module 0 has none; forward links where later knowledge would help |
| §53–54 Accessibility, mobile | Web-design-guidelines audit in QA |
| §61 Consistency files | Glossary, tokens, components, source policy, registry created alongside this module |

## B6. Result

Architecture is internally consistent after the corrections above. Build proceeds lesson by lesson into one module artifact.
