# Custom Rules for GradeAI

- **No Planning Mode**:
  - Do not create implementation plans (`implementation_plan.md`) or wait for design/feedback approval for any tasks unless the user explicitly requests one. Proceed directly to writing code, proposing edits, and running commands.

- **Automated Testing on "test"**:
  - Whenever the user inputs the phrase "test", the agent must bypass planning and immediately run automated tests (starting the test server or running validation scripts) without waiting for instructions or prompting.
  - If any test errors, warnings, or bugs are found, the agent should proactively patch the code and re-test until verified, asking only for command execution approvals.
