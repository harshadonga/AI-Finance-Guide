# 03 · Global Glossary

Version 1.0 · 29 Sep 2026 · 86 terms

The machine-readable source is `src/shared/scripts/glossary.js`, which every module page loads (hover or tap a dotted term; open the Glossary panel from the top bar). This file mirrors it for reading and review. **Add terms only through `src/shared/scripts/glossary.js`, then regenerate this file.**

Fields per Teaching Spec §42: concise definition, intuition, related concepts, first lesson introduced.

## Conventions

- The ID is kebab-case and stable. Lessons reference it with the `[[id|text]]` authoring macro, and the build fails a check if an ID is missing.
- Definitions are one sentence and must not depend on later modules. Anything current (a limit, a rate) says so and names the lesson where it is verified.
- Later modules add terms and never redefine one. To deepen a term, add a note that names the module doing the deepening.

| Term | Definition | Intuition | Related | First introduced |
|---|---|---|---|---|
| **After-tax return** `after-tax-return` | The return you keep after tax: for a fully taxed return, r × (1 − tax rate). |  | Tax drag, Real return | 0.10 |
| **Amortisation** `amortisation` | Repaying a loan gradually through scheduled payments, each split between interest and principal. |  | EMI, Reducing-balance interest | 0.8 |
| **Annualisation** `annualisation` | Converting a rate or return for a shorter or longer period into its equivalent per year. |  | Effective annual rate, CAGR | 0.4 |
| **Annuity (level payments)** `annuity` | A series of equal payments at regular intervals, such as a monthly SIP or an EMI. |  | EMI, SIP (systematic investment plan) | 0.4 |
| **Asset** `asset` | Something you own that has economic value, such as cash, investments, property or a vehicle. | Ask: could this be turned into money, and how quickly? | Liability, Liquidity | 0.1 |
| **Average tax rate** `average-tax-rate` | Total tax divided by total income. |  | Marginal tax rate | 0.10 |
| **Base year** `base-year` | The reference period whose price level is set to 100 in an index. |  | Consumer Price Index (CPI) | 0.5 |
| **Broker** `broker` | A registered intermediary that places buy and sell orders on an exchange for clients. Covered in Lesson 1.6. |  |  | 0.11 |
| **CAGR** `cagr` | Compound annual growth rate: the constant yearly rate that takes a starting value to an ending value over a period. | The smooth path that ends in the same place as the bumpy real one. | Compound interest, Annualisation | 0.4 |
| **Cash flow** `cash-flow` | Money moving in and out over a period. |  | Income | 0.2 |
| **Co-payment** `co-payment` | A fixed share of each claim that the policyholder pays. |  | Deductible | 0.9 |
| **Collateral** `collateral` | An asset pledged to a lender as security for a loan. |  | Secured debt | 0.8 |
| **Compound interest** `compound-interest` | Interest calculated on the principal plus interest already earned. | Interest on interest: the growth itself starts growing. | Simple interest, Future value (FV) | 0.4 |
| **Consumer Price Index (CPI)** `cpi` | An index that tracks the price of a fixed, weighted basket of goods and services bought by households. | The price of a standard shopping basket, checked every month. | Inflation, Base year | 0.5 |
| **Consumption** `consumption` | Spending on goods and services that are used up rather than kept as a store of value. |  | Saving | 0.1 |
| **Debt-to-income (EMI ratio)** `debt-to-income` | Total monthly loan repayments divided by monthly income. |  | EMI, Leverage | 0.3 |
| **Deductible** `deductible` | An amount the policyholder pays before the insurer starts paying. |  | Co-payment | 0.9 |
| **Demat account** `demat` | An account that holds securities electronically, maintained through a depository participant. Covered in Lesson 1.7. |  |  | 0.11 |
| **DICGC deposit insurance** `dicgc` | Insurance on bank deposits in India, currently up to ₹5 lakh per depositor per bank (principal and interest), provided by the Deposit Insurance and Credit Guarantee Corporation. |  | Emergency fund | 0.7 |
| **Discount rate** `discount-rate` | The rate used to convert future money into present value; it reflects the return you could earn elsewhere at similar risk. |  | Present value (PV), Opportunity cost | 0.4 |
| **Discounting** `discounting` | Converting a future amount into its present value. |  | Present value (PV) | 0.4 |
| **Discretionary expense** `discretionary-expense` | Spending you choose rather than need, such as eating out, travel or upgrades. |  | Lifestyle inflation | 0.2 |
| **Effective annual rate** `ear` | The true yearly rate once compounding within the year is included: (1 + periodic rate)^periods − 1. |  | Annualisation | 0.4 |
| **Emergency fund** `emergency-fund` | Money kept safe and easy to access to cover essential costs during an income loss or an unexpected expense. |  | Runway, Liquidity | 0.7 |
| **EMI** `emi` | Equated monthly instalment: a fixed monthly payment that covers interest and repays principal over the loan's term. |  | Amortisation, Annuity (level payments) | 0.8 |
| **Expected loss** `expected-loss` | Probability of a loss multiplied by its size, averaged over all outcomes. |  | Risk pooling, Premium | 0.9 |
| **Financial capital** `financial-capital` | The financial assets you have already accumulated: bank balances, investments, retirement accounts. |  | Human capital | 0.1 |
| **Fixed expense** `fixed-expense` | A cost that stays roughly the same each month and is hard to change quickly, such as rent or an EMI. |  | Variable expense, Discretionary expense | 0.2 |
| **Flat rate** `flat-rate` | Interest calculated on the original loan amount for the whole term, even as it is repaid; its true cost is much higher than the quoted rate. |  | Reducing-balance interest | 0.8 |
| **Free cash flow (personal)** `free-cash-flow` | Take-home income left after essential commitments (fixed and necessary variable costs). | The money you actually have a choice about each month. | Savings rate | 0.2 |
| **Free-look period** `free-look` | A window after receiving a policy during which you can cancel it and get a refund, subject to deductions; currently 30 days for life and health policies in India. |  |  | 0.9 |
| **Future value (FV)** `future-value` | What an amount today will be worth at a future date if it grows at a given rate. |  | Present value (PV) | 0.4 |
| **Goal horizon** `goal-horizon` | The time between today and the date money for a goal is needed. |  | Goal-based investing | 0.6 |
| **Goal-based investing** `goal-based-investing` | Organising savings and investments around specific dated goals, each with its own amount, horizon and tolerance for volatility. |  | Goal horizon | 0.6 |
| **Guaranteed-return claim** `guaranteed-return` | A promise of a fixed high return with little or no risk; outside insured deposits and government securities, a warning sign. |  | Ponzi scheme | 0.11 |
| **Human capital** `human-capital` | The present value of your expected future earnings from work. | Early in a career this is usually your largest asset, even though it appears on no statement. | Financial capital, Present value (PV) | 0.1 |
| **Human life value** `human-life-value` | An estimate of the economic value of a person's future earnings to their dependants. |  | Human capital, Needs-based cover | 0.9 |
| **Impersonation fraud** `impersonation` | A scam in which criminals pose as officials, banks, relatives or companies to pressure a victim into paying or sharing access. |  | Phishing | 0.11 |
| **Income** `income` | Money received over a period, such as salary, business profit, rent, interest or dividends. | A flow: water coming out of a tap, measured per month or per year. | Wealth, Cash flow | 0.1 |
| **Inflation** `inflation` | The rate at which the general level of prices rises over a period. |  | Consumer Price Index (CPI), Purchasing power | 0.5 |
| **Inflation expectations** `inflation-expectations` | What households, firms and markets believe inflation will be in the future. | Expectations shape wages, prices and interest rates today, which is why central banks try to anchor them. | Inflation target | 0.5 |
| **Inflation target** `inflation-target` | The inflation rate a central bank is mandated to aim for; in India, 4% CPI inflation with a 2 to 6% tolerance band. |  | Inflation expectations | 0.5 |
| **Investing** `investing` | Putting saved money into assets that are expected to produce a return, while accepting some risk. | Saving decides how much; investing decides what the saved money does. | Saving | 0.1 |
| **Leverage** `leverage` | Using borrowed money so that you control more assets than your own equity; measured here as assets ÷ net worth. | A lever magnifies movement both ways: a 10% fall in assets can be a 50% fall in your equity. | Net worth, Debt-to-income (EMI ratio) | 0.3 |
| **Liability** `liability` | An amount you owe to someone else, such as a loan or a credit-card balance. | A claim on your future income or your assets. | Asset, Net worth | 0.1 |
| **Lifestyle inflation** `lifestyle-inflation` | Spending that rises as income rises, so that higher earnings do not raise saving. |  | Savings rate | 0.2 |
| **Liquid net worth** `liquid-net-worth` | Assets that can be turned into cash quickly without a large loss, minus debts that are due soon. | How long you could keep going if income stopped, without selling the house. | Net worth, Liquidity | 0.3 |
| **Liquidity** `liquidity` | How quickly and cheaply an asset can be turned into cash at close to its fair value. |  | Liquid net worth, Emergency fund | 0.3 |
| **Marginal tax rate** `marginal-tax-rate` | The tax rate that applies to your next rupee of income. | The rate that matters for decisions about extra income or deductions. | Average tax rate | 0.10 |
| **Minimum amount due** `minimum-due` | The smallest payment a card issuer accepts to avoid a late fee; paying only this keeps the rest of the balance accruing interest. |  | Revolving credit | 0.8 |
| **Moratorium period** `moratorium` | In health insurance, the period after which an insurer cannot reject a claim for non-disclosure except for proven fraud; currently 5 continuous years in India. |  | Waiting period | 0.9 |
| **Needs-based cover** `needs-based-cover` | Life cover sized to what dependants would need: future expenses, debts and goals, minus existing assets and cover. |  | Human life value | 0.9 |
| **Net worth** `net-worth` | Total assets minus total liabilities. |  | Liquid net worth, Wealth | 0.3 |
| **Nominal** `nominal` | Measured in current rupees, without adjusting for changes in prices. |  | Real | 0.1 |
| **Opportunity cost** `opportunity-cost` | The value of the best alternative you give up when you make a choice. |  | Discount rate | 0.4 |
| **Phishing** `phishing` | A message or site that imitates a trusted organisation to steal credentials, OTPs or money. |  | Impersonation fraud | 0.11 |
| **Ponzi scheme** `ponzi` | A fraud that pays existing investors with money from new investors rather than from real returns. | It needs ever-faster inflows, so it must collapse. | Guaranteed-return claim | 0.11 |
| **Premium** `premium` | The price paid for insurance cover. |  | Expected loss | 0.9 |
| **Prepayment** `prepayment` | Repaying part or all of a loan before it is due. |  | Refinancing, Amortisation | 0.8 |
| **Present value (PV)** `present-value` | What a future amount is worth today, after discounting at a chosen rate. | Compounding run backwards. | Future value (FV), Discount rate | 0.4 |
| **Purchasing power** `purchasing-power` | The quantity of goods and services a sum of money can buy. | Rupees are measured in rupees; purchasing power is measured in baskets of goods. | Inflation, Real | 0.1 |
| **Real** `real` | Adjusted for inflation, so that it measures purchasing power rather than rupees. |  | Nominal, Real return | 0.1 |
| **Real return** `real-return` | The return after adjusting for inflation: (1 + nominal) ÷ (1 + inflation) − 1. |  | Nominal, Inflation | 0.5 |
| **Reducing-balance interest** `reducing-balance` | Interest charged each period only on the principal still outstanding. |  | Flat rate | 0.8 |
| **Refinancing** `refinancing` | Replacing an existing loan with a new one on different terms, usually a lower rate. |  | Prepayment | 0.8 |
| **Revolving credit** `revolving-credit` | Credit you can borrow, repay and borrow again up to a limit, such as a credit card. |  | Minimum amount due | 0.8 |
| **Risk pooling** `risk-pooling` | Combining many similar, largely independent risks so that total losses become predictable and can be shared. |  | Risk transfer, Expected loss | 0.9 |
| **Risk transfer** `risk-transfer` | Paying someone else to bear a financial risk you would otherwise carry. |  | Risk pooling, Premium | 0.9 |
| **Runway** `runway` | How many months your liquid buffer can cover essential spending if income stops. |  | Emergency fund | 0.7 |
| **Saving** `saving` | The part of income that is not consumed. | Saving is a decision not to spend; it says nothing yet about where the money is kept. | Investing, Savings rate | 0.1 |
| **Savings rate** `savings-rate` | Saving divided by income for the same period, stated with a clear choice of income (take-home or gross). | The share of each rupee you keep. It matters more than the rupee amount because it scales with your life. | Saving, Free cash flow (personal) | 0.2 |
| **Secured debt** `secured-debt` | A loan backed by collateral that the lender can take if you do not repay, such as a home loan. |  | Unsecured debt, Collateral | 0.8 |
| **SIM swap** `sim-swap` | Fraud in which a criminal gets your mobile number moved to their SIM to receive your OTPs. |  | Two-factor authentication | 0.11 |
| **Simple interest** `simple-interest` | Interest calculated only on the original principal, never on interest already earned. |  | Compound interest | 0.4 |
| **SIP (systematic investment plan)** `sip` | Investing a fixed amount at regular intervals, usually monthly. |  | Annuity (level payments) | 0.6 |
| **Stock vs flow** `stock-flow` | A stock is a quantity measured at a moment (net worth); a flow is a quantity measured over a period (income per month). | Flows fill or drain stocks. Your balance sheet is stocks; your budget is flows. | Income, Wealth | 0.1 |
| **Sum assured** `sum-assured` | The amount a life insurance policy promises to pay on a claim. |  | Term insurance | 0.9 |
| **Sum insured** `sum-insured` | The maximum a health or general insurance policy will pay in a policy period. |  | Co-payment | 0.9 |
| **Take-home pay** `take-home` | Salary received in your bank account after tax, provident-fund and other deductions. |  | Income | 0.2 |
| **Tax drag** `tax-drag` | The reduction in long-run wealth caused by paying tax on returns, especially tax paid every year rather than deferred. |  | After-tax return | 0.10 |
| **Term insurance** `term-insurance` | Life insurance that pays a sum only if the insured person dies during the policy term, with no payout on survival. |  | Sum assured, Human life value | 0.9 |
| **Two-factor authentication** `two-factor` | Logging in with two independent proofs, such as a password plus a code from an app. |  | SIM swap | 0.11 |
| **Unsecured debt** `unsecured-debt` | A loan with no collateral, such as a personal loan or credit-card balance; usually more expensive. |  | Secured debt | 0.8 |
| **Variable expense** `variable-expense` | A necessary cost whose amount changes with use, such as groceries, fuel or electricity. |  | Fixed expense | 0.2 |
| **Waiting period** `waiting-period` | Time after buying a health policy during which certain conditions are not covered. |  | Moratorium period | 0.9 |
| **Wealth** `wealth` | The value of what you own minus what you owe at a point in time. | A stock: the water level in the tub, measured on a date. | Income, Net worth | 0.1 |
