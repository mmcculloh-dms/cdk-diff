import { TypeScriptAppProject } from "projen";
const project = new TypeScriptAppProject({
  defaultReleaseBranch: "main",
  name: "cdk-diff",
  description: "Ignore me, for now",
  projenrcTs: true,
  deps: [
    "@aws-cdk/cloud-assembly-schema",
    "@aws-cdk/cloudformation-diff",
    "@aws-cdk/cx-api",
    "aws-cdk",
    "colors",
    "through2",
    "diff2html",
    "diff",
    "minimist",
  ],
  devDeps: [
    "@types/colors",
    "@types/diff",
    "@types/through2",
    "@types/hogan.js",
    "@types/minimist",
    "copyfiles",
  ],
  eslintOptions: {
    dirs: ["src", "test", ".projenrc.ts"],
    prettier: true,
  },
});

project.package.addField("bin", "./lib/cli.js");

project.compileTask.exec("copyfiles -f src/pretty-diff-template.html lib");

project.synth();
