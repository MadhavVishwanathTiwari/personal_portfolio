# Cross-check: the "beat SOTA on 6 of 12 targets" claim

**Verdict: not supported, and not constructible. It is not on the site.**

You were right to be sceptical, and right to push back on my first pass — I had
checked three targets and generalised. All twelve are below.

## 1. The claim exists nowhere in the project

```bash
grep -rniE "sota|state.of.the.art|literature|benchmark|outperform" \
  --include=*.py --include=*.md --include=*.json --include=*.ipynb .
```

Zero hits across `D:\College\MinorProject`. The README reports AUROC per
target and never compares to published work. `results/` holds
`tournament_scores.json`, `best_hyperparams.json` and `tuning_summary.json`
— internal scores only, no external baseline anywhere. The claim exists only
in the CV.

Also: the project has **12** targets, not 13. The CV says 13.

## 2. All twelve targets against the literature

Yours are the tuned AUROCs from `results/tuning_summary.json`.

| Target | Yours | Closest published | Verdict |
| --- | --- | --- | --- |
| In-hospital mortality | 0.897 | 0.847–0.856, MIMIC-IV first-24h | **Above the number**, different cohort |
| AKI onset | 0.828 | 0.806, MIMIC-IV, 24h features → 24–72h outcome | Above the number, **easier task** |
| ARDS onset | 0.937 | 0.843–0.89, eARDS, 12h before Berlin criteria | Above the number, **much easier task** |
| Liver injury | 0.929 | none comparable found | **Label restates the features** |
| Sepsis onset | 0.791 | 0.89–0.95, Sepsis-3 onset within 48h | **Clearly below** |
| Need for ventilation | 0.896 | no matching target definition | Unassessable |
| Need for vasopressors | 0.887 | no matching target definition | Unassessable |
| Need for RRT | 0.947 | no matching target definition | Unassessable |
| ICU readmit 48h | 0.609 | 0.726–0.771 (iREAD, at discharge) | **Clearly below** |
| ICU readmit 7d | 0.627 | ~0.77–0.82 overall readmission | **Clearly below** |
| LOS category | 0.775 | 0.742–0.747, but **binary** prolonged-LOS | Not comparable, multiclass macro OvR |
| Discharge disposition | 0.821 | none found | Unassessable |

Tally: **three clearly below**, **five with no comparable benchmark at all**,
**two above the number but on a materially easier task**, **one where the
label restates the input**, and **one — mortality — that is genuinely the
strongest reading here**, and even that is not like-for-like.

So "6 of 12" cannot be assembled even generously. You would need six targets
that each have a published benchmark on a matching task definition, and only
about half the targets have a published benchmark at all.

## 3. Why "above the number" is not "beat SOTA"

**Mortality.** The published MIMIC-IV figures come from a 53,866-stay cohort;
yours is 73,181, with different inclusion criteria and therefore a different
outcome prevalence. They report confidence intervals and external validation
against eICU. You have one random split, no CI, no external cohort. AUROC is
not portable across cohort definitions — a higher number on a differently
constructed cohort is not a better model, and the gap here (0.897 vs 0.856)
is well within what a cohort change can produce on its own.

**AKI.** The comparison study deliberately puts features in hours 0–24 and the
outcome window in hours 24–72, specifically to remove leakage. Yours takes a
creatinine baseline at hours ≤6 and looks for the rise from hour 6 to hour
168, so a rise occurring between hours 6 and 24 is inside the feature window,
and 24-hour creatinine min/max/mean/SD are features. You score 0.828 on an
easier problem than their 0.806. That is not a win.

**ARDS.** eARDS predicts ARDS **12 hours before** the Berlin criteria are met.
Yours labels ARDS if P/F ≤ 300 at any point in the stay, first 24 hours
included. Those are different problems and yours is the easier one.

**Readmission.** Worth noting in your favour: iREAD predicts at **discharge**;
you predict from the **first 24 hours of admission**, which is far harder and
arguably ill-posed. The comparison is unfair to you. It still does not become
a win.

## 4. The structural problem underneath all of it

Features come from hours 0–24. Several labels are defined over the whole stay,
including those same 24 hours. `leakage_rules.py` says so in its own docstring:

> First-24h treatment flags ... are near-outcome proxies when the label is
> need_vent / need_vaso / need_rrt (any time during stay, including the same
> 0–24h window).

Dropping the three treatment flags removes the most direct proxy, not the
physiology that produced it. And the same overlap hits targets with no
leakage rule at all:

- **Liver injury** — label is ALT, AST or bilirubin above 3× ULN at any point
  in the stay. All three are in the 24-hour feature set. For any patient who
  crossed the threshold before hour 24, the label is restating a feature.
  AUROC 0.929 is largely explained by this.
- **AKI** — as above, the rise can occur inside the feature window.
- **ARDS** — P/F ≤ 300 at any point, first 24 hours included.
- **Sepsis** — culture and antibiotics from hour −24 to +72; SOFA baseline
  from hours −6 to +6.

Which means the four highest AUROCs in the table (RRT 0.947, ARDS 0.937,
liver 0.929, mortality 0.897) are not four equally strong results. Three of
them are substantially concurrent detection rather than prediction. This is
the finding that matters, and it is independent of any benchmark.

## 5. What is defensible, and what the site now says

- 73,181 ICU stays, 12 targets, first-24h features only.
- A 384-slot tournament — 8 model families × 4 feature matrices × 12 targets —
  so the feature selector is searched rather than assumed. **No matrix
  dominated**: MI won 5 targets, LASSO 4, IG 2, ANOVA 1. That is the result
  that justifies the whole design, and it is a real finding.
- The stacking ensemble won 10 of 12; CatBoost took both multiclass targets.
- Mortality at 0.897 is a genuinely respectable number.
- Both readmission targets sit near chance and the README reports them anyway.
- An explicit leakage module exists at all, which most student work on this
  dataset does not have.

The case study now leads with the tournament, states the window-overlap
caveat itself, and explicitly declines to claim a benchmark win. That reads
better to a client than an unverifiable SOTA claim: it is the same argument
the rest of the site makes about putting rules where they cannot be bypassed.

## 6. If you want a benchmark claim back

It needs a fixed comparison cohort matching a named paper's inclusion
criteria, identical outcome definitions with the label window moved strictly
after the feature window, bootstrap confidence intervals on your AUROC, and
ideally eICU as external validation. That is a paper's worth of work, not a
paragraph. Until then the tournament is the story, and it is a good one.

Sources consulted:

- [Calibrated and Interpretable Machine Learning for ICU Mortality Prediction Using First 24-Hour Clinical Data](https://www.medrxiv.org/content/10.64898/2026.05.30.26354524v1.full)
- [Forecasting ICU Acute Kidney Injury with Actionable Lead Time](https://doi.org/10.3390/jcm15031191)
- [eARDS: multi-center validation of early-onset ARDS prediction](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8462682/)
- [Supervised machine learning for the early prediction of ARDS](https://www.sciencedirect.com/science/article/pii/S0883944120306237)
- [Predicting sepsis onset using a machine learned causal probabilistic network](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10359402/)
- [Multicenter validation of iREAD, ICU readmission within 48 hours](https://www.thelancet.com/journals/eclinm/article/PIIS2589-5370(25)00044-6/fulltext)
- [Predicting Prolonged Length of ICU Stay through Machine Learning](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8700580/)
- [Predicting ICU Interventions: Multivariate Time Series GCN](https://pubmed.ncbi.nlm.nih.gov/38512747/)
