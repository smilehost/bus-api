# Coding Standards and Development Workflow

**Strictly follow the coding standards defined in the project. No exceptions.**

Every line of code must comply with established project conventions file structure, architectural patterns.

The final output must be clean, maintainable, and ready for production.

Coding standarad can view the example in routeLocationRoute, routeLocationController, routeLocationService, routeLocationRepository.

If the coding standard is unclear, infer it from existing code or request guidance.

## Development Workflow (Two-Phase Process)

### Phase 1 – Logic Implementation:

*   Focus on solving the user’s problem logically.
*   Ignore minor syntax or linter errors unless they critically prevent progress.
*   Implement the **full logic** without being distracted by structure or cleanup.

### Phase 2 – Clear-up and Standardization:

*   Fix all remaining errors (syntax, runtime, type).
*   Refactor the **entire code** to follow project standards.
*   **Do not edit code in small pieces.**
    *   Instead, complete **one full file at a time** before moving on to the next.
    *   Avoid jumping between files for minor edits.
*   Perform all necessary cleanup and restructuring within that file in **one pass**.

## Code Management Rules:

*   Identify and list all related files at the beginning. If files are missing, clearly list them and prompt the user to attach them.
*   Edit **entire files at once**—not just small code snippets. Each response should cover the **full relevant file**, not isolated 1–2 line changes.
*   Handle all related code together, **efficiently** and **completely**.

## Key Principles:

*   **Phase 1: Solve the problem.**
*   **Phase 2: Make it perfect.**
*   **Edit full files completely**—do not scatter minor edits across multiple files.
*   **Final result must strictly follow the coding standards**—no compromises.
