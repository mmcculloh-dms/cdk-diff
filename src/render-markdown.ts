import { NicerStackDiff } from "./types";

export const renderCustomDiffToMarkdownString = (
  diffs: NicerStackDiff[]
): string => {
  if (diffs.length == 0) {
    return "## No differences";
  }

  let outputString = "";

  diffs.forEach((stackDiff) => {
    let stringData = `\n\n## \`${stackDiff.stackName}\``;

    const iamChanges = stackDiff.diff?.find(
      (d) => d.label == "IAM Statement Changes"
    )?.cdkDiffRaw;

    if (iamChanges) {
      stringData += `\n\n\`\`\`text\n${iamChanges}\n\`\`\``;
    }

    if (stackDiff.diff) {
      stringData += `\n\n| Action | Type | LogicalId |\n|---:|---|---|`;
      stackDiff.diff?.forEach((diff) => {
        if (diff.nicerDiff?.resourceAction) {
          stringData += `\n| **${diff.nicerDiff?.resourceAction}** | ${diff.nicerDiff?.resourceType} | ${diff?.nicerDiff?.resourceLabel} |`;
        }
      });
    } else {
      stringData += `\nNo Changes`;
    }

    outputString += stringData;
  });

  return outputString;
};
