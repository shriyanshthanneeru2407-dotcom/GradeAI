# Custom Rules for GradeAI

- **Automated Testing on "test"**:
  - Whenever the user inputs the phrase "test", the agent should immediately run automated tests (such as starting a local test runner or using Chrome DevTools if configured) without waiting for further instruction or prompting.
  - If any test errors, console warnings, or build issues are encountered, the agent must proactively research, patch the code, and re-run tests until the application is fully functional.
  - While the agent must always propose commands for user approval (due to platform security constraints), it should construct the entire test-patch-verify loop as efficiently as possible.
