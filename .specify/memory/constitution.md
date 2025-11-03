<!--
Sync Impact Report:
- Version change: New constitution → v1.0.0
- Added sections: All core principles established
- Removed sections: None (new constitution)
- Templates requiring updates: ✅ plan-template.md updated (Constitution Check section)
- Follow-up TODOs: None
-->

# AI-MI Dynamic Web App Constitution

## Core Principles

### I. Component-First Architecture

Every feature MUST be built as reusable components with clear interfaces. Components MUST be self-contained, independently testable, and documented with clear responsibilities. No monolithic code blocks or tightly coupled implementations allowed.

### II. Test-Driven Development (NON-NEGOTIABLE)

Tests MUST be written before implementation. Red-Green-Refactor cycle strictly enforced: Tests written → Tests fail → Implementation → Tests pass → Refactor. Every user story requires acceptance tests that validate the complete user journey.

### III. Progressive Enhancement

Web app MUST work with basic HTML/CSS foundation, then enhance with JavaScript. Core functionality MUST remain accessible without JavaScript. Progressive layers: semantic HTML → responsive CSS → interactive JavaScript → advanced features.

## Web Application Standards

All dynamic web applications MUST adhere to:

- **Responsive Design**: Mobile-first approach, functional on all viewport sizes
- **Performance**: Page load time under 3 seconds on 3G networks
- **Accessibility**: WCAG 2.1 AA compliance for all user-facing features
- **Security**: Input validation, HTTPS enforcement, secure headers implementation
- **Browser Support**: Modern browsers (Chrome/Firefox/Safari/Edge latest 2 versions)

## Development Workflow

All feature development MUST follow this workflow:

1. **Specification**: User stories with acceptance criteria defined
2. **Design**: Component architecture and API contracts documented
3. **Implementation**: TDD with component tests, integration tests, e2e tests
4. **Review**: Code review focusing on constitution compliance
5. **Validation**: Automated testing pipeline and manual QA verification

## Governance

This constitution supersedes all other development practices. All pull requests MUST verify compliance with these principles. Any complexity that violates these principles MUST be explicitly justified with documented rationale. Constitution amendments require team consensus and version increment.

**Version**: 1.0.0 | **Ratified**: 2025-11-02 | **Last Amended**: 2025-11-02
