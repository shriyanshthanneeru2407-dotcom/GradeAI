# Custom Rules for GradeAI

- **No Planning Mode**:
  - Do not create implementation plans (`implementation_plan.md`) or wait for design/feedback approval for any tasks unless the user explicitly requests one. Proceed directly to writing code, proposing edits, and running commands.

- **Automated Testing on "test"**:
  - Whenever the user inputs the phrase "test", the agent must bypass planning and immediately run automated tests (starting the test server or running validation scripts) without waiting for instructions or prompting.
  - If any test errors, warnings, or bugs are found, the agent should proactively patch the code and re-test until verified, asking only for command execution approvals.

- **Automated Repository & Deployment Setup on "repo"**:
  - Whenever the user inputs the phrase "repo", the agent must bypass planning and automatically execute the following pipeline:
    1. **Vercel Deployment**: Run `npx vercel --yes` to configure and deploy the current project to Vercel.
    2. **Local Git Setup**: Run `git init`, set up `.gitignore` (excluding `.vercel/`, `.DS_Store`, etc.), stage all files, and commit locally.
    3. **Retrieve Credentials**: Query the git credential helper using `echo "url=https://github.com/shriyanshthanneeru2407-dotcom" | git credential fill` to extract the GitHub Personal Access Token.
    4. **Create GitHub Repo**: Call the GitHub REST API (via `curl` with the retrieved token) to create a new public repository under your username `shriyanshthanneeru2407-dotcom` named after the current project folder.
    5. **Push to GitHub**: Add the remote origin and force-push the repository to the `main` branch.
    6. **Premium README.md**: Generate or update `README.md` to be a premium, high-fidelity document styled exactly like the `water-tracker`, `pingpong`, `GradeAI`, and `groovio` READMEs (including badges, features, tech stack, installation, and visual file tree).
    7. **Non-interactive Proactive Execution**: Do not ask the user questions or request them to run manual commands. Propose the necessary terminal commands directly for them to approve.
