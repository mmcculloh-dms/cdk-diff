#!/usr/bin/env node

import { writeFileSync } from "fs";
import { resolve } from "path";
import { cwd } from "process";
import * as minimist from "minimist";
import { bootstrapCdkToolkit } from "./cdk-reverse-engineered";
import { renderCustomDiffToHtmlString } from "./render";
import { renderCustomDiffToMarkdownString } from "./render-markdown";
import { transformDiff } from "./transform";
import { NicerStackDiff } from "./types";

async function main() {
  const args = minimist(process.argv.slice(2));

  const stackNames = args._?.length > 0 ? args._ : ["**"];

  const cdkToolkit = await bootstrapCdkToolkit({
    profile: args.profile,
  });
  const rawDiffs = await cdkToolkit.getDiffObject({
    stackNames,
  });

  const nicerDiffs: NicerStackDiff[] = [];
  for (const rawDiff of rawDiffs) {
    nicerDiffs.push(await transformDiff(rawDiff));
  }

  if (args.html) {
    const html = renderCustomDiffToHtmlString(nicerDiffs, "CDK Diff");
    writeFileSync(resolve(cwd(), args.html), html);
  }

  if (args.md) {
    const md = renderCustomDiffToMarkdownString(nicerDiffs);
    writeFileSync(resolve(cwd(), args.md), md);
  }

  console.log(JSON.stringify(nicerDiffs, undefined, 2));
}

main().catch((e) => console.error(e));
