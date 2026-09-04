import type { FeaturedProject } from "../types";
import dashboard from "@/assets/shots/icu-outcome-prediction/01-dashboard-desktop.png";
import shap from "@/assets/shots/icu-outcome-prediction/02-shap-desktop.png";

/**
 * The CV claims this beat the state of the art on 6 of 12 targets. That claim
 * is not in the repository, is not supported by the results, and is not on
 * this site. See docs/icu-sota-verification.md.
 */
export const icuOutcomePrediction: FeaturedProject = {
  featured: true,
  order: 6,
  slug: "icu-outcome-prediction",
  title: "ICU Outcome Prediction",
  pitch:
    "Twelve intensive-care outcomes predicted from the first 24 hours of a MIMIC-IV admission, with the model and the feature selector both decided by a 384-slot tournament.",
  role: "Project lead, team of four",
  year: "2026",
  status: "research",
  client: "Jaypee University of Information Technology",
  links: [],
  summary:
    "A clinical machine-learning pipeline on MIMIC-IV v2.2 covering 73,181 ICU stays. Twelve outcomes, from in-hospital mortality to organ support to length of stay, each predicted from a first-24-hour snapshot. I led a team of four through cohort extraction, feature engineering, model selection, ensembling and explainability.",
  problem:
    "Most work on this dataset picks one model family and one feature-selection method, then reports the number it got. Both of those are guesses, and the second one is rarely even mentioned. The harder problem is that the dataset actively rewards cheating: several outcome definitions overlap the window the features come from, so a model can score beautifully by detecting something that has already happened rather than predicting anything.",
  approach: [
    "The cohort is 73,181 adult ICU stays, features drawn strictly from the first 24 hours: vitals as min, max, mean and standard deviation, seventeen laboratory categories, cumulative urine output, treatment flags and seven ICD-coded comorbidities. Collinearity is stripped first with a Spearman filter at 0.85 and then an iterative VIF purge to below 5.",
    "Instead of choosing a feature-selection method, all four compete. Information gain, ANOVA F-test, mutual information and L1-penalised logistic regression each vote per target at a 90 percent cumulative-importance elbow, and each selector's per-target picks are unioned into one matrix. That gives four matrices of 47 to 62 features, and the tournament treats the selector as a tuned axis: 8 model families times 4 matrices times 12 targets, 384 slots.",
    "No matrix dominated, which is the result that justifies the design. Mutual information won 5 targets, LASSO 4, information gain 2, ANOVA 1. The seven-learner stacking ensemble, built on five-fold out-of-fold predictions with a logistic meta-learner, won 10 of 12 targets; CatBoost took both multiclass ones. Tuning then ran 50 Optuna trials per winner.",
    "Explainability is per model family rather than one-size-fits-all: tree explainers for the boosted models, a linear explainer for logistic regression, a deep explainer for the MLP, a kernel explainer for the FT-Transformer. For the stacked targets the explainer runs on the meta-learner, which means those plots answer which base learner is being trusted, not which lab value drives risk. The write-up says so, because a SHAP plot that gets read as the wrong question is worse than no plot.",
  ],
  decisions: [
    {
      claim:
        "The feature selector is a searched axis of the tournament, not a preprocessing step chosen once.",
      why: "Information gain, ANOVA, mutual information and LASSO disagree about which features matter, so picking one is picking a bias and then reporting the result as if it were the only option. Running all four against every model and every target turned that assumption into a measurement, and the measurement says there is no winner: four selectors split the twelve targets between them. A single fixed matrix would have quietly lost accuracy on two thirds of the targets.",
      tag: "correctness",
    },
    {
      claim:
        "Several of these AUROCs are detection, not prediction, and the write-up says which ones.",
      why: "Features cover hours 0 to 24, but labels like liver injury, AKI and ARDS are defined over the whole stay and can be triggered inside that same window. Liver injury is the clearest case: the label is ALT, AST or bilirubin above three times normal, and all three are features. That target scores 0.929 partly because the label restates the input. Reporting it next to mortality as though they were equally strong results would be the easiest way to be technically accurate and completely misleading.",
      tag: "trust",
    },
    {
      claim:
        "Both readmission targets stay in the report at 0.61 and 0.63, near chance.",
      why: "The obvious move is to drop the two targets that make the table look worse. They stay because they are the honest finding: a first-24-hour snapshot cannot see the post-24h trajectory and the discharge decision that actually drive readmission risk. Published models reach 0.73 and above on this, and they predict at discharge rather than at admission. Keeping the failures in is what makes the other ten numbers worth reading.",
      tag: "trust",
    },
    {
      claim:
        "The feature pipeline was rebuilt from scratch after ICD-code frequency features were found to be clinically unsound.",
      why: "Those features improved every metric, which is exactly why they were dangerous: diagnostic codes are assigned partly because the outcome happened. Keeping them would have produced a better-scoring model that predicts the recording of an event rather than the event. The rebuild cost weeks. The version of the result that survives scrutiny is the one that came after it.",
      tag: "correctness",
    },
    {
      claim:
        "Stacking uses five-fold out-of-fold predictions, and tuning deliberately touches only the meta-learner.",
      why: "A meta-learner trained on in-sample base predictions learns how confident the base models are on data they have memorised, which validates beautifully and collapses in the real world. Out-of-fold generation costs about forty model fits per slot and is the only version that means anything. Tuning the full stack under Optuna would have cost roughly 1,750 fits per target, so only the meta-learner's regularisation is searched, and the write-up states that this is why the stacked targets barely move under tuning rather than presenting a flat delta as a finding.",
      tag: "cost",
    },
  ],
  metrics: [
    { value: "73,181", label: "ICU stays in the cohort" },
    { value: "384", label: "tournament slots evaluated" },
    { value: "10 of 12", label: "targets won by the stacking ensemble" },
    { value: "0.897", label: "AUROC, in-hospital mortality" },
  ],
  stack: [
    {
      layer: "AI / ML",
      items: [
        "CatBoost",
        "XGBoost",
        "LightGBM",
        "Random Forest",
        "Logistic Regression",
        "Keras MLP",
        "FT-Transformer (PyTorch)",
        "Stacking ensemble",
      ],
    },
    {
      layer: "Data",
      items: [
        "MIMIC-IV v2.2",
        "KDIGO / Berlin / Sepsis-3",
        "SOFA",
        "Spearman + VIF purge",
        "Information gain",
        "ANOVA",
        "Mutual information",
        "LASSO",
      ],
    },
    { layer: "Testing", items: ["Optuna", "5-fold OOF", "Leakage rules module"] },
    { layer: "UI", items: ["SHAP", "Streamlit", "Plotly"] },
  ],
  shots: [
    {
      src: dashboard,
      alt: "The per-target Streamlit dashboard",
      device: "desktop",
      chrome: "streamlit / per-target metrics",
    },
    {
      src: shap,
      alt: "SHAP feature attributions",
      device: "desktop",
      chrome: "streamlit / SHAP attributions",
    },
  ],
  outcome:
    "Delivered and evaluated externally; the panel marked it above expectations. Two things I will not claim. It is not benchmarked against published work: comparing an AUROC across different cohort definitions and splits is not a comparison, and doing it properly needs matched inclusion criteria, confidence intervals and an external cohort such as eICU. And the highest scores here are the least meaningful ones, for the window-overlap reason above. The mortality figure and the tournament are the parts I would defend.",
};
