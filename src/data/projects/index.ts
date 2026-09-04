import type { Project } from "../types";
import { autoreceptionist } from "./autoreceptionist";
import { outreachOpsCrm } from "./outreach-ops-crm";
import { priyaTripathi } from "./priya-tripathi";
import { kfiq } from "./kfiq";
import { p4Realty } from "./p4-realty";
import { synapse } from "./synapse";
import { icuOutcomePrediction } from "./icu-outcome-prediction";
import {
  arLeadFinder,
  endoleExtractor,
  kfiqProgressTracker,
  shivohamWebgl,
} from "./secondary";

/** The single source of truth. Ordered as they appear on the site. */
export const projects: Project[] = [
  autoreceptionist,
  outreachOpsCrm,
  priyaTripathi,
  kfiq,
  p4Realty,
  synapse,
  icuOutcomePrediction,
  arLeadFinder,
  endoleExtractor,
  kfiqProgressTracker,
  shivohamWebgl,
].sort((a, b) => a.order - b.order);
